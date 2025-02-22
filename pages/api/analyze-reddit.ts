import type { NextApiRequest, NextApiResponse } from 'next';
import { googleAI } from '../../services/GoogleAI';

interface RedditPost {
  title: string;
  selftext?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // Get posts from Reddit API first
    const redditResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reddit?symbol=${symbol}`);
    const redditData = await redditResponse.json();

    if (!redditData.posts || !Array.isArray(redditData.posts)) {
      throw new Error('No posts found to analyze');
    }

    // Get AI analysis
    const analysis = await googleAI.analyzeRedditPosts(
      redditData.posts.map((post: RedditPost) => ({
        title: post.title,
        text: post.selftext || ''
      })),
      symbol.toUpperCase()
    );

    res.status(200).json({
      summary: analysis.summary,
      overallSentiment: analysis.overallSentiment,
      ticker: analysis.ticker,
      isLoading: false,
      filteredPosts: analysis.filteredPosts
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to analyze Reddit posts'
    });
  }
} 