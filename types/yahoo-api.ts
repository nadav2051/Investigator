interface RawValue {
  raw: number;
  fmt?: string;
}

interface QuoteSummaryPrice {
  regularMarketPrice: number;
  currency: string;
  marketCap: number;
  longName?: string;
  shortName?: string;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
}

interface QuoteSummaryDetail {
  previousClose: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
}

interface QuoteSummaryResult {
  price: QuoteSummaryPrice;
  summaryDetail: QuoteSummaryDetail;
}

export interface YahooQuoteSummary {
  quoteSummary: {
    result: QuoteSummaryResult[];
    error?: string;
  };
}

export interface YahooFinanceResponse {
  quoteSummary: {
    result: Array<{
      price: {
        regularMarketPrice: RawValue;
        marketCap: RawValue;
        currency: string;
      };
      summaryDetail: {
        fiftyDayAverage: RawValue;
        twoHundredDayAverage: RawValue;
        fiftyTwoWeekLow: RawValue;
        fiftyTwoWeekHigh: RawValue;
      };
    }>;
    error?: string;
  };
}

export interface YahooQuoteResponse {
  quoteSummary: {
    result: Array<{
      price: {
        regularMarketPrice: RawValue;
        marketCap: RawValue;
        currency: string;
      };
      defaultKeyStatistics: {
        enterpriseValue: RawValue;
        forwardPE: RawValue;
        profitMargins: RawValue;
      };
      summaryDetail: {
        fiftyDayAverage: RawValue;
        twoHundredDayAverage: RawValue;
        fiftyTwoWeekLow: RawValue;
        fiftyTwoWeekHigh: RawValue;
        volume: RawValue;
        averageVolume: RawValue;
      };
    }>;
    error?: string;
  };
}

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
    // Add percentage changes
    dayChange: number;
    dayChangePercent: number;
  };

  // News Articles
  newsArticles?: {
    title: string;
    link: string;
    publisher: string;
    publishedAt: string;
    summary?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    thumbnail?: string;
  }[];

  lastUpdated: string;
} 