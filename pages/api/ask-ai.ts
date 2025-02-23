import type { NextApiRequest, NextApiResponse } from 'next';
import { googleAI } from '../../services/GoogleAI';

interface AskAIRequest {
  question: string;
  containerType: 'yahoo' | 'technical' | 'reddit';
  containerData: any;
  previousConversation: Array<{
    question: string;
    answer: string;
    timestamp: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, containerType, containerData, previousConversation } = req.body as AskAIRequest;

    if (!question || !containerType || !containerData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let contextPrompt = '';
    switch (containerType) {
      case 'yahoo':
        contextPrompt = `You are analyzing stock data for ${containerData.symbol}. Here's the current context:
- Current Price: ${containerData.currentPrice} ${containerData.currency}
- Market Cap: ${containerData.marketCap}
- P/E Ratio: ${containerData.trailingPE || 'N/A'}
- Volume: ${containerData.volume}
- Day Change: ${containerData.returns.dayChangePercent}%
- Analyst Ratings: ${containerData.analystRatings ? JSON.stringify(containerData.analystRatings) : 'N/A'}
- Recent News: ${containerData.newsArticles ? containerData.newsArticles.map((a: any) => a.title).join('; ') : 'N/A'}`;
        break;

      case 'technical':
        contextPrompt = `You are analyzing technical indicators for a stock. Here's the current data:
- SMA20: ${containerData.sma20?.value} (Signal: ${containerData.sma20?.signal})
- SMA50: ${containerData.sma50?.value} (Signal: ${containerData.sma50?.signal})
- SMA200: ${containerData.sma200?.value} (Signal: ${containerData.sma200?.signal})
- RSI: ${containerData.rsi?.value} (Signal: ${containerData.rsi?.signal})
- MACD: Line=${containerData.macd?.macdLine.value}, Signal=${containerData.macd?.signalLine.value}
- Bollinger Bands: Upper=${containerData.bollingerBands?.upper.value}, Lower=${containerData.bollingerBands?.lower.value}`;
        break;

      case 'reddit':
        contextPrompt = `You are analyzing Reddit sentiment data. Here's the current context:
- Overall Sentiment: ${containerData.overallSentiment}
- Total Mentions: ${containerData.mentionCount}
- Recent Posts: ${containerData.posts.slice(0, 3).map((p: any) => p.title).join('; ')}
- AI Analysis: ${containerData.aiAnalysis?.summary || 'N/A'}`;
        break;
    }

    // Add conversation history to context
    const conversationContext = previousConversation.length > 0
      ? `\n\nPrevious conversation:\n${previousConversation.map(msg => 
          `Q: ${msg.question}\nA: ${msg.answer}`).join('\n\n')}`
      : '';

    const prompt = `${contextPrompt}${conversationContext}\n\nUser Question: ${question}\n\nProvide a clear and concise answer based on the data above. Use markdown formatting for better readability. If you're mentioning numbers or data points, make sure they're from the context provided.`;

    const result = await googleAI.generateAnswer(prompt);
    res.status(200).json({ answer: result });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to get AI response'
    });
  }
} 