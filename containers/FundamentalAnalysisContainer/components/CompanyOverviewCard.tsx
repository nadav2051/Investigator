import React from 'react';
import { CompanyOverview } from '../../../types/alpha-vantage';

interface CompanyOverviewCardProps {
  overview: CompanyOverview;
}

const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({ overview }) => {
  const formatValue = (value: string) => {
    // Convert string numbers to formatted numbers with commas
    if (!isNaN(Number(value))) {
      return new Intl.NumberFormat('en-US').format(Number(value));
    }
    return value;
  };

  const metrics = [
    { label: 'Market Cap', value: overview.MarketCapitalization },
    { label: 'EBITDA', value: overview.EBITDA },
    { label: 'P/E Ratio', value: overview.PERatio },
    { label: 'PEG Ratio', value: overview.PEGRatio },
    { label: 'Book Value', value: overview.BookValue },
    { label: 'Dividend/Share', value: overview.DividendPerShare },
    { label: 'Dividend Yield', value: overview.DividendYield },
    { label: 'EPS', value: overview.EPS },
    { label: 'Revenue TTM', value: overview.RevenueTTM },
    { label: 'Profit Margin', value: overview.ProfitMargin },
    { label: 'Operating Margin', value: overview.OperatingMarginTTM },
    { label: 'Return on Assets', value: overview.ReturnOnAssetsTTM },
    { label: 'Return on Equity', value: overview.ReturnOnEquityTTM },
    { label: 'Beta', value: overview.Beta },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">{overview.Name}</h2>
        <div className="text-gray-600 text-sm">
          <span>{overview.Exchange}: {overview.Symbol}</span>
          <span className="mx-2">|</span>
          <span>{overview.Sector}</span>
          <span className="mx-2">|</span>
          <span>{overview.Industry}</span>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="text-base font-semibold mb-1">Description</h3>
        <p className="text-gray-600 text-sm">{overview.Description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {metrics.map(({ label, value }) => (
          <div key={label} className="bg-gray-50 p-2 rounded">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-sm font-semibold text-gray-800">
              {formatValue(value)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-base font-semibold mb-1">Price Statistics</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">52 Week High</span>
              <span className="font-medium">{formatValue(overview['52WeekHigh'])}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">52 Week Low</span>
              <span className="font-medium">{formatValue(overview['52WeekLow'])}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">50 Day MA</span>
              <span className="font-medium">{formatValue(overview['50DayMovingAverage'])}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">200 Day MA</span>
              <span className="font-medium">{formatValue(overview['200DayMovingAverage'])}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded">
          <h3 className="text-base font-semibold mb-1">Share Statistics</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shares Outstanding</span>
              <span className="font-medium">{formatValue(overview.SharesOutstanding)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Float</span>
              <span className="font-medium">{formatValue(overview.SharesFloat)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Short Ratio</span>
              <span className="font-medium">{formatValue(overview.SharesShort)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverviewCard; 