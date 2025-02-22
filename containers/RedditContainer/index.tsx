import { useState, useEffect } from 'react';
import type { ContainerProps } from '../../types/container';
import { RedditData, fetchRedditData } from './api';
import RedditDisplay from './components/RedditDisplay';
import LoadingOverlay from '../../components/LoadingOverlay';

const RedditContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: RedditData | null;
    debug?: any;
  }>({
    loading: false,
    error: null,
    data: null
  });

  useEffect(() => {
    // Log the effect trigger
    console.log('\n🔵 Reddit Container useEffect:', { searchQuery });
    
    if (!searchQuery) {
      console.log('⚠️ No search query, resetting state');
      setState({ loading: false, error: null, data: null });
      return;
    }

    const loadData = async () => {
      console.log('🔄 Starting Reddit data load...');
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Check environment variables
        console.log('📝 Checking Reddit API credentials:');
        console.log('- Client ID:', !!process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID);
        console.log('- Client Secret:', !!process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET);
        console.log('- Refresh Token:', !!process.env.NEXT_PUBLIC_REDDIT_REFRESH_TOKEN);

        if (!process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID ||
            !process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET ||
            !process.env.NEXT_PUBLIC_REDDIT_REFRESH_TOKEN) {
          throw new Error('Missing Reddit API credentials');
        }

        // Attempt to fetch data
        console.log('📡 Calling Reddit API for:', searchQuery);
        const data = await fetchRedditData(searchQuery);
        console.log('✅ Reddit data received:', data);

        if (!data) {
          throw new Error('No data received from Reddit API');
        }

        setState({ loading: false, error: null, data });
      } catch (error) {
        console.error('❌ Reddit fetch error:', error);
        setState({
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch Reddit data',
          data: null,
          debug: { error, timestamp: new Date().toISOString() }
        });
      }
    };

    loadData();
  }, [searchQuery]);

  // Render empty state if no query
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

      {/* Debug info */}
      <div className="mb-4 text-xs text-gray-500">
        Query: {searchQuery}, Loading: {String(state.loading)}, Has Data: {String(!!state.data)}
      </div>

      {state.loading && !state.data && (
        <LoadingOverlay message={`Loading Reddit data for ${searchQuery.toUpperCase()}...`} />
      )}

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="font-medium text-red-700">Error Loading Reddit Data</div>
          <div className="text-sm text-red-600 mt-1">{state.error}</div>
          {state.debug && (
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
              {JSON.stringify(state.debug, null, 2)}
            </pre>
          )}
        </div>
      )}

      {state.data && (
        <RedditDisplay data={state.data} isLoading={state.loading} />
      )}
    </div>
  );
};

// Export both the component and its metadata
export const RedditConfig = {
  title: 'Reddit Discussions',
  description: 'Shows Reddit discussions, sentiment analysis, and community insights',
  Component: RedditContainer
};

// Default export for the config
export default RedditConfig; 