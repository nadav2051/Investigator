import { StockDisplayProps, StockData } from '../types';
import LoadingSpinner from '../../../components/LoadingSpinner';

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
        <div className="text-gray-600 text-sm font-medium mb-1">
          {label}
        </div>
      )}
      <div className={`${bgColor} ${color} font-semibold py-1 px-2 rounded-lg inline-flex items-center gap-1`}>
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
  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
    <div className="text-gray-600 text-sm font-medium mb-1">{label}</div>
    <div className="font-semibold text-gray-900">{value}</div>
    {subValue && <div className="text-xs text-gray-500 mt-1">{subValue}</div>}
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
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Strong Sell</span>
        <span>Strong Buy</span>
      </div>
      <div className="h-3 flex rounded-full overflow-hidden bg-gray-100">
        <div style={{ width: getWidth(ratings.strongSell) }} className="bg-red-500" />
        <div style={{ width: getWidth(ratings.sell) }} className="bg-red-300" />
        <div style={{ width: getWidth(ratings.hold) }} className="bg-yellow-400" />
        <div style={{ width: getWidth(ratings.buy) }} className="bg-green-300" />
        <div style={{ width: getWidth(ratings.strongBuy) }} className="bg-green-500" />
      </div>
      <div className="grid grid-cols-5 text-center text-xs">
        <div>{ratings.strongSell}</div>
        <div>{ratings.sell}</div>
        <div>{ratings.hold}</div>
        <div>{ratings.buy}</div>
        <div>{ratings.strongBuy}</div>
      </div>
      {ratings.targetPrice && (
        <div className="text-sm mt-2">
          <span className="font-medium">Target Price:</span> {formatCurrency(ratings.targetPrice, currency)}
        </div>
      )}
    </div>
  );
};

const StockDisplay: React.FC<StockDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-4 font-inter">
      {/* Header - More Compact */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{data.symbol}</h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                data.marketState === 'REGULAR' ? 'bg-green-100 text-green-800' :
                data.marketState === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {data.marketState}
              </span>
            </div>
            <div className="text-sm text-gray-600">{data.longName || data.shortName}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              {formatCurrency(data.currentPrice, data.currency)}
              <LoadingSpinner size="sm" className="opacity-30" />
            </div>
            <ReturnIndicator value={data.returns.dayChangePercent} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
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
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Market Metrics</h4>
              <LoadingSpinner size="sm" className="opacity-30" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
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
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Analyst Ratings */}
          {data.analystRatings && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">Analyst Recommendations</h4>
                <LoadingSpinner size="sm" className="opacity-30" />
              </div>
              <AnalystRatings ratings={data.analystRatings} currency={data.currency} />
            </div>
          )}

          {/* Returns */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Returns</h4>
              <LoadingSpinner size="sm" className="opacity-30" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ReturnIndicator value={data.returns.oneMonth} label="1M" />
              <ReturnIndicator value={data.returns.sixMonths} label="6M" />
              <ReturnIndicator value={data.returns.oneYear} label="1Y" />
              <ReturnIndicator value={data.returns.dayChangePercent} label="Today" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default StockDisplay; 