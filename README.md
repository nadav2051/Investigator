# Investigator

A comprehensive stock market analysis tool built with Next.js that combines real-time market data, technical analysis, and social sentiment analysis. The application integrates Yahoo Finance data, technical indicators, and Reddit discussions to provide a holistic view of stock market trends and sentiment.

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
- Moving Averages (SMA 20, 50, 200 & EMA 20)
- Relative Strength Index (RSI)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- Buy/Sell signals for each indicator
- Detailed tooltips explaining each indicator

### 3. Reddit Sentiment Analysis
- Real-time Reddit discussions tracking
- Sentiment analysis of posts and comments
- AI-powered discussion analysis
- Mentions tracking over time
- Subreddit coverage:
  - r/wallstreetbets
  - r/stocks
  - r/investing
  - r/StockMarket
  - r/options

### 4. User Interface
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
  - Reddit API
  - Google AI (Gemini Pro)
  - Technical Indicators Library

- **Data Analysis**
  - Technical analysis calculations
  - Natural language processing
  - Sentiment analysis
  - AI-powered insights

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/investigator.git
   cd investigator
   ```

2. **Environment Setup**
   Create a `.env.local` file with the following:
   ```env
   # Reddit API Credentials
   NEXT_PUBLIC_REDDIT_CLIENT_ID=your_client_id
   NEXT_PUBLIC_REDDIT_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_REDDIT_REFRESH_TOKEN=your_refresh_token
   NEXT_PUBLIC_REDDIT_ACCESS_TOKEN=your_access_token

   # Google AI Studio Key
   NEXT_PRIVATE_GOOGLE_AI_STUDIO_KEY=your_google_ai_key
   ```

3. **Installation**
   ```bash
   npm install
   ```

4. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## API Configuration

### Reddit API Setup
1. Go to https://www.reddit.com/prefs/apps
2. Create a new app (script type)
3. Fill in the required information
4. Copy the credentials to your `.env.local` file

### Google AI Studio Setup
1. Visit Google AI Studio
2. Generate an API key
3. Add it to your `.env.local` file

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
│   ├── TechnicalAnalysisContainer/
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   └── RedditContainer/
│       ├── api.ts
│       ├── types.ts
│       └── components/
│
├── pages/                    # Next.js pages
│   ├── api/                 # API routes
│   │   ├── yahoo-finance/
│   │   ├── reddit.ts
│   │   └── analyze-sentiment.ts
│   └── index.tsx
│
├── services/                # External services
│   └── GoogleAI.ts
│
├── styles/                  # Global styles
│   └── globals.css
│
└── types/                   # Global type definitions
    ├── container.ts
    └── yahoo-api.ts
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
3. Add environment variables in Vercel dashboard
4. Deploy

## Acknowledgments

- Yahoo Finance API for market data
- Reddit API for social sentiment
- Google AI for advanced analysis
- Trading View for Lightweight Charts
- Technical Indicators library 