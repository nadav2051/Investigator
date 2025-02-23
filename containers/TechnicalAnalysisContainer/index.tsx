import React, { useEffect, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { TechnicalAnalysisData } from './types';
import { calculateIndicators } from './utils';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import IndicatorCard from './components/IndicatorCard';
import type { ContainerProps } from '../../types/container';
import { AskAI } from '../../components/AskAI';

const TechnicalAnalysisContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [data, setData] = useState<TechnicalAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize chart
  useEffect(() => {
    const chartContainer = document.getElementById('technical-chart');
    if (chartContainer && !chartInstance) {
      const chart = createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });

      // Cast the chart to any to access the addCandlestickSeries method
      // This is a workaround for the incomplete TypeScript definitions in the library
      const series = (chart as any).addCandlestickSeries({
        upColor: '#4CAF50',
        downColor: '#FF5252',
        borderVisible: false,
        wickUpColor: '#4CAF50',
        wickDownColor: '#FF5252',
      });

      setChartInstance(chart);
      setCandlestickSeries(series);

      // Handle resize
      const handleResize = () => {
        chart.applyOptions({
          width: chartContainer.clientWidth,
        });
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
        setChartInstance(null);
        setCandlestickSeries(null);
      };
    }
  }, []);

  // Fetch and update data
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        setData(null);
        if (candlestickSeries) {
          candlestickSeries.setData([]);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/yahoo-finance/historical?symbol=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const historicalData = await response.json();
        const processedData = calculateIndicators(historicalData);
        setData(processedData);

        if (candlestickSeries) {
          const chartData = processedData.prices.map((price) => ({
            time: price.timestamp / 1000 as Time,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
          }));
          candlestickSeries.setData(chartData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, candlestickSeries]);

  if (!searchQuery) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Technical Analysis</h2>
        <div className="text-gray-500 text-center py-8">
          Enter a stock symbol to view technical analysis
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Technical Analysis - {searchQuery}</h2>
          {isLoading && <LoadingSpinner size="sm" />}
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <AskAI
              containerType="technical"
              containerData={data}
            />
          )}
          <span 
            className={`transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            ▲
          </span>
        </div>
      </div>

      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'h-0 overflow-hidden' : ''}`}>
        <div className="p-4 border-t">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="font-medium text-red-700">Error Loading Data</div>
              <div className="text-sm text-red-600 mt-1">{error}</div>
            </div>
          ) : (
            <>
              <div id="technical-chart" className="w-full h-[400px] mb-4" />

              {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.sma20 && <IndicatorCard indicator={data.sma20} />}
                  {data.sma50 && <IndicatorCard indicator={data.sma50} />}
                  {data.sma200 && <IndicatorCard indicator={data.sma200} />}
                  {data.ema20 && <IndicatorCard indicator={data.ema20} />}
                  {data.rsi && <IndicatorCard indicator={data.rsi} />}
                  
                  {/* MACD Section */}
                  {data.macd && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">MACD</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <IndicatorCard indicator={data.macd.macdLine} />
                        <IndicatorCard indicator={data.macd.signalLine} />
                        <IndicatorCard indicator={data.macd.histogram} />
                      </div>
                    </div>
                  )}

                  {/* Bollinger Bands Section */}
                  {data.bollingerBands && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">Bollinger Bands</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <IndicatorCard indicator={data.bollingerBands.upper} />
                        <IndicatorCard indicator={data.bollingerBands.middle} showSignal={false} />
                        <IndicatorCard indicator={data.bollingerBands.lower} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const TechnicalAnalysisConfig = {
  title: 'Technical Analysis',
  description: 'Displays technical indicators and chart analysis',
  Component: TechnicalAnalysisContainer
};

export default TechnicalAnalysisConfig; 