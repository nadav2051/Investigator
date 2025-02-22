import type { NextApiRequest, NextApiResponse } from 'next';
import natural from 'natural';
import { WordTokenizer, SentimentAnalyzer, PorterStemmer } from 'natural';

const tokenizer = new WordTokenizer();
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ sentiment: number } | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Tokenize and analyze sentiment
    const tokens = tokenizer.tokenize(text);
    if (!tokens || tokens.length === 0) {
      return res.json({ sentiment: 0 });
    }

    const sentiment = analyzer.getSentiment(tokens);

    // Normalize sentiment to range [-1, 1]
    const normalizedSentiment = Math.max(Math.min(sentiment / 5, 1), -1);

    res.json({ sentiment: normalizedSentiment });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
} 