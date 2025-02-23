import { useState, useEffect } from 'react';
import { ContainerProps } from '../../types/container';
import { StockData } from './types';
import { fetchStockData } from './api';
import StockDisplay from './components/StockDisplay';
import LoadingOverlay from '../../components/LoadingOverlay';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import ContainerHeader from '../../components/ContainerHeader';
import { AskAI } from '../../components/AskAI';

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

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setState({ loading: false, error: null, data: null });
      return;
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetchStockData(searchQuery);
        if (!data) {
          throw new Error('No data received');
        }
        setState({ loading: false, error: null, data });
      } catch (error) {
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stock data',
          data: null
        });
      }
    };

    loadData();
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Stock Information</h2>
        <div className="text-gray-500 text-center py-8">
          Enter a stock symbol to view detailed information
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <ContainerHeader
        title="Stock Information"
        symbol={searchQuery}
        isLoading={state.loading}
        isCollapsed={isCollapsed}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
        className="bg-gradient-to-r from-blue-50 to-indigo-50/50"
        aiProps={state.data ? {
          containerType: "yahoo",
          containerData: state.data,
          onOpen: () => setIsCollapsed(false)
        } : undefined}
      />

      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'h-0 overflow-hidden' : ''}`}>
        <div className="p-4 border-t">
          {state.loading && !state.data && (
            <LoadingOverlay message={`Loading data for ${searchQuery.toUpperCase()}...`} />
          )}

          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <div className="font-medium">Error</div>
              <div className="text-sm">{state.error}</div>
            </div>
          )}

          {state.data && (
            <div className={`max-h-[800px] overflow-y-auto ${state.loading ? 'opacity-50' : ''}`}>
              <StockDisplay data={state.data} isLoading={state.loading} />
            </div>
          )}
        </div>
      </div>
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