// Types
export interface RedditPost {
  subreddit: string;
  title: string;
  url: string;
  score: number;
  num_comments: number;
  created_utc: number;
  sentiment: number;
  rawSentiment?: number;
  aiSentiment?: {
    score: number;
    explanation: string;
  };
}

export interface SearchInfo {
  subreddits: string[];
  timeframe: string;
}

export interface AIAnalysis {
  summary: string;
  overallSentiment: number;
  isLoading?: boolean;
}

export interface RedditData {
  posts: RedditPost[];
  overallSentiment: number;
  mentionCount: number;
  lastUpdated: string;
  searchInfo: SearchInfo;
  aiAnalysis?: AIAnalysis;
  debug?: {
    rawSentiments: { text: string; raw: number; normalized: number }[];
  };
}

export async function fetchRedditData(symbol: string): Promise<RedditData> {
  console.log('🔵 [Reddit] Fetching data for:', symbol);
  
  try {
    const response = await fetch(`/api/reddit?symbol=${encodeURIComponent(symbol)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch Reddit data');
    }
    
    const data = await response.json();
    console.log('🔵 [Reddit] Data received:', {
      postCount: data.posts.length,
      sentiment: data.overallSentiment,
      timestamp: data.lastUpdated,
      searchInfo: data.searchInfo
    });
    
    return data;
  } catch (error) {
    console.error('🔵 [Reddit] Error:', error);
    throw error;
  }
} 