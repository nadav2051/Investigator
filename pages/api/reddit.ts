import type { NextApiRequest, NextApiResponse } from 'next';
import Snoowrap from 'snoowrap';
import natural from 'natural';
import { googleAI } from '../../services/GoogleAI';

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();

// Custom lexicon for stock market terms
const STOCK_LEXICON: Record<string, number> = {
  // Bullish terms
  'bullish': 3,
  'bull': 2,
  'long': 1,
  'calls': 2,
  'call': 1,
  'buy': 1,
  'buying': 1,
  'bought': 1,
  'moon': 3,
  'mooning': 3,
  'rocket': 3,
  'rockets': 3,
  'up': 1,
  'upside': 2,
  'gains': 2,
  'profit': 2,
  'winning': 2,
  'strong': 1,
  'strength': 1,
  'higher': 1,
  'rally': 2,
  'rallying': 2,
  'growth': 1,
  'growing': 1,
  'opportunity': 1,
  'opportunities': 1,
  'positive': 1,
  'potential': 1,

  // Bearish terms
  'bearish': -3,
  'bear': -2,
  'short': -1,
  'puts': -2,
  'put': -1,
  'sell': -1,
  'selling': -1,
  'sold': -1,
  'down': -1,
  'downside': -2,
  'losses': -2,
  'loss': -2,
  'losing': -2,
  'weak': -1,
  'weakness': -1,
  'lower': -1,
  'crash': -3,
  'crashing': -3,
  'dump': -2,
  'dumping': -2,
  'dumped': -2,
  'risk': -1,
  'risky': -1,
  'negative': -1,
  'overvalued': -2,

  // Extra emphasis
  'very': 1.5, // Multiplier for next word
  'extremely': 2, // Multiplier for next word
  'super': 1.5, // Multiplier for next word
  'really': 1.5, // Multiplier for next word
};

interface RedditPost {
  subreddit: string;
  title: string;
  url: string;
  score: number;
  num_comments: number;
  created_utc: number;
  sentiment: number;
  rawSentiment?: number;
  aiSentiment?: { score: number; explanation: string };
}

interface SearchInfo {
  subreddits: string[];
  timeframe: string;
}

interface RedditData {
  posts: RedditPost[];
  overallSentiment: number;
  mentionCount: number;
  lastUpdated: string;
  searchInfo: SearchInfo;
  aiAnalysis?: { summary: string; overallSentiment: number; isLoading: boolean };
  debug?: {
    rawSentiments: { text: string; raw: number; normalized: number; tokens: string[] }[];
  };
}

const SUBREDDITS = ['wallstreetbets', 'investing', 'stocks'];
const SEARCH_TIMEFRAME = '1 week';

