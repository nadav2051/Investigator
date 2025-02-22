import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  console.log('🔄 SearchBar rendering');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    console.log('🔍 Form submit event triggered');
    e.preventDefault();
    if (!query.trim()) {
      console.log('⚠️ Empty query, skipping search');
      return;
    }
    console.log('🔍 SearchBar submitting query:', query);
    onSearch(query.trim().toUpperCase());
  };

  const handleButtonClick = () => {
    console.log('🔘 Search button clicked');
    if (!query.trim()) {
      console.log('⚠️ Empty query, skipping search');
      return;
    }
    console.log('🔍 SearchBar submitting query (via button):', query);
    onSearch(query.trim().toUpperCase());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('⌨️ SearchBar input changed:', newQuery);
    setQuery(newQuery);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full"
      onClick={() => console.log('📝 Form clicked')}
    >
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onClick={() => console.log('📝 Input clicked')}
          onFocus={() => console.log('📝 Input focused')}
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