import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay; 