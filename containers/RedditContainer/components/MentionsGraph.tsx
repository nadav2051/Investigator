import React from 'react';

interface MentionData {
  date: string;
  count: number;
  averageSentiment: number;
}

interface MentionsGraphProps {
  data?: MentionData[];
}

const MentionsGraph: React.FC<MentionsGraphProps> = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate graph dimensions
  const graphHeight = 160; // pixels
  const pixelsPerCount = graphHeight / maxCount;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">Mentions Over Time</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
            <span>Bullish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
            <span>Bearish</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] relative mt-8">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pointer-events-none">
          <span>{maxCount}</span>
          <span>{Math.floor(maxCount / 2)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-8 right-0 h-full flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-gray-100"></div>
          <div className="w-full border-t border-gray-100"></div>
          <div className="w-full border-t border-gray-100"></div>
        </div>

        {/* Bars container */}
        <div className="absolute left-8 right-4 bottom-8 h-40 flex items-end justify-between gap-1">
          {data.map((item) => {
            // Calculate bar height in pixels
            const heightInPixels = Math.max(item.count * pixelsPerCount, 4);
            const sentimentColor = item.averageSentiment > 0.2 ? 'bg-emerald-500' :
                                 item.averageSentiment < -0.2 ? 'bg-rose-500' :
                                 'bg-amber-500';
            
            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center group relative min-w-[20px]"
                title={`${item.count} mentions on ${formatDate(item.date)}`}
              >
                {/* Count label */}
                <div className="absolute -top-6 w-full text-center text-xs text-gray-500">
                  {item.count}
                </div>

                {/* Bar */}
                <div
                  className={`w-full ${sentimentColor} opacity-90 rounded-t transition-all hover:opacity-100`}
                  style={{ 
                    height: `${heightInPixels}px`,
                  }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    <div className="font-medium">{item.count} mentions</div>
                    <div>Sentiment: {item.averageSentiment.toFixed(2)}</div>
                  </div>
                </div>

                {/* Date label */}
                <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 -rotate-45 text-xs text-gray-500 whitespace-nowrap origin-top">
                  {formatDate(item.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MentionsGraph; 