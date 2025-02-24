import React, { useState, useEffect } from 'react';
import { CompanyOverview, IncomeStatement, BalanceSheet, CashFlow, Earnings } from '../../types/alpha-vantage';
import { AlphaVantageAPI } from '../../services/AlphaVantageAPI';
import CompanyOverviewCard from './components/CompanyOverviewCard';
import FinancialStatementsCard from './components/FinancialStatementsCard';
import EarningsCard from './components/EarningsCard';
import LoadingOverlay from '../../components/LoadingOverlay';
import ContainerHeader from '../../components/ContainerHeader';
import ContainerEmptyState from '../../components/ContainerEmptyState';
import { ContainerProps, ContainerComponent } from '../../types/container';

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

        // Check if any of the responses contain an error message (Alpha Vantage specific)
        if ('Note' in overviewData || 'Information' in overviewData) {
          throw new Error(overviewData.Note || overviewData.Information || 'API limit reached. Please try again later.');
        }

        // Validate that we have actual data
        if (!overviewData.Symbol || !overviewData.Name) {
          throw new Error('No data available for this symbol');
        }

        setCompanyOverview(overviewData);
        setIncomeStatement(incomeData);
        setBalanceSheet(balanceData);
        setCashFlow(cashFlowData);
        setEarnings(earningsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fundamental data. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching fundamental data:', err);
        
        // Reset all data states on error
        setCompanyOverview(null);
        setIncomeStatement(null);
        setBalanceSheet(null);
        setCashFlow(null);
        setEarnings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFundamentalData();
  }, [searchQuery]);

  if (!searchQuery) {
    return <ContainerEmptyState title="Fundamental Analysis" />;
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

// Export both the component and its metadata
export const FundamentalAnalysisConfig: ContainerComponent = {
  title: 'Fundamental Analysis',
  description: 'Comprehensive fundamental analysis including company overview, financial statements, and earnings data.',
  Component: FundamentalAnalysisContainer
};

// Default export for the config
export default FundamentalAnalysisConfig; 