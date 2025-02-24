import React, { useState, useEffect } from 'react';
import { CompanyOverview, IncomeStatement, BalanceSheet, CashFlow, Earnings } from '../../types/alpha-vantage';
import { AlphaVantageAPI } from '../../services/AlphaVantageAPI';
import CompanyOverviewCard from './components/CompanyOverviewCard';
import FinancialStatementsCard from './components/FinancialStatementsCard';
import EarningsCard from './components/EarningsCard';
import LoadingOverlay from '../../components/LoadingOverlay';
import ContainerHeader from '../../components/ContainerHeader';
import { ContainerProps } from '../../types/container';

const FundamentalAnalysisContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [companyOverview, setCompanyOverview] = useState<CompanyOverview | null>(null);
  const [incomeStatement, setIncomeStatement] = useState<IncomeStatement | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlow | null>(null);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchFundamentalData = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const [
          overviewData,
          incomeData,
          balanceData,
          cashFlowData,
          earningsData
        ] = await Promise.all([
          AlphaVantageAPI.getCompanyOverview(searchQuery),
          AlphaVantageAPI.getIncomeStatement(searchQuery),
          AlphaVantageAPI.getBalanceSheet(searchQuery),
          AlphaVantageAPI.getCashFlow(searchQuery),
          AlphaVantageAPI.getEarnings(searchQuery)
        ]);

        setCompanyOverview(overviewData);
        setIncomeStatement(incomeData);
        setBalanceSheet(balanceData);
        setCashFlow(cashFlowData);
        setEarnings(earningsData);
      } catch (err) {
        setError('Failed to fetch fundamental data. Please try again later.');
        console.error('Error fetching fundamental data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFundamentalData();
  }, [searchQuery]);

  if (!searchQuery) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Fundamental Analysis</h2>
        <div className="text-gray-500 text-center py-8">
          Enter a stock symbol to view detailed information
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <ContainerHeader
        title="Fundamental Analysis"
        symbol={searchQuery}
        isLoading={loading}
        isCollapsed={isCollapsed}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
        className="bg-gradient-to-r from-blue-50 to-indigo-50/50"
        aiProps={companyOverview ? {
          containerType: "yahoo",
          containerData: {
            overview: companyOverview,
            financials: {
              income: incomeStatement,
              balance: balanceSheet,
              cashFlow: cashFlow,
              earnings: earnings
            }
          },
          onOpen: () => setIsCollapsed(false)
        } : undefined}
      />

      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'h-0 overflow-hidden' : ''}`}>
        <div className="p-3 border-t">
          {loading && !companyOverview && (
            <LoadingOverlay message={`Loading data for ${searchQuery.toUpperCase()}...`} />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          )}

          <div className={`max-h-[800px] overflow-y-auto space-y-3 ${loading ? 'opacity-50' : ''}`}>
            {companyOverview && (
              <CompanyOverviewCard overview={companyOverview} />
            )}
            
            {incomeStatement && balanceSheet && cashFlow && (
              <FinancialStatementsCard
                incomeStatement={incomeStatement}
                balanceSheet={balanceSheet}
                cashFlow={cashFlow}
              />
            )}
            
            {earnings && (
              <EarningsCard earnings={earnings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the container component
export default FundamentalAnalysisContainer; 