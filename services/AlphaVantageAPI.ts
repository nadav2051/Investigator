const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

interface AlphaVantageError {
  Note?: string;
  Information?: string;
}

export class AlphaVantageAPI {
  private static async handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Check for API limit messages
    if ('Note' in data || 'Information' in data) {
      throw new Error(data.Note || data.Information || 'API limit reached');
    }
    
    return data;
  }

  static async getCompanyOverview(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching company overview:', error);
      throw error;
    }
  }

  static async getIncomeStatement(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${API_KEY}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching income statement:', error);
      throw error;
    }
  }

  static async getBalanceSheet(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${API_KEY}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching balance sheet:', error);
      throw error;
    }
  }

  static async getCashFlow(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=CASH_FLOW&symbol=${symbol}&apikey=${API_KEY}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      throw error;
    }
  }

  static async getEarnings(symbol: string) {
    try {
      const response = await fetch(`${BASE_URL}?function=EARNINGS&symbol=${symbol}&apikey=${API_KEY}`);
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching earnings:', error);
      throw error;
    }
  }
} 