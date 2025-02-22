import { RedditData, RedditPost } from '../api';
import LoadingSpinner from '../../../components/LoadingSpinner';

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return `${Math.round(diffInHours)}h ago`;
  } else if (diffInHours < 168) { // 7 days
    return `${Math.round(diffInHours / 24)}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const SentimentIndicator: React.FC<{ value: number; rawValue?: number }> = ({ value, rawValue }) => {
  const percentage = ((value + 1) / 2) * 100;
  const getColor = () => {
    if (value > 0.5) return 'bg-green-500';
    if (value > 0.2) return 'bg-green-300';
    if (value < -0.5) return 'bg-red-500';
    if (value < -0.2) return 'bg-red-300';
    return 'bg-yellow-500';
  };

  const getSentimentText = () => {
    if (value > 0.5) return '🟢 Very Bullish';
    if (value > 0.2) return '🟢 Bullish';
    if (value < -0.5) return '🔴 Very Bearish';
    if (value < -0.2) return '🔴 Bearish';
    return '🟡 Neutral';
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-gray-600 min-w-[5.5rem]">
        {getSentimentText()}
      </span>
      {rawValue !== undefined && (
        <span className="text-gray-400 text-[10px]">
          ({rawValue.toFixed(2)})
        </span>
      )}
    </div>
  );
};

const DiscussionCard: React.FC<{ post: RedditPost }> = ({ post }) => (
  <div className="border-b border-gray-100 py-2 last:border-0">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline font-medium block truncate"
        >
          {post.title}
        </a>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>r/{post.subreddit}</span>
          <span>•</span>
          <span>{formatDate(post.created_utc)}</span>
          <span>•</span>
          <span>↑{post.score}</span>
          <span>•</span>
          <span>💬{post.num_comments}</span>
        </div>
      </div>
      <SentimentIndicator value={post.sentiment} rawValue={post.rawSentiment} />
    </div>
  </div>
);

interface RedditDisplayProps {
  data: RedditData;
  isLoading?: boolean;
}

const RedditDisplay: React.FC<RedditDisplayProps> = ({ data, isLoading = false }) => {
  return (
    <div className="space-y-4">
      {/* Search Info */}
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <div>
          Searching: {data.searchInfo.subreddits.join(', ')} • Past {data.searchInfo.timeframe}
        </div>
        <div>
          Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-gray-600">Sentiment</div>
            <SentimentIndicator value={data.overallSentiment} />
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-sm text-gray-600">Mentions</div>
            <div className="font-medium">{data.mentionCount}</div>
          </div>
        </div>
        {isLoading && <LoadingSpinner size="sm" />}
      </div>

      {/* Discussion Posts */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Recent Discussions
            {isLoading && <LoadingSpinner size="sm" className="inline-block" />}
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {data.posts.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No discussions found in the selected timeframe
            </div>
          ) : (
            <div className="px-3">
              {data.posts.map(post => (
                <DiscussionCard key={post.url} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedditDisplay; 