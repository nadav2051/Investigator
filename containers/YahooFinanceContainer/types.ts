export interface StockData {
  // Basic Info
  symbol: string;
  shortName: string;
  longName?: string;
  exchange: string;
  marketState: string;

  // Price Data
  currentPrice: number;
  previousClose: number;
  currency: string;
  marketCap: number;
  dayRange: {
    low: number;
    high: number;
  };
  fiftyTwoWeekRange: {
    low: number;
    high: number;
  };

  // Volume Data
  volume: number;
  averageVolume3Month: number;

  // Market Metrics
  trailingPE?: number;
  forwardPE?: number;
  priceToBook?: number;

  // Analyst Data
  averageAnalystRating?: string;
  analystRatings?: {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
    total: number;
    targetPrice?: number;
  };

  // Historical Returns
  returns: {
    oneMonth: number;
    sixMonths: number;
    oneYear: number;
    dayChange: number;
    dayChangePercent: number;
  };

  lastUpdated: string;
}

export interface StockDisplayProps {
  data: StockData;
} 