import React from 'react';

interface MentionData {
  date: string;
  count: number;
  averageSentiment: number;
}

interface MentionsGraphProps {
  data: MentionData[];
}

const MentionsGraph: React.FC<MentionsGraphProps> = ({ data }) => {
  if (!data.length) return null;

  const maxCount = Math.max(...data.map(d => d.count));
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Mentions Over Time</h3>
      <div className="relative h-40">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {data.map((item) => {
            const height = (item.count / maxCount) * 100;
            const sentimentColor = item.averageSentiment > 0.2 ? 'bg-green-100' :
                                 item.averageSentiment < -0.2 ? 'bg-red-100' :
                                 'bg-yellow-100';
            return (
              <div
                key={item.date}
                className="flex-1 flex flex-col items-center group"
                title={`${item.count} mentions on ${formatDate(item.date)}`}
              >
                <div className="relative w-full">
                  <div
                    className={`w-full ${sentimentColor} hover:opacity-80 transition-all cursor-pointer`}
                    style={{ height: `${height}%` }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      {item.count} mentions
                      <br />
                      Sentiment: {item.averageSentiment.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
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