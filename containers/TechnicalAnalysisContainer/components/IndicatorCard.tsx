import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TechnicalIndicator } from '../types';

interface IndicatorCardProps {
  indicator: TechnicalIndicator;
  showSignal?: boolean;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
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
  showSignal = true,
  onToggleVisibility,
  isVisible = true
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  const updateTooltipPosition = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // Position above the card
        left: rect.left + (rect.width / 2) // Center horizontally
      });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateTooltipPosition);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [showTooltip]);

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

  const tooltipContent = showTooltip && createPortal(
    <div 
      className="fixed transform -translate-x-1/2 -translate-y-full px-3 py-2 bg-gray-900 text-white text-xs rounded-lg w-64 pointer-events-none"
      style={{ 
        top: `${tooltipPosition.top}px`, 
        left: `${tooltipPosition.left}px`,
        zIndex: 9999
      }}
    >
      <div className="font-medium mb-1">{indicator.name}</div>
      <div className="text-gray-300">{getIndicatorDescription(indicator.name)}</div>
      {showSignal && indicator.signal && (
        <div className="mt-1 text-gray-400 text-[11px]">
          {getSignalExplanation(indicator.signal, indicator.name)}
        </div>
      )}
      {/* Arrow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
    </div>,
    document.body
  );

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100/50 relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Gradient accent bar based on signal */}
      <div className={`absolute top-0 left-0 w-full h-0.5 ${
        indicator.signal === 'buy' ? 'bg-gradient-to-r from-green-400 to-green-500' :
        indicator.signal === 'sell' ? 'bg-gradient-to-r from-red-400 to-red-500' :
        'bg-gradient-to-r from-yellow-400 to-yellow-500'
      }`} />

      {tooltipContent}

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-sm font-medium truncate text-gray-700">{indicator.name}</h3>
            {onToggleVisibility && (
              <button
                onClick={onToggleVisibility}
                className={`w-6 h-3.5 rounded-full transition-colors duration-200 ease-in-out relative ${
                  isVisible ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gray-200'
                }`}
              >
                <span 
                  className={`absolute top-0 left-0 w-3 h-3 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                    isVisible ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
          </div>
          {showSignal && indicator.signal && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              indicator.signal === 'buy' ? 'bg-green-100 text-green-700' :
              indicator.signal === 'sell' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {indicator.signal.toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-base font-semibold mt-1.5" style={{ color: indicator.color }}>
          {indicator.value.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default IndicatorCard; 