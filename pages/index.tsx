import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import YahooFinanceConfig from '../containers/YahooFinanceContainer';
import type { ContainerComponent } from '../types/container';

// Register all available containers
const containers: ContainerComponent[] = [
  YahooFinanceConfig,
  // Add more containers here as they're created
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <main className="min-h-screen bg-background font-inter">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-4xl font-bold text-text mb-8">Stock Information</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="mt-8 space-y-8">
          {containers.map(({ title, Component }) => (
            <Component key={title} searchQuery={searchQuery} />
          ))}
        </div>
      </div>
    </main>
  );
} 