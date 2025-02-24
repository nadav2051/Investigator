# Investigator - Stock Market Analysis Platform

A comprehensive stock market analysis platform built with Next.js and TypeScript that provides real-time market data, technical analysis, fundamental analysis, and social media sentiment analysis.

## Features

### 1. Stock Information (Yahoo Finance)
- Real-time stock data and quotes
- Historical price data
- Key statistics and market data
- Interactive data visualization

### 2. Technical Analysis
- Interactive candlestick chart
- Multiple technical indicators:
  - Simple Moving Averages (SMA 20, 50, 150, 200)
  - Exponential Moving Average (EMA)
  - Relative Strength Index (RSI)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
- Customizable indicator visibility
- Dynamic chart resizing

### 3. Fundamental Analysis
- Company overview and description
- Key financial metrics:
  - Market capitalization
  - P/E ratio
  - EPS
  - Revenue
  - Profit margins
  - And more
- Financial statements:
  - Income Statement
  - Balance Sheet
  - Cash Flow Statement
- Earnings history with quarterly and annual views

### 4. Reddit Sentiment Analysis
- Real-time Reddit discussions
- AI-powered sentiment analysis
- Post categorization and summarization
- Community insights and trends

### 5. User Interface Features
- Drag-and-drop container organization
- Search history management
- Collapsible containers
- Responsive design
- AI-powered insights for each container

## Technical Stack

- **Frontend Framework**: Next.js with TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **Charting**: Lightweight Charts
- **State Management**: React Hooks
- **API Integration**: 
  - Alpha Vantage API (Financial Data)
  - Reddit API (Social Media Data)
  - Custom AI Analysis API

## Project Structure

```
├── components/                 # Shared UI components
├── containers/                 # Main feature containers
│   ├── FundamentalAnalysis/   # Fundamental analysis components
│   ├── RedditContainer/       # Reddit analysis components
│   ├── TechnicalAnalysis/     # Technical analysis components
│   └── YahooFinance/         # Stock information components
├── pages/                     # Next.js pages
├── services/                  # API services
├── types/                     # TypeScript type definitions
└── utils/                     # Utility functions
```

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/nadav2051/Investigator.git
cd Investigator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Container Architecture

Each container in the application follows a consistent pattern:
- Modular component structure
- State management using React hooks
- Error boundary implementation
- Loading states and error handling
- AI-powered insights integration
- Responsive design with Tailwind CSS

### Container Components

1. **YahooFinanceContainer**
   - Real-time stock data display
   - Historical price information
   - Market statistics

2. **TechnicalAnalysisContainer**
   - Interactive chart with multiple timeframes
   - Technical indicators
   - Custom indicator visibility controls

3. **FundamentalAnalysisContainer**
   - Company overview
   - Financial statements
   - Earnings history

4. **RedditContainer**
   - Reddit post aggregation
   - AI sentiment analysis
   - Community insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for financial data API
- [Reddit API](https://www.reddit.com/dev/api/) for social media data
- [TradingView Lightweight Charts](https://github.com/tradingview/lightweight-charts) for charting
- [Tailwind CSS](https://tailwindcss.com/) for styling 