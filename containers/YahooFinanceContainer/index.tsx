import { useState, useEffect } from 'react';
import { ContainerProps } from '../../types/container';
import { StockData } from './types';
import { fetchStockData } from './api';
import StockDisplay from './components/StockDisplay';

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
      <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
      
      {state.loading && (
        <div className="text-gray-500">Loading stock data...</div>
      )}

      {state.error && (
        <div className="text-red-500">
          {state.error}
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