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

## Deployment

The application is optimized for deployment on Vercel, the platform created by the makers of Next.js.

### Automatic Deployment (Recommended)

1. **Prerequisites**
   - A [Vercel account](https://vercel.com/signup)
   - Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

2. **Deploy Process**
   - Go to [Vercel's website](https://vercel.com)
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose your repository
   - Vercel will automatically detect Next.js settings
   - Click "Deploy"

3. **What You Get**
   - Production URL (e.g., `https://your-project.vercel.app`)
   - Automatic HTTPS
   - Continuous deployments on git push
   - Preview deployments for pull requests
   - Built-in performance monitoring
   - Edge network for fast delivery

### Manual Deployment

If you prefer using the command line:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **For Production**
   ```bash
   vercel --prod
   ```

### Environment Variables

No environment variables are required for basic functionality. The application uses the public Yahoo Finance API.

### Post-Deployment

After deployment, verify these features are working:
- Stock symbol search
- Real-time price updates
- Analyst recommendations
- Historical returns

### Deployment Troubleshooting

Common issues and solutions:
- If the build fails, ensure all dependencies are properly listed in `package.json`
- If data doesn't load, check the Network tab for API call issues
- For TypeScript errors, run `npm run build` locally first to catch any type issues 