async function analyzeSentiment(text: string): Promise<{ normalized: number; raw: number; tokens: string[] }> {
  try {
    console.log('\nAnalyzing text:', text.substring(0, 100) + '...');
    
    // Tokenize and convert to lowercase
    const tokens = tokenizer.tokenize(text).map(t => t.toLowerCase());
    if (!tokens || tokens.length === 0) {
      console.log('No tokens found in text');
      return { normalized: 0, raw: 0, tokens: [] };
    }

    console.log('Token count:', tokens.length);
    console.log('Sample tokens:', tokens.slice(0, 10));

    // Calculate sentiment using both AFINN and custom lexicon
    const afinnAnalyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const afinnScore = afinnAnalyzer.getSentiment(tokens);

    // Calculate custom lexicon score
    let customScore = 0;
    let multiplier = 1;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (STOCK_LEXICON[token] !== undefined) {
        // If it's an emphasis word, update multiplier for next word
        if (['very', 'extremely', 'super', 'really'].includes(token)) {
          multiplier = STOCK_LEXICON[token];
        } else {
          customScore += STOCK_LEXICON[token] * multiplier;
          multiplier = 1; // Reset multiplier
        }
      }
    }

    // Combine scores with custom lexicon having more weight
    const rawSentiment = (customScore * 2 + afinnScore) / 3;
    console.log('Sentiment scores:', {
      afinn: afinnScore,
      custom: customScore,
      combined: rawSentiment
    });

    // Normalize with a focus on the custom lexicon range
    // Most custom terms are between -3 and 3, so we'll normalize accordingly
    const normalizedSentiment = Math.max(Math.min(rawSentiment / 4, 1), -1);
    console.log('Normalized sentiment:', normalizedSentiment);

    return { normalized: normalizedSentiment, raw: rawSentiment, tokens };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { normalized: 0, raw: 0, tokens: [] };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RedditData | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    console.log('Initializing Reddit client for symbol:', symbol);

    const reddit = new Snoowrap({
      userAgent: 'windows:Investigator:1.0.0',
      clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET!,
      refreshToken: process.env.NEXT_PUBLIC_REDDIT_REFRESH_TOKEN!
    });

    const posts: RedditPost[] = [];
    const debugSentiments: { text: string; raw: number; normalized: number; tokens: string[] }[] = [];

    // Collect posts first
    for (const subreddit of SUBREDDITS) {
      try {
        console.log(`Searching r/${subreddit} for ${symbol}`);
        const searchResults = await reddit.getSubreddit(subreddit).search({
          query: symbol.toUpperCase(),
          time: 'week',
          sort: 'hot'
        });

        for (const post of searchResults) {
          const symbolRegex = new RegExp(`\\b${symbol}\\b`, 'i');
          if (symbolRegex.test(post.title) || symbolRegex.test(post.selftext)) {
            const text = post.title + ' ' + post.selftext;
            const { normalized, raw, tokens } = await analyzeSentiment(text);
            
            debugSentiments.push({
              text: text.substring(0, 100) + '...',
              raw,
              normalized,
              tokens: tokens.slice(0, 20)
            });

            posts.push({
              subreddit: post.subreddit.display_name,
              title: post.title,
              url: post.url,
              score: post.score,
              num_comments: post.num_comments,
              created_utc: post.created_utc,
              sentiment: normalized,
              rawSentiment: raw
            });
          }
        }
      } catch (error) {
        console.error(`Error searching r/${subreddit}:`, error);
      }
    }

    // Get AI analysis
    let aiAnalysis = undefined;
    try {
      console.log('Getting AI analysis for posts...');
      const analysis = await googleAI.analyzeRedditPosts(
        posts.map(post => ({
          title: post.title,
          text: post.selftext || ''
        }))
      );

      // Update posts with AI sentiment
      posts.forEach((post, i) => {
        if (analysis.postAnalyses[i]) {
          post.aiSentiment = {
            score: analysis.postAnalyses[i].sentiment,
            explanation: analysis.postAnalyses[i].explanation
          };
        }
      });

      aiAnalysis = {
        summary: analysis.summary,
        overallSentiment: analysis.overallSentiment,
        isLoading: false
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Don't fail the whole request if AI analysis fails
    }

    const overallSentiment = posts.length
      ? posts.reduce((sum, post) => sum + post.sentiment, 0) / posts.length
      : 0;

    const result: RedditData = {
      posts: posts.sort((a, b) => b.score - a.score),
      overallSentiment,
      mentionCount: posts.length,
      lastUpdated: new Date().toISOString(),
      searchInfo: {
        subreddits: SUBREDDITS,
        timeframe: SEARCH_TIMEFRAME
      },
      aiAnalysis,
      debug: {
        rawSentiments: debugSentiments
      }
    };

    console.log('\nSentiment Analysis Summary:');
    console.log('Total posts analyzed:', posts.length);
    console.log('Average sentiment:', overallSentiment);
    console.log('Raw sentiment scores:', posts.map(p => p.rawSentiment));
    console.log('Normalized sentiment scores:', posts.map(p => p.sentiment));
    console.log('AI analysis:', aiAnalysis ? 'success' : 'failed');

    res.status(200).json(result);
  } catch (error) {
    console.error('Reddit API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch Reddit data'
    });
  }
} 