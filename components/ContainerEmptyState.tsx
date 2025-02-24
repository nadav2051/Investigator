import React from 'react';

interface ContainerEmptyStateProps {
  title: string;
  message?: string;
}

const ContainerEmptyState: React.FC<ContainerEmptyStateProps> = ({ 
  title, 
  message = "Enter a stock symbol to view detailed information" 
}) => {
  return (
    <div className="p-3 border rounded-lg shadow-sm bg-white">
      <div className="text-gray-500 flex items-center gap-2">
        <span className="font-semibold text-gray-800">{title}</span>
        <span>•</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ContainerEmptyState;

 