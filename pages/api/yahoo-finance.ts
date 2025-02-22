import type { NextApiRequest, NextApiResponse } from 'next';
import type { StockData } from '../../types/yahoo-api';
import yahooFinance from 'yahoo-finance2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StockData | { error: string; details?: string }>
) {
  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  try {
    // First try to get just the quote to validate the symbol
    const quote = await yahooFinance.quote(symbol);
    if (!quote) {
      throw new Error(`No quote data found for symbol: ${symbol}`);
    }

    // If quote works, proceed with full data fetch
    const [quoteSummary, historical] = await Promise.all([
      yahooFinance.quoteSummary(symbol, {
        modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'recommendationTrend', 'financialData']
      }),
      yahooFinance.historical(symbol, {
        period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        period2: new Date(),
        interval: '1d'
      })
    ]);

    if (!historical || historical.length === 0) {
      throw new Error(`No historical data found for symbol: ${symbol}`);
    }

    const priceData = quoteSummary.price;
    const summaryDetail = quoteSummary.summaryDetail;
    const keyStats = quoteSummary.defaultKeyStatistics;

    if (!priceData?.regularMarketPrice || !priceData.currency || !priceData.marketCap) {
      throw new Error(`Missing required price data for symbol: ${symbol}`);
    }

    // Get historical prices for return calculations
    const latestPrice = priceData.regularMarketPrice;
    const oneMonthAgo = historical[Math.max(historical.length - 30, 0)].close;
    const sixMonthsAgo = historical[Math.max(historical.length - 180, 0)].close;
    const oneYearAgo = historical[0].close;

    // Calculate returns
    const calculateReturn = (oldPrice: number) => {
      return ((latestPrice - oldPrice) / oldPrice) * 100;
    };

    const returns = {
      oneMonth: calculateReturn(oneMonthAgo),
      sixMonths: calculateReturn(sixMonthsAgo),
      oneYear: calculateReturn(oneYearAgo),
      dayChange: priceData.regularMarketChange || 0,
      dayChangePercent: priceData.regularMarketChangePercent || 0
    };

    const stockData: StockData = {
      // Basic Info
      symbol: symbol.toUpperCase(),
      shortName: priceData.shortName || symbol.toUpperCase(),
      longName: priceData.longName,
      exchange: priceData.exchangeName || 'Unknown',
      marketState: priceData.marketState || 'UNKNOWN',

      // Price Data
      currentPrice: latestPrice,
      previousClose: summaryDetail?.previousClose || latestPrice,
      currency: priceData.currency,
      marketCap: priceData.marketCap,
      dayRange: {
        low: summaryDetail?.dayLow || latestPrice,
        high: summaryDetail?.dayHigh || latestPrice
      },
      fiftyTwoWeekRange: {
        low: summaryDetail?.fiftyTwoWeekLow || latestPrice,
        high: summaryDetail?.fiftyTwoWeekHigh || latestPrice
      },

      // Volume Data
      volume: summaryDetail?.volume || 0,
      averageVolume3Month: summaryDetail?.averageVolume || 0,

      // Market Metrics
      trailingPE: summaryDetail?.trailingPE,
      forwardPE: summaryDetail?.forwardPE,
      priceToBook: keyStats?.priceToBook,

      // Analyst Data
      averageAnalystRating: quote.averageAnalystRating,
      analystRatings: quoteSummary.recommendationTrend?.trend?.[0] ? {
        strongBuy: quoteSummary.recommendationTrend.trend[0].strongBuy || 0,
        buy: quoteSummary.recommendationTrend.trend[0].buy || 0,
        hold: quoteSummary.recommendationTrend.trend[0].hold || 0,
        sell: quoteSummary.recommendationTrend.trend[0].sell || 0,
        strongSell: quoteSummary.recommendationTrend.trend[0].strongSell || 0,
        total: quoteSummary.recommendationTrend.trend[0].strongBuy + 
               quoteSummary.recommendationTrend.trend[0].buy + 
               quoteSummary.recommendationTrend.trend[0].hold + 
               quoteSummary.recommendationTrend.trend[0].sell + 
               quoteSummary.recommendationTrend.trend[0].strongSell || 0,
        targetPrice: quoteSummary.financialData?.targetHighPrice || undefined
      } : undefined,

      // Returns Data
      returns,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(stockData);
  } catch (error) {
    console.error('Yahoo Finance Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 