# Investigator

A comprehensive stock market analysis tool built with Next.js that combines real-time market data with technical analysis. The application integrates Yahoo Finance data and technical indicators to provide a holistic view of stock market trends.

## Features

### 1. Stock Information (Yahoo Finance)
- Real-time stock data and market metrics
- Current price and market state
- Trading volume with 3-month average
- Market capitalization
- P/E Ratio (Trailing and Forward)
- Price to Book Ratio
- Analyst recommendations with visual breakdown
- Historical returns (1-day, 1-month, 6-month, 1-year)
- Latest news articles with sentiment analysis

### 2. Technical Analysis
- Interactive candlestick chart
- Moving Averages
  - SMA 20, 50, 150, 200
  - Toggleable visibility for each SMA line
  - Color-coded for easy identification
- Relative Strength Index (RSI)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Buy/Sell signals for each indicator
- Detailed tooltips explaining each indicator

### 3. User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout
- Collapsible containers
- Real-time updates
- Search history
- Loading states and error handling

## Technical Stack

- **Frontend**
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lightweight Charts

- **APIs & Services**
  - Yahoo Finance API
  - Technical Indicators Library

- **Data Analysis**
  - Technical analysis calculations
  - Moving averages
  - Momentum indicators
  - Volatility indicators

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/investigator.git
   cd investigator
   ```

2. **Installation**
   ```bash
   npm install
   ```

3. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
Investigator/
├── components/                # Shared components
│   ├── LoadingSpinner.tsx
│   ├── LoadingOverlay.tsx
│   ├── SearchBar.tsx
│   └── SearchHistory.tsx
│
├── containers/               # Main feature containers
│   ├── YahooFinanceContainer/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   └── TechnicalAnalysisContainer/
│       ├── utils.ts
│       ├── types.ts
│       └── components/
│
├── pages/                    # Next.js pages
│   ├── api/                 # API routes
│   │   └── yahoo-finance/
│   └── index.tsx
│
└── styles/                  # Global styles
    └── globals.css
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Deployment

The application is optimized for deployment on Vercel. Follow these steps:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy

## Acknowledgments

- Yahoo Finance API for market data
- Trading View for Lightweight Charts
- Technical Indicators library 