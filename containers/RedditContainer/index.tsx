import { useState, useEffect } from 'react';
import type { ContainerProps } from '../../types/container';
import { RedditData, fetchRedditData } from './api';
import RedditDisplay from './components/RedditDisplay';
import LoadingOverlay from '../../components/LoadingOverlay';

const RedditContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [state, setState] = useState<{
    loading: boolean;
    aiLoading: boolean;
    error: string | null;
    data: RedditData | null;
  }>({
    loading: false,
    aiLoading: false,
    error: null,
    data: null
  });

  useEffect(() => {
    if (!searchQuery) {
      setState({ loading: false, aiLoading: false, error: null, data: null });
      return;
    }

    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        if (!process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ||
            !process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET ||
            !process.env.NEXT_PUBLIC_REDDIT_REFRESH_TOKEN) {
          throw new Error('Missing Reddit API credentials');
        }

        const data = await fetchRedditData(searchQuery);
        if (!data) {
          throw new Error('No data received from Reddit API');
        }

        setState(prev => ({ 
          ...prev, 
          loading: false, 
          aiLoading: true,
          error: null, 
          data: {
            ...data,
            aiAnalysis: { 
              summary: "Loading AI analysis...",
              overallSentiment: 0,
              isLoading: true
            }
          }
        }));

        try {
          const aiData = await fetch(`/api/analyze-reddit?symbol=${searchQuery}`);
          const aiAnalysis = await aiData.json();
          
          setState(prev => ({
            ...prev,
            aiLoading: false,
            data: prev.data ? {
              ...prev.data,
              aiAnalysis: {
                ...aiAnalysis,
                isLoading: false
              }
            } : null
          }));
        } catch (error) {
          setState(prev => ({
            ...prev,
            aiLoading: false,
            data: prev.data ? {
              ...prev.data,
              aiAnalysis: undefined
            } : null
          }));
        }
      } catch (error) {
        setState({
          loading: false,
          aiLoading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch Reddit data',
          data: null
        });
      }
    };

    loadData();
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Reddit Discussions</h2>
        <div className="text-gray-500 text-center py-8">
          Enter a stock symbol to view Reddit discussions and sentiment
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Reddit Discussions</h2>

      {state.loading && !state.data && (
        <LoadingOverlay message={`Loading Reddit data for ${searchQuery.toUpperCase()}...`} />
      )}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="font-medium text-red-700">Error Loading Reddit Data</div>
          <div className="text-sm text-red-600 mt-1">{state.error}</div>
        </div>
      )}

      {state.data && (
        <RedditDisplay data={state.data} isLoading={state.loading} />
      )}
    </div>
  );
};

export const RedditConfig = {
  title: 'Reddit Discussions',
  description: 'Shows Reddit discussions, sentiment analysis, and community insights',
  Component: RedditContainer
};

export default RedditConfig; 