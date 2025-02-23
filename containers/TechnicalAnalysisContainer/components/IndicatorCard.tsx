import React from 'react';
import { TechnicalIndicator } from '../types';

interface IndicatorCardProps {
  indicator: TechnicalIndicator;
  showSignal?: boolean;
}

const getIndicatorDescription = (name: string): string => {
  if (name.startsWith('SMA')) {
    return `Simple Moving Average (${name}): Calculates the arithmetic mean of prices over the specified period. Used to identify trend direction and potential support/resistance levels.`;
  }
  if (name.startsWith('EMA')) {
    return `Exponential Moving Average (${name}): Similar to SMA but gives more weight to recent prices. Responds more quickly to price changes than SMA.`;
  }
  if (name === 'RSI') {
    return 'Relative Strength Index: Measures the speed and magnitude of recent price changes to evaluate overbought (>70) or oversold (<30) conditions.';
  }
  if (name === 'MACD Line') {
    return 'Moving Average Convergence Divergence Line: Shows the relationship between two moving averages of prices. Used to identify momentum changes.';
  }
  if (name === 'Signal Line') {
    return 'MACD Signal Line: A moving average of the MACD line. When MACD crosses above/below this line, it may indicate buy/sell opportunities.';
  }
  if (name === 'MACD Histogram') {
    return 'MACD Histogram: Shows the difference between MACD and Signal lines. The size and direction of the histogram can indicate momentum strength.';
  }
  if (name === 'Upper Band') {
    return 'Bollinger Upper Band: Standard deviations above the middle band. Price reaching this level might indicate overbought conditions.';
  }
  if (name === 'Middle Band') {
    return 'Bollinger Middle Band: The 20-day simple moving average. Acts as a base for the upper and lower bands.';
  }
  if (name === 'Lower Band') {
    return 'Bollinger Lower Band: Standard deviations below the middle band. Price reaching this level might indicate oversold conditions.';
  }
  return 'Technical indicator used for market analysis';
};

const getSignalExplanation = (signal: 'buy' | 'sell' | 'neutral', indicatorName: string): string => {
  if (indicatorName === 'RSI') {
    switch (signal) {
      case 'buy': return 'RSI below 30 indicates oversold conditions';
      case 'sell': return 'RSI above 70 indicates overbought conditions';
      default: return 'RSI between 30-70 indicates neutral conditions';
    }
  }
  
  if (indicatorName.includes('Band')) {
    switch (signal) {
      case 'buy': return 'Price near/below lower band suggests potential oversold conditions';
      case 'sell': return 'Price near/above upper band suggests potential overbought conditions';
      default: return 'Price within bands suggests normal trading conditions';
    }
  }

  if (indicatorName.includes('MACD')) {
    switch (signal) {
      case 'buy': return 'MACD above signal line suggests bullish momentum';
      case 'sell': return 'MACD below signal line suggests bearish momentum';
      default: return 'No clear momentum direction';
    }
  }

  switch (signal) {
    case 'buy': return 'Price above the moving average suggests upward trend';
    case 'sell': return 'Price below the moving average suggests downward trend';
    default: return 'No clear trend direction';
  }
};

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  indicator,
  showSignal = true
}) => {
  const getSignalColor = (signal?: 'buy' | 'sell' | 'neutral') => {
    switch (signal) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200 relative group">
      {/* Tooltip */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg w-64 z-10 pointer-events-none">
        <div className="font-medium mb-1">{indicator.name}</div>
        <div className="text-xs">{getIndicatorDescription(indicator.name)}</div>
        {showSignal && indicator.signal && (
          <div className="mt-1 text-xs text-gray-300">
            {getSignalExplanation(indicator.signal, indicator.name)}
          </div>
        )}
        {/* Arrow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{indicator.name}</h3>
        {showSignal && indicator.signal && (
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSignalColor(indicator.signal)}`}>
            {indicator.signal.toUpperCase()}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold" style={{ color: indicator.color }}>
        {indicator.value.toFixed(2)}
      </div>
    </div>
  );
};

export default IndicatorCard; 