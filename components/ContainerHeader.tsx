import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AskAI } from './AskAI';

interface ContainerHeaderProps {
  title: string;
  symbol: string;
  isLoading?: boolean;
  isCollapsed: boolean;
  onCollapse: () => void;
  className?: string;
  aiProps?: {
    containerType: 'yahoo' | 'technical' | 'reddit';
    containerData: any;
    onOpen: () => void;
  };
}

const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  title,
  symbol,
  isLoading,
  isCollapsed,
  onCollapse,
  className = '',
  aiProps
}) => {
  return (
    <div 
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/50 transition-colors border-b border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title} - {symbol}</h2>
        {isLoading && <LoadingSpinner size="sm" />}
      </div>
      <div className="flex items-center gap-2">
        {aiProps && (
          <AskAI
            containerType={aiProps.containerType}
            containerData={aiProps.containerData}
            onOpen={aiProps.onOpen}
          />
        )}
        <span 
          className={`transform transition-transform ${isCollapsed ? '' : 'rotate-180'} text-gray-400 hover:text-gray-600`}
          onClick={onCollapse}
        >
          ▲
        </span>
      </div>
    </div>
  );
}

export default ContainerHeader; 