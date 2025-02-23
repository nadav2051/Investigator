export interface TechnicalIndicator {
  name: string;
  value: number;
  signal?: 'buy' | 'sell' | 'neutral';
  color?: string;
}

export interface TechnicalAnalysisData {
  // Price data for charts
  prices: {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];

  // Moving Averages
  sma20?: TechnicalIndicator;
  sma50?: TechnicalIndicator;
  sma200?: TechnicalIndicator;
  ema20?: TechnicalIndicator;

  // Momentum Indicators
  rsi?: TechnicalIndicator;
  macd?: {
    macdLine: TechnicalIndicator;
    signalLine: TechnicalIndicator;
    histogram: TechnicalIndicator;
  };

  // Volatility Indicators
  bollingerBands?: {
    upper: TechnicalIndicator;
    middle: TechnicalIndicator;
    lower: TechnicalIndicator;
  };

  lastUpdated: string;
}

export interface ChartData {
  time: number;
  value: number;
}

export interface TechnicalAnalysisProps {
  data: TechnicalAnalysisData;
  isLoading?: boolean;
} 