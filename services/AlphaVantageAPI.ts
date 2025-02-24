const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export class AlphaVantageAPI {
  static async getCompanyOverview(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company overview');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  }

  static async getIncomeStatement(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch income statement');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching income statement:', error);
      throw error;
    }
  }

  static async getBalanceSheet(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance sheet');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  }

  static async getCashFlow(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cash flow');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      throw error;
    }
  }

  static async getEarnings(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`);
      if (!response.ok) {
        throw new Error('Failed to fetch earnings');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  }
} 