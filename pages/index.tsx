import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import YahooFinanceConfig from '../containers/YahooFinanceContainer';
import RedditConfig from '../containers/RedditContainer';
import type { ContainerComponent } from '../types/container';

// Register all available containers
const containers: ContainerComponent[] = [
  YahooFinanceConfig,
  RedditConfig,
  // Add more containers here as they're created
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    // Ensure query is properly formatted and not empty
    const formattedQuery = query.trim().toUpperCase();
    console.log('Search triggered:', { raw: query, formatted: formattedQuery });
    
    if (!formattedQuery) {
      console.log('Empty query, skipping update');
      return;
    }

    setSearchQuery(formattedQuery);
  };

  // Debug render
  console.log('Home rendering:', {
    hasQuery: !!searchQuery,
    query: searchQuery,
    containers: containers.map(c => c.title)
  });

  return (
    <main className="min-h-screen bg-background font-inter">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl font-bold text-text mb-8">Stock Information</h1>
        
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
          <div className="mt-2 text-sm text-gray-500">
            Current search: {searchQuery || 'None'}
          </div>
        </div>

        {/* Containers Section */}
        <div className="space-y-8">
          {containers.map(({ title, Component }) => (
            <div key={title} className="container-wrapper">
              <div className="mb-2 text-sm text-gray-500">
                Container: {title}, Query: {searchQuery || 'None'}
              </div>
              <Component searchQuery={searchQuery} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 