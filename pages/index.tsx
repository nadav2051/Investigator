import { useState, useEffect, useCallback, Component } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from '../components/SearchBar';
import SearchHistory from '../components/SearchHistory';
import { YahooFinanceConfig } from '../containers/YahooFinanceContainer';
import { RedditConfig } from '../containers/RedditContainer';
import { TechnicalAnalysisConfig } from '../containers/TechnicalAnalysisContainer';
import { FundamentalAnalysisConfig } from '../containers/FundamentalAnalysisContainer';
import type { ContainerComponent } from '../types/container';
import type { DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from 'react-beautiful-dnd';

// Error boundary component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <h2 className="text-red-800 font-medium">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-1">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add passive touch event listener
const TouchHandler = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const options: AddEventListenerOptions = { passive: true };
      const noop = () => {};
      window.addEventListener('touchstart', noop, options);
      window.addEventListener('touchmove', noop, options);
      return () => {
        window.removeEventListener('touchstart', noop, options);
        window.removeEventListener('touchmove', noop, options);
      };
    }
  }, []);

  return null;
};

// Dynamically import DragDropContext components with SSR disabled
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
);

// Register all available containers with safe IDs
const defaultContainers: (ContainerComponent & { id: string })[] = [
  { ...YahooFinanceConfig, id: 'yahoo-finance' },
  { ...RedditConfig, id: 'reddit' },
  { ...FundamentalAnalysisConfig, id: 'fundamental-analysis' },
  { ...TechnicalAnalysisConfig, id: 'technical-analysis' },
];

const MAX_HISTORY = 5;

// Droppable component wrapper to handle strict mode
const DroppableContainer = ({
  children
}: {
  children: (provided: DroppableProvided) => React.ReactElement;
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId="containers">
      {children}
    </Droppable>
  );
};

// Draggable component wrapper to handle strict mode
const DraggableContainer = ({ 
  id, 
  index, 
  children 
}: { 
  id: string; 
  index: number; 
  children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactElement;
}) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Draggable draggableId={id} index={index}>
      {children}
    </Draggable>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [containers, setContainers] = useState<(ContainerComponent & { id: string })[]>([]);

  // Load search history and container order on mount
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    const savedOrder = localStorage.getItem('containerOrder');
    if (savedOrder) {
      const orderMap = JSON.parse(savedOrder) as string[];
      const orderedContainers = orderMap
        .map(id => defaultContainers.find(c => c.id === id))
        .filter((c): c is (ContainerComponent & { id: string }) => c !== undefined);
      
      // Add any new containers that weren't in the saved order
      const newContainers = defaultContainers.filter(
        c => !orderMap.includes(c.id)
      );
      
      setContainers([...orderedContainers, ...newContainers]);
    } else {
      setContainers(defaultContainers);
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

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(containers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setContainers(items);
    localStorage.setItem('containerOrder', JSON.stringify(items.map(c => c.id)));
  }, [containers]);

  return (
    <main className="min-h-screen bg-background font-inter">
      <TouchHandler />
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
        <ErrorBoundary>
          <DragDropContext onDragEnd={handleDragEnd}>
            <DroppableContainer>
              {(provided: DroppableProvided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-8"
                >
                  {containers.map(({ id, title, Component }, index) => (
                    <DraggableContainer key={id} id={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`container-wrapper transition-shadow ${
                            snapshot.isDragging ? 'shadow-2xl' : ''
                          }`}
                        >
                          <div 
                            {...provided.dragHandleProps}
                            className="bg-gray-50 p-1 rounded-t-lg border-b border-gray-100 cursor-move hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full" />
                          </div>
                          <Component searchQuery={searchQuery} />
                        </div>
                      )}
                    </DraggableContainer>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </DroppableContainer>
          </DragDropContext>
        </ErrorBoundary>
      </div>
    </main>
  );
} 