import { StockData } from './types';

export async function fetchStockData(symbol: string): Promise<StockData> {
  // This would be replaced with actual Yahoo Finance API call
  const response = await fetch(`/api/yahoo-finance?symbol=${symbol}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data: ${response.statusText}`);
  }

  return response.json();
} 