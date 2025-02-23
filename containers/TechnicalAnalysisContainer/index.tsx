import React, { useEffect, useState, useRef } from 'react';
import { createChart, ColorType, Time, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { TechnicalAnalysisData } from './types';
import { calculateIndicators } from './utils';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import IndicatorCard from './components/IndicatorCard';
import type { ContainerProps } from '../../types/container';
import { AskAI } from '../../components/AskAI';

interface ChartData extends Omit<CandlestickData, 'time'> {
  time: Time;
}

const TechnicalAnalysisContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [data, setData] = useState<TechnicalAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || chart.current) return;

    console.log('Initializing chart...');

    const handleResize = () => {
      if (chartContainerRef.current && chart.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    try {
      // Create chart instance
      const chartInstance = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { 
            type: ColorType.Solid,
            color: '#FFFFFF'
          },
          textColor: '#333333',
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

      console.log('Chart instance created successfully');

      // Create candlestick series
      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: '#4CAF50',
        downColor: '#FF5252',
        borderVisible: false,
        wickUpColor: '#4CAF50',
        wickDownColor: '#FF5252',
      });

      console.log('Candlestick series created successfully');

      chart.current = chartInstance;
      series.current = candlestickSeries;

      window.addEventListener('resize', handleResize);
    } catch (err) {
      console.error('Failed to initialize chart:', err);
      setError('Failed to initialize chart: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
        chart.current = null;
        series.current = null;
      }
    };
  }, []);

  // Fetch and update data
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        setData(null);
        if (series.current) {
          series.current.setData([]);
        }
        return;
      }

      console.log(`Fetching data for ${searchQuery}...`);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/yahoo-finance/historical?symbol=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const historicalData = await response.json();
        console.log('Historical data received:', historicalData?.length, 'data points');

        if (!historicalData || historicalData.length === 0) {
          throw new Error('No historical data received');
        }

        const processedData = calculateIndicators(historicalData);
        console.log('Processed data:', {
          sma20: processedData.sma20?.value,
          rsi: processedData.rsi?.value,
          macd: processedData.macd?.macdLine.value,
          prices: processedData.prices?.length
        });

        setData(processedData);

        if (series.current && processedData.prices) {
          const chartData: ChartData[] = processedData.prices.map((price) => ({
            time: price.timestamp / 1000 as Time,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
          }));

          console.log('Setting chart data:', chartData.length, 'points');
          series.current.setData(chartData);

          // Fit content after setting data
          if (chart.current) {
            chart.current.timeScale().fitContent();
          }
        } else {
          console.warn('Series not available or no price data');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Update chart on collapse state change
  useEffect(() => {
    if (!isCollapsed && chart.current && chartContainerRef.current) {
      requestAnimationFrame(() => {
        if (chart.current && chartContainerRef.current) {
          chart.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
          chart.current.timeScale().fitContent();
        }
      });
    }
  }, [isCollapsed]);

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
      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Technical Analysis - {searchQuery}</h2>
          {isLoading && <LoadingSpinner size="sm" />}
        </div>
        <div className="flex items-center gap-2">
          {data && (
            <AskAI
              containerType="technical"
              containerData={data}
              onOpen={() => setIsCollapsed(false)}
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
              {isLoading && !data && (
                <div className="flex items-center justify-center h-[400px]">
                  <LoadingSpinner size="lg" />
                </div>
              )}
              <div ref={chartContainerRef} className={`w-full h-[400px] mb-4 ${isLoading && !data ? 'hidden' : ''}`} />
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