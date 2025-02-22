import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim().toUpperCase());
  };

  const handleButtonClick = () => {
    if (!query.trim()) return;
    onSearch(query.trim().toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 