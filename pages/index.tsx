import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchHistory from '../components/SearchHistory';
import YahooFinanceConfig from '../containers/YahooFinanceContainer';
import RedditConfig from '../containers/RedditContainer';
import TechnicalAnalysisConfig from '../containers/TechnicalAnalysisContainer';
import type { ContainerComponent } from '../types/container';

// Register all available containers
const containers: ContainerComponent[] = [
  YahooFinanceConfig,
  RedditConfig,
  TechnicalAnalysisConfig,
  // Add more containers here as they're created
];

const MAX_HISTORY = 5;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history on mount
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const addToHistory = (query: string) => {
    const newHistory = [
      query,
      ...searchHistory.filter(s => s !== query)
    ].slice(0, MAX_HISTORY);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSearch = (query: string) => {
    const formattedQuery = query.trim().toUpperCase();
    if (!formattedQuery) return;
    
    setSearchQuery(formattedQuery);
    addToHistory(formattedQuery);
  };

  return (
    <main className="min-h-screen bg-background font-inter">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl font-bold text-text mb-8">Stock Information</h1>
        
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
          <SearchHistory 
            onSelect={handleSearch}
            searchHistory={searchHistory}
          />
        </div>

        {/* Containers Section */}
        <div className="space-y-8">
          {containers.map(({ title, Component }) => (
            <div key={title} className="container-wrapper">
              <Component searchQuery={searchQuery} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 