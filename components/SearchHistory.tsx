import { FC } from 'react';

const DEFAULT_STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA'];

interface SearchHistoryProps {
  onSelect: (symbol: string) => void;
  searchHistory: string[];
}

const SearchHistory: FC<SearchHistoryProps> = ({ onSelect, searchHistory }) => {
  // Use history if available, otherwise use default stocks
  const displayedStocks = searchHistory.length > 0 ? searchHistory : DEFAULT_STOCKS;

  return (
    <div className="mt-2">
      <div className="text-sm text-gray-500 mb-2">
        {searchHistory.length > 0 ? 'Recent Searches:' : 'Popular Stocks:'}
      </div>
      <div className="flex flex-wrap gap-2">
        {displayedStocks.map(symbol => (
          <button
            key={symbol}
            onClick={() => onSelect(symbol)}
            className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg 
                     hover:bg-gray-50 hover:border-primary/30 hover:text-primary 
                     transition-all duration-200"
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory; 