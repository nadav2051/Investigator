import type { NextApiRequest, NextApiResponse } from 'next';
import yahooFinance from 'yahoo-finance2';

interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HistoricalDataPoint[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 2); // Get 2 years of data instead of 1

    const result = await yahooFinance.historical(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d'
    });

    const historicalData = result.map(quote => ({
      timestamp: new Date(quote.date).getTime(),
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      volume: quote.volume
    }));

    res.status(200).json(historicalData);
  } catch (error) {
    console.error('Yahoo Finance Historical Data Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch historical data'
    });
  }
} 