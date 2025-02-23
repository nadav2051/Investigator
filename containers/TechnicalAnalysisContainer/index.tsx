import React, { useEffect, useState, useRef } from 'react';
import { createChart, ColorType, Time, IChartApi, ISeriesApi } from 'lightweight-charts';
import { TechnicalAnalysisData } from './types';
import { calculateIndicators } from './utils';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import IndicatorCard from './components/IndicatorCard';
import type { ContainerProps } from '../../types/container';
import { AskAI } from '../../components/AskAI';

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TechnicalAnalysisContainer: React.FC<ContainerProps> = ({ searchQuery }) => {
  const [data, setData] = useState<TechnicalAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Add visibility state for each SMA line
  const [smaVisibility, setSmaVisibility] = useState({
    sma20: true,
    sma50: true,
    sma150: true,
    sma200: true
  });
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const candlestickSeries = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const sma20Series = useRef<ISeriesApi<'Line'> | null>(null);
  const sma50Series = useRef<ISeriesApi<'Line'> | null>(null);
  const sma150Series = useRef<ISeriesApi<'Line'> | null>(null);
  const sma200Series = useRef<ISeriesApi<'Line'> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    console.log('Starting chart initialization...');

    const handleResize = () => {
      if (chartContainerRef.current && chart.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    try {
      // Clean up previous chart instance if it exists
      if (chart.current) {
        console.log('Removing previous chart instance');
        chart.current.remove();
      }

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

      try {
        // Create candlestick series
        const candlestickSeriesInstance = chartInstance.addCandlestickSeries({
          upColor: '#4CAF50',
          downColor: '#FF5252',
          wickUpColor: '#4CAF50',
          wickDownColor: '#FF5252',
          borderVisible: false,
        });

        // Create SMA line series
        const sma20SeriesInstance = chartInstance.addLineSeries({
          color: '#2196F3',
          lineWidth: 2,
          title: 'SMA 20',
          visible: smaVisibility.sma20,
        });

        const sma50SeriesInstance = chartInstance.addLineSeries({
          color: '#9C27B0',
          lineWidth: 2,
          title: 'SMA 50',
          visible: smaVisibility.sma50,
        });

        const sma150SeriesInstance = chartInstance.addLineSeries({
          color: '#FF9800',
          lineWidth: 2,
          title: 'SMA 150',
          visible: smaVisibility.sma150,
        });

        const sma200SeriesInstance = chartInstance.addLineSeries({
          color: '#F44336',
          lineWidth: 2,
          title: 'SMA 200',
          visible: smaVisibility.sma200,
        });

        chart.current = chartInstance;
        candlestickSeries.current = candlestickSeriesInstance;
        sma20Series.current = sma20SeriesInstance;
        sma50Series.current = sma50SeriesInstance;
        sma150Series.current = sma150SeriesInstance;
        sma200Series.current = sma200SeriesInstance;

        window.addEventListener('resize', handleResize);
      } catch (error) {
        console.error('Failed to create series:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to initialize chart:', err);
      setError('Failed to initialize chart: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
        chart.current = null;
        candlestickSeries.current = null;
        sma20Series.current = null;
        sma50Series.current = null;
        sma150Series.current = null;
        sma200Series.current = null;
      }
    };
  }, [searchQuery, smaVisibility]);

  // Toggle visibility handler
  const handleToggleVisibility = (smaType: keyof typeof smaVisibility) => {
    setSmaVisibility(prev => {
      const newVisibility = { ...prev, [smaType]: !prev[smaType] };
      const series = {
        sma20: sma20Series.current,
        sma50: sma50Series.current,
        sma150: sma150Series.current,
        sma200: sma200Series.current
      }[smaType];
      
      if (series) {
        series.applyOptions({ visible: newVisibility[smaType] });
      }
      
      return newVisibility;
    });
  };

  // Fetch and update data
  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        setData(null);
        if (candlestickSeries.current) {
          candlestickSeries.current.setData([]);
        }
        [sma20Series, sma50Series, sma150Series, sma200Series].forEach(series => {
          if (series.current) {
            series.current.setData([]);
          }
        });
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

        if (!historicalData || historicalData.length === 0) {
          throw new Error('No historical data received');
        }

        const processedData = calculateIndicators(historicalData);
        setData(processedData);

        // Wait for chart to be initialized
        setTimeout(() => {
          if (candlestickSeries.current && processedData.prices) {
            const chartData = processedData.prices.map((price) => ({
              time: price.timestamp / 1000 as Time,
              open: price.open,
              high: price.high,
              low: price.low,
              close: price.close,
            }));

            try {
              // Set candlestick data
              candlestickSeries.current.setData(chartData);

              // Set SMA data for all lines
              const setLineData = (
                series: React.RefObject<ISeriesApi<'Line'> | null>,
                values: number[] | undefined,
                period: number
              ) => {
                if (series.current && values) {
                  const data = processedData.prices.slice(period - 1).map((price, index) => ({
                    time: price.timestamp / 1000 as Time,
                    value: values[index] || price.close
                  }));
                  series.current.setData(data);
                }
              };

              setLineData(sma20Series, processedData.sma20?.values, 20);
              setLineData(sma50Series, processedData.sma50?.values, 50);
              setLineData(sma150Series, processedData.sma150?.values, 150);
              setLineData(sma200Series, processedData.sma200?.values, 200);

              if (chart.current) {
                chart.current.timeScale().fitContent();
              }
            } catch (error) {
              console.error('Error updating chart:', error);
            }
          }
        }, 0);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
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
              <div ref={chartContainerRef} className="w-full h-[400px] mb-4" />
              {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.sma20 && (
                    <IndicatorCard
                      indicator={data.sma20}
                      onToggleVisibility={() => handleToggleVisibility('sma20')}
                      isVisible={smaVisibility.sma20}
                    />
                  )}
                  {data.sma50 && (
                    <IndicatorCard
                      indicator={data.sma50}
                      onToggleVisibility={() => handleToggleVisibility('sma50')}
                      isVisible={smaVisibility.sma50}
                    />
                  )}
                  {data.sma150 && (
                    <IndicatorCard
                      indicator={data.sma150}
                      onToggleVisibility={() => handleToggleVisibility('sma150')}
                      isVisible={smaVisibility.sma150}
                    />
                  )}
                  {data.sma200 && (
                    <IndicatorCard
                      indicator={data.sma200}
                      onToggleVisibility={() => handleToggleVisibility('sma200')}
                      isVisible={smaVisibility.sma200}
                    />
                  )}
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