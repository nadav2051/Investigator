import type { NextApiRequest, NextApiResponse } from 'next';
import { googleAI } from '../../services/GoogleAI';

interface RedditPost {
  title: string;
  selftext?: string;
}

export const config = {
  maxDuration: 300 // Set maximum duration to 5 minutes for AI analysis
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, posts } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  if (!posts || typeof posts !== 'string') {
    return res.status(400).json({ error: 'Posts are required' });
  }

  try {
    let parsedPosts: RedditPost[];
    try {
      parsedPosts = JSON.parse(posts);
      if (!Array.isArray(parsedPosts)) {
        throw new Error('Posts must be an array');
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid posts format' });
    }

    // Limit the number of posts to analyze to prevent timeout
    const limitedPosts = parsedPosts.slice(0, 10);

    // Get AI analysis
    const analysis = await googleAI.analyzeRedditPosts(
      limitedPosts.map(post => ({
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
      filteredPosts: analysis.filteredPosts,
      postAnalyses: analysis.postAnalyses
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to analyze Reddit posts'
    });
  }
} 