import React, { useState } from 'react';
import { IncomeStatement, BalanceSheet, CashFlow } from '../../../types/alpha-vantage';

interface FinancialStatementsCardProps {
  incomeStatement: IncomeStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlow;
}

type StatementType = 'income' | 'balance' | 'cash';
type Period = 'annual' | 'quarterly';

const FinancialStatementsCard: React.FC<FinancialStatementsCardProps> = ({
  incomeStatement,
  balanceSheet,
  cashFlow,
}) => {
  const [activeStatement, setActiveStatement] = useState<StatementType>('income');
  const [activePeriod, setActivePeriod] = useState<Period>('annual');

  const formatValue = (value: string) => {
    if (!value || value === 'None') return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const renderIncomeStatement = () => {
    const reports = activePeriod === 'annual' 
      ? incomeStatement.annualReports 
      : incomeStatement.quarterlyReports;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {reports.slice(0, 4).map((report) => (
                <th key={report.fiscalDateEnding} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {report.fiscalDateEnding}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { label: 'Total Revenue', key: 'totalRevenue' },
              { label: 'Cost of Revenue', key: 'costOfRevenue' },
              { label: 'Gross Profit', key: 'grossProfit' },
              { label: 'Operating Income', key: 'operatingIncome' },
              { label: 'Net Income', key: 'netIncome' },
              { label: 'EBITDA', key: 'ebitda' },
              { label: 'EPS', key: 'reportedEPS' },
            ].map(({ label, key }) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {label}
                </td>
                {reports.slice(0, 4).map((report) => (
                  <td key={report.fiscalDateEnding} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValue(report[key as keyof typeof report])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBalanceSheet = () => {
    const reports = activePeriod === 'annual'
      ? balanceSheet.annualReports
      : balanceSheet.quarterlyReports;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {reports.slice(0, 4).map((report) => (
                <th key={report.fiscalDateEnding} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {report.fiscalDateEnding}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { label: 'Total Assets', key: 'totalAssets' },
              { label: 'Total Current Assets', key: 'totalCurrentAssets' },
              { label: 'Cash & Equivalents', key: 'cashAndCashEquivalentsAtCarryingValue' },
              { label: 'Total Liabilities', key: 'totalLiabilities' },
              { label: 'Total Current Liabilities', key: 'totalCurrentLiabilities' },
              { label: 'Long Term Debt', key: 'longTermDebt' },
              { label: 'Total Shareholder Equity', key: 'totalShareholderEquity' },
            ].map(({ label, key }) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {label}
                </td>
                {reports.slice(0, 4).map((report) => (
                  <td key={report.fiscalDateEnding} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValue(report[key as keyof typeof report])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCashFlow = () => {
    const reports = activePeriod === 'annual'
      ? cashFlow.annualReports
      : cashFlow.quarterlyReports;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metric
              </th>
              {reports.slice(0, 4).map((report) => (
                <th key={report.fiscalDateEnding} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {report.fiscalDateEnding}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { label: 'Operating Cash Flow', key: 'operatingCashflow' },
              { label: 'Capital Expenditures', key: 'capitalExpenditures' },
              { label: 'Cash Flow from Investment', key: 'cashflowFromInvestment' },
              { label: 'Cash Flow from Financing', key: 'cashflowFromFinancing' },
              { label: 'Dividend Payout', key: 'dividendPayout' },
              { label: 'Net Income', key: 'netIncome' },
            ].map(({ label, key }) => (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {label}
                </td>
                {reports.slice(0, 4).map((report) => (
                  <td key={report.fiscalDateEnding} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatValue(report[key as keyof typeof report])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Financial Statements</h2>
        <div className="flex space-x-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActiveStatement('income')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeStatement === 'income'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setActiveStatement('balance')}
              className={`px-4 py-2 text-sm font-medium ${
                activeStatement === 'balance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Balance
            </button>
            <button
              type="button"
              onClick={() => setActiveStatement('cash')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeStatement === 'cash'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cash Flow
            </button>
          </div>
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActivePeriod('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activePeriod === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Annual
            </button>
            <button
              type="button"
              onClick={() => setActivePeriod('quarterly')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activePeriod === 'quarterly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      {activeStatement === 'income' && renderIncomeStatement()}
      {activeStatement === 'balance' && renderBalanceSheet()}
      {activeStatement === 'cash' && renderCashFlow()}
    </div>
  );
};

export default FinancialStatementsCard; 