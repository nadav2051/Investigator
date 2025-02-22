// Types
export interface RedditPost {
  subreddit: string;
  title: string;
  selftext?: string;
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
  ticker: string;
  filteredPosts?: {
    title: string;
    reason: string;
  }[];
}

export interface RedditData {
  posts: RedditPost[];
  overallSentiment: number;
  mentionCount: number;
  lastUpdated: string;
  searchInfo: SearchInfo;
  mentionsByDate: {
    date: string;
    count: number;
    averageSentiment: number;
  }[];
  aiAnalysis?: AIAnalysis;
}

export async function fetchRedditData(symbol: string): Promise<RedditData> {
  const response = await fetch(`/api/reddit?symbol=${encodeURIComponent(symbol)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch Reddit data');
  }
  
  return response.json();
} 