import React, { useState } from 'react';
import { StockData } from '../types';

interface NewsArticlesProps {
  articles: NonNullable<StockData['newsArticles']>;
  isLoading?: boolean;
}

const NewsArticles: React.FC<NewsArticlesProps> = ({ articles, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedArticles = showAll ? articles : articles.slice(0, 3);

  if (articles.length === 0) {
    return (
      <div className="text-gray-500 text-center py-1 text-[10px]">
        No recent news articles found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayedArticles.map((article, index) => (
        <a
          key={index}
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:bg-gray-50 transition-colors rounded"
        >
          <div className="flex items-start gap-2 py-1">
            {article.thumbnail && (
              <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden">
                <img
                  src={article.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-medium text-gray-900 line-clamp-1">
                {article.title}
              </h4>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                <span className="font-medium">{article.publisher}</span>
                <span>•</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className={`px-1 py-px rounded-full ${
                  article.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  article.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {article.sentiment && article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </a>
      ))}
      
      {articles.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[10px] text-primary hover:text-primary/80 transition-colors w-full text-center py-0.5"
        >
          {showAll ? 'Show Less' : `Show ${articles.length - 3} More Articles`}
        </button>
      )}
    </div>
  );
};

export default NewsArticles; 