import React, { useState, useMemo } from 'react';
import { Earnings } from '../../../types/alpha-vantage';

interface EarningsCardProps {
  earnings: Earnings;
}

type TabType = 'quarterly' | 'annual';

interface EnhancedAnnualEarning {
  fiscalDateEnding: string;
  reportedEPS: string;
  growthRate: number | null;
  fiveYearAvg?: number;
  threeYearAvg?: number;
}

const EarningsCard: React.FC<EarningsCardProps> = ({ earnings }) => {
  const [activeTab, setActiveTab] = useState<TabType>('quarterly');

  const formatValue = (value: string | number | null) => {
    if (!value || value === 'None') return '-';
    return typeof value === 'string' ? Number(value).toFixed(2) : value.toFixed(2);
  };

  const formatPercentage = (value: string | number | null) => {
    if (!value || value === 'None') return '-';
    const numValue = typeof value === 'string' ? Number(value) : value;
    return `${numValue >= 0 ? '+' : ''}${numValue.toFixed(2)}%`;
  };

  const enhancedAnnualEarnings = useMemo(() => {
    if (!earnings?.annualEarnings?.length) {
      return [];
    }

    const annualData = earnings.annualEarnings.slice(0, 5).map((earning, index, array) => {
      const currentEPS = Number(earning.reportedEPS);
      const prevEPS = index < array.length - 1 ? Number(array[index + 1].reportedEPS) : null;
      
      // Calculate YoY growth rate
      const growthRate = prevEPS ? ((currentEPS - prevEPS) / Math.abs(prevEPS)) * 100 : null;

      // Calculate moving averages
      const threeYearAvg = index < array.length - 2 
        ? (currentEPS + Number(array[index + 1].reportedEPS) + Number(array[index + 2].reportedEPS)) / 3
        : undefined;

      const fiveYearAvg = index === 0 && array.length >= 5
        ? array.slice(0, 5).reduce((sum, item) => sum + Number(item.reportedEPS), 0) / 5
        : undefined;

      return {
        ...earning,
        growthRate,
        threeYearAvg,
        fiveYearAvg
      };
    });

    return annualData;
  }, [earnings?.annualEarnings]);

  if (!earnings?.quarterlyEarnings?.length && !earnings?.annualEarnings?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <div className="text-gray-500 text-center py-4">
          No earnings data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">Earnings History</h2>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('quarterly')}
            className={`px-3 py-1 text-sm font-medium rounded-l-md ${
              activeTab === 'quarterly'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Quarterly
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('annual')}
            className={`px-3 py-1 text-sm font-medium rounded-r-md ${
              activeTab === 'annual'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'quarterly' ? (
          earnings.quarterlyEarnings?.length ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiscal Date
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Est. EPS
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual EPS
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Surprise %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earnings.quarterlyEarnings.slice(0, 8).map((quarter) => (
                  <tr key={quarter.fiscalDateEnding} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {quarter.fiscalDateEnding}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {quarter.reportedDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatValue(quarter.estimatedEPS)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatValue(quarter.reportedEPS)}
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap text-sm ${
                      Number(quarter.surprisePercentage) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(quarter.surprisePercentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500 text-center py-4">
              No quarterly earnings data available
            </div>
          )
        ) : enhancedAnnualEarnings.length ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiscal Year
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EPS
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YoY Growth
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  3Y Avg
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  5Y Avg
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enhancedAnnualEarnings.map((annual) => (
                <tr key={annual.fiscalDateEnding} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {annual.fiscalDateEnding}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(annual.reportedEPS)}
                  </td>
                  <td className={`px-3 py-2 whitespace-nowrap text-sm ${
                    annual.growthRate && annual.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {annual.growthRate ? formatPercentage(annual.growthRate) : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {annual.threeYearAvg ? formatValue(annual.threeYearAvg) : '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {annual.fiveYearAvg ? formatValue(annual.fiveYearAvg) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No annual earnings data available
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsCard; 