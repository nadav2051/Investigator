# Investigator

A focused React application built with Next.js that provides detailed stock market data through Yahoo Finance integration. The application features a clean, responsive interface and delivers comprehensive financial information including real-time prices, market metrics, analyst recommendations, and historical returns.

## Features

- **Real-time Stock Data**
  - Current price and market state
  - Market capitalization
  - Trading volume with 3-month average
  - Day range and 52-week range

- **Market Metrics**
  - P/E Ratio (Trailing and Forward)
  - Price to Book Ratio
  - Exchange information

- **Analyst Coverage**
  - Detailed analyst recommendations breakdown
  - Visual representation of buy/sell ratings
  - Target price information
  - Average analyst rating

- **Historical Performance**
  - Day change with percentage
  - 1-month returns
  - 6-month returns
  - 1-year returns

- **User Interface**
  - Clean, modern design
  - Responsive layout
  - Real-time updates
  - Error handling and loading states

## Technical Stack

- **Frontend**
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS

- **Data Integration**
  - Yahoo Finance API
  - Real-time data fetching
  - Error handling
  - Type-safe responses

## Project Structure

```
Investigator/
├── components/                 # Shared components
│   └── SearchBar.tsx          # Global search component
│
├── containers/                 # Main container
│   └── YahooFinanceContainer/
│       ├── api.ts             # Yahoo Finance API integration
│       ├── types.ts           # Type definitions
│       ├── index.tsx          # Container component
│       └── components/        # Container-specific components
│           └── StockDisplay.tsx
│
├── pages/                     # Next.js pages
│   ├── api/                   # Backend API endpoints
│   │   └── yahoo-finance.ts   # Yahoo Finance API handler
│   └── index.tsx             # Main application page
│
└── types/                     # Global type definitions
    ├── container.ts          # Container interfaces
    └── yahoo-api.ts         # Yahoo Finance API types
```

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build**
   ```bash
   npm run build
   ```

## Usage

1. Enter a stock symbol (e.g., AAPL, MSFT, GOOGL) in the search bar
2. View comprehensive stock information including:
   - Current price and market status
   - Market metrics and trading data
   - Analyst recommendations
   - Historical performance

## Development Guidelines

1. **Type Safety**
   - All components are properly typed
   - API responses have defined interfaces
   - Strict TypeScript configuration

2. **Error Handling**
   - Comprehensive error states
   - User-friendly error messages
   - Graceful fallbacks

3. **Styling**
   - Tailwind CSS for consistent design
   - Responsive layouts
   - Modern UI components

4. **Performance**
   - Efficient data fetching
   - Optimized rendering
   - Proper loading states

## Future Enhancements

- Add technical analysis indicators
- Implement price alerts
- Add historical price charts
- Include company financials
- Add portfolio tracking
- Implement data caching
- Add more technical indicators
- Support for multiple currencies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Submit a pull request

## License

MIT 