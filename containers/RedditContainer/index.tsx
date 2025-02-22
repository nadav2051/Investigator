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
        // First fetch Reddit data
        const data = await fetchRedditData(searchQuery);
        if (!data) {
          throw new Error('No data received from Reddit API');
        }

        // Set initial data without AI analysis
        setState(prev => ({ 
          ...prev, 
          loading: false,
          data
        }));

        // Then fetch AI analysis separately
        setState(prev => ({ 
          ...prev, 
          aiLoading: true,
          data: {
            ...data,
            aiAnalysis: { 
              summary: "Loading AI analysis...",
              overallSentiment: 0,
              isLoading: true,
              ticker: searchQuery.toUpperCase()
            }
          }
        }));

        try {
          const aiResponse = await fetch(
            `/api/analyze-reddit?symbol=${searchQuery}&posts=${encodeURIComponent(JSON.stringify(data.posts))}`
          );
          
          if (!aiResponse.ok) {
            throw new Error('AI analysis failed');
          }

          const aiAnalysis = await aiResponse.json();
          
          // Update posts with AI sentiment
          const updatedPosts = data.posts.map((post, i) => ({
            ...post,
            aiSentiment: aiAnalysis.postAnalyses?.[i] ? {
              score: aiAnalysis.postAnalyses[i].sentiment,
              explanation: aiAnalysis.postAnalyses[i].explanation
            } : undefined
          }));

          setState(prev => ({
            ...prev,
            aiLoading: false,
            data: prev.data ? {
              ...prev.data,
              posts: updatedPosts,
              aiAnalysis: {
                ...aiAnalysis,
                isLoading: false
              }
            } : null
          }));
        } catch (error) {
          console.error('AI analysis error:', error);
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