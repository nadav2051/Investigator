import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { TechnicalAnalysisData, TechnicalIndicator } from './types';

interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const calculateSMA = (prices: number[], period: number): TechnicalIndicator => {
  const smaValues = SMA.calculate({ period, values: prices });
  const latestValue = smaValues[smaValues.length - 1];
  
  return {
    name: `SMA ${period}`,
    value: latestValue,
    values: smaValues,
    signal: prices[prices.length - 1] > latestValue ? 'buy' : 'sell',
    color: '#2196F3'
  };
};

const calculateEMA = (prices: number[], period: number): TechnicalIndicator => {
  const ema = EMA.calculate({ period, values: prices });
  const latestValue = ema[ema.length - 1];
  
  return {
    name: `EMA ${period}`,
    value: latestValue,
    signal: prices[prices.length - 1] > latestValue ? 'buy' : 'sell',
    color: '#4CAF50'
  };
};

const calculateRSI = (prices: number[], period: number = 14): TechnicalIndicator => {
  const rsi = RSI.calculate({ period, values: prices });
  const latestValue = rsi[rsi.length - 1];
  
  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  if (latestValue > 70) signal = 'sell';
  else if (latestValue < 30) signal = 'buy';

  return {
    name: 'RSI',
    value: latestValue,
    signal,
    color: '#FF9800'
  };
};

const calculateMACD = (prices: number[]): {
  macdLine: TechnicalIndicator;
  signalLine: TechnicalIndicator;
  histogram: TechnicalIndicator;
} => {
  const macdInput = {
    values: prices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  };

  const macdResults = MACD.calculate(macdInput);
  const latest = macdResults[macdResults.length - 1];
  
  return {
    macdLine: {
      name: 'MACD Line',
      value: latest.MACD || 0,
      signal: (latest.MACD || 0) > (latest.signal || 0) ? 'buy' : 'sell',
      color: '#E91E63'
    },
    signalLine: {
      name: 'Signal Line',
      value: latest.signal || 0,
      signal: (latest.MACD || 0) > (latest.signal || 0) ? 'buy' : 'sell',
      color: '#9C27B0'
    },
    histogram: {
      name: 'MACD Histogram',
      value: latest.histogram || 0,
      signal: (latest.histogram || 0) > 0 ? 'buy' : 'sell',
      color: '#673AB7'
    }
  };
};

const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
  const bb = BollingerBands.calculate({
    period,
    values: prices,
    stdDev
  });

  const latest = bb[bb.length - 1];
  const currentPrice = prices[prices.length - 1];
  
  const upperSignal: 'buy' | 'sell' | 'neutral' = currentPrice > latest.upper ? 'sell' : 'neutral';
  const lowerSignal: 'buy' | 'sell' | 'neutral' = currentPrice < latest.lower ? 'buy' : 'neutral';

  return {
    upper: {
      name: 'Upper Band',
      value: latest.upper,
      signal: upperSignal,
      color: '#F44336'
    },
    middle: {
      name: 'Middle Band',
      value: latest.middle,
      signal: 'neutral' as const,
      color: '#3F51B5'
    },
    lower: {
      name: 'Lower Band',
      value: latest.lower,
      signal: lowerSignal,
      color: '#009688'
    }
  };
};

export const calculateIndicators = (historicalData: HistoricalDataPoint[]): TechnicalAnalysisData => {
  const prices = historicalData.map(d => d.close);

  return {
    prices: historicalData.map(d => ({
      timestamp: d.timestamp,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume
    })),
    sma20: calculateSMA(prices, 20),
    sma50: calculateSMA(prices, 50),
    sma150: calculateSMA(prices, 150),
    sma200: calculateSMA(prices, 200),
    ema20: calculateEMA(prices, 20),
    rsi: calculateRSI(prices),
    macd: calculateMACD(prices),
    bollingerBands: calculateBollingerBands(prices),
    lastUpdated: new Date().toISOString()
  };
}; 