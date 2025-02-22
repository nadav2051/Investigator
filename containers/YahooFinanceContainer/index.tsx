import { useState, useEffect } from 'react';
import { ContainerProps } from '../../types/container';
import { StockData } from './types';
import { fetchStockData } from './api';
import StockDisplay from './components/StockDisplay';
import LoadingOverlay from '../../components/LoadingOverlay';
import LoadingSpinner from '../../components/LoadingSpinner';

const YahooFinanceContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: StockData | null;
  }>({
    loading: false,
    error: null,
    data: null
  });

  useEffect(() => {
    if (!searchQuery) return;

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetchStockData(searchQuery);
        setState(prev => ({ ...prev, data, loading: false }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch stock data',
          loading: false
        }));
      }
    };

    loadData();
  }, [searchQuery]);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Stock Information</h2>
        {state.loading && <LoadingSpinner size="sm" />}
      </div>
      
      {!searchQuery && (
        <div className="text-gray-500 text-center py-8">
          Enter a stock symbol to view detailed information
        </div>
      )}

      {searchQuery && state.loading && (
        <LoadingOverlay message={`Loading data for ${searchQuery.toUpperCase()}...`} />
      )}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <div className="font-medium">Error</div>
          <div className="text-sm">{state.error}</div>
        </div>
      )}

      {!state.loading && !state.error && state.data && (
        <StockDisplay data={state.data} />
      )}
    </div>
  );
};

// Export both the component and its metadata
export const YahooFinanceConfig = {
  title: 'Yahoo Finance',
  description: 'Displays real-time stock information and historical returns',
  Component: YahooFinanceContainer
};

// Default export for the config
export default YahooFinanceConfig; 