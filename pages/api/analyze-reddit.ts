import type { NextApiRequest, NextApiResponse } from 'next';
import { googleAI } from '../../services/GoogleAI';

interface RedditPost {
  title: string;
  selftext?: string;
}

export const config = {
  maxDuration: 60 // Set maximum duration to 60 seconds (maximum allowed for hobby plan)
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;
  const { posts } = req.body;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  if (!posts || !Array.isArray(posts)) {
    return res.status(400).json({ error: 'Posts array is required in request body' });
  }

  try {
    // Limit the number of posts to analyze to prevent timeout
    const limitedPosts = posts.slice(0, 10);

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