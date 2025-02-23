import { StockData } from '../types';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NewsArticles from './NewsArticles';

const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return `${formatNumber(marketCap / 1e12)}T`;
  if (marketCap >= 1e9) return `${formatNumber(marketCap / 1e9)}B`;
  if (marketCap >= 1e6) return `${formatNumber(marketCap / 1e6)}M`;
  return formatNumber(marketCap);
};

const ReturnIndicator: React.FC<{ value: number; label?: string }> = ({ value, label }) => {
  const isPositive = value > 0;
  const color = isPositive ? 'text-green-500' : 'text-red-500';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const arrow = isPositive ? '↑' : '↓';
  
  return (
    <div className="transition-all hover:scale-105">
      {label && (
        <div className="text-gray-600 text-xs font-medium mb-0.5">
          {label}
        </div>
      )}
      <div className={`${bgColor} ${color} font-semibold py-0.5 px-1.5 text-sm rounded inline-flex items-center gap-0.5`}>
        <span aria-hidden="true">{arrow}</span>
        <span>{Math.abs(value).toFixed(2)}%</span>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subValue?: string;
}> = ({ label, value, subValue }) => (
  <div className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-all">
    <div className="text-gray-600 text-xs font-medium mb-0.5">{label}</div>
    <div className="font-semibold text-gray-900 text-sm">{value}</div>
    {subValue && <div className="text-xs text-gray-500 mt-0.5">{subValue}</div>}
  </div>
);

const SectionLoading: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <LoadingSpinner size="md" />
  </div>
);

const AnalystRatings: React.FC<{ ratings: NonNullable<StockData['analystRatings']>; currency: string }> = ({ ratings, currency }) => {
  const total = ratings.total || 1; // Prevent division by zero
  const getWidth = (count: number) => `${(count / total) * 100}%`;
  const getConsensus = () => {
    const buyRatio = (ratings.strongBuy + ratings.buy) / total;
    const sellRatio = (ratings.strongSell + ratings.sell) / total;
    
    if (buyRatio > 0.6) return { text: 'Strong Buy', class: 'bg-green-100 text-green-800' };
    if (buyRatio > 0.4) return { text: 'Buy', class: 'bg-green-50 text-green-700' };
    if (sellRatio > 0.6) return { text: 'Strong Sell', class: 'bg-red-100 text-red-800' };
    if (sellRatio > 0.4) return { text: 'Sell', class: 'bg-red-50 text-red-700' };
    return { text: 'Hold', class: 'bg-yellow-50 text-yellow-700' };
  };
  
  const consensus = getConsensus();
  
  return (
    <div className="space-y-3">
      {/* Consensus Badge */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Consensus</div>
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${consensus.class}`}>
          {consensus.text}
        </div>
      </div>

      {/* Distribution Bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Bearish</span>
          <span>Bullish</span>
        </div>
        <div className="h-3 flex rounded-full overflow-hidden bg-gray-100">
          <div style={{ width: getWidth(ratings.strongSell) }} className="bg-red-500" title="Strong Sell" />
          <div style={{ width: getWidth(ratings.sell) }} className="bg-red-300" title="Sell" />
          <div style={{ width: getWidth(ratings.hold) }} className="bg-yellow-400" title="Hold" />
          <div style={{ width: getWidth(ratings.buy) }} className="bg-green-300" title="Buy" />
          <div style={{ width: getWidth(ratings.strongBuy) }} className="bg-green-500" title="Strong Buy" />
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-5 gap-1 text-center bg-gray-50 rounded-lg p-2">
        <div className="text-xs">
          <div className="font-medium text-red-700">{ratings.strongSell}</div>
          <div className="text-gray-500 text-[10px]">Strong Sell</div>
        </div>
        <div className="text-xs">
          <div className="font-medium text-red-600">{ratings.sell}</div>
          <div className="text-gray-500 text-[10px]">Sell</div>
        </div>
        <div className="text-xs">
          <div className="font-medium text-yellow-600">{ratings.hold}</div>
          <div className="text-gray-500 text-[10px]">Hold</div>
        </div>
        <div className="text-xs">
          <div className="font-medium text-green-600">{ratings.buy}</div>
          <div className="text-gray-500 text-[10px]">Buy</div>
        </div>
        <div className="text-xs">
          <div className="font-medium text-green-700">{ratings.strongBuy}</div>
          <div className="text-gray-500 text-[10px]">Strong Buy</div>
        </div>
      </div>

      {/* Total Analysts & Target Price */}
      <div className="flex items-center justify-between text-sm pt-1">
        <div className="text-gray-600">
          Based on {total} analyst{total !== 1 ? 's' : ''}
        </div>
        {ratings.targetPrice && (
          <div className="font-medium">
            Target: {formatCurrency(ratings.targetPrice, currency)}
          </div>
        )}
      </div>
    </div>
  );
};

interface StockDisplayProps {
  data: StockData;
  isLoading?: boolean;
}

const StockDisplay: React.FC<StockDisplayProps> = ({ data, isLoading = false }) => {
  return (
    <div className="space-y-3 font-inter">
      {/* Header - More Compact */}
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{data.symbol}</h3>
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                data.marketState === 'REGULAR' ? 'bg-green-100 text-green-800' :
                data.marketState === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {data.marketState}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-0.5">{data.longName || data.shortName}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {formatCurrency(data.currentPrice, data.currency)}
              {isLoading && <LoadingSpinner size="sm" className="opacity-30" />}
            </div>
            <ReturnIndicator value={data.returns.dayChangePercent} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Column */}
        <div className="space-y-3">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                label="Market Cap"
                value={formatMarketCap(data.marketCap)}
              />
              <MetricCard
                label="Volume"
                value={formatNumber(data.volume, 0)}
                subValue={`Avg: ${formatNumber(data.averageVolume3Month, 0)}`}
              />
            </div>
          </div>

          {/* Market Metrics */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-900">Market Metrics</h4>
              {isLoading && <LoadingSpinner size="sm" className="opacity-30" />}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {data.trailingPE && (
                <div>
                  <div className="text-gray-600">P/E (TTM)</div>
                  <div className="font-medium">{formatNumber(data.trailingPE)}</div>
                </div>
              )}
              {data.forwardPE && (
                <div>
                  <div className="text-gray-600">Forward P/E</div>
                  <div className="font-medium">{formatNumber(data.forwardPE)}</div>
                </div>
              )}
              {data.priceToBook && (
                <div>
                  <div className="text-gray-600">P/B</div>
                  <div className="font-medium">{formatNumber(data.priceToBook)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Returns */}
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-gray-900">Returns</h4>
              {isLoading && <LoadingSpinner size="sm" className="opacity-30" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ReturnIndicator value={data.returns.oneMonth} label="1M" />
              <ReturnIndicator value={data.returns.sixMonths} label="6M" />
              <ReturnIndicator value={data.returns.oneYear} label="1Y" />
              <ReturnIndicator value={data.returns.dayChangePercent} label="Today" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {/* Analyst Ratings */}
          {data.analystRatings && (
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-900">Analyst Recommendations</h4>
                {isLoading && <LoadingSpinner size="sm" className="opacity-30" />}
              </div>
              <AnalystRatings ratings={data.analystRatings} currency={data.currency} />
            </div>
          )}

          {/* News Articles */}
          {data.newsArticles && data.newsArticles.length > 0 && (
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-gray-900">Latest News</h4>
                {isLoading && <LoadingSpinner size="sm" />}
              </div>
              <NewsArticles articles={data.newsArticles} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] text-gray-500 text-right">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default StockDisplay; 