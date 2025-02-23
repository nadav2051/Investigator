import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';

interface AskAIProps {
  containerType: 'yahoo' | 'technical' | 'reddit';
  containerData: any;
  className?: string;
}

interface AIResponse {
  question: string;
  answer: string;
  timestamp: number;
}

export const AskAI: React.FC<AskAIProps> = ({ containerType, containerData, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<AIResponse[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 255;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && 
          buttonRef.current && 
          !popoverRef.current.contains(event.target as Node) &&
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          containerType,
          containerData,
          previousConversation: conversation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setConversation([...conversation, {
        question,
        answer: data.answer,
        timestamp: Date.now()
      }]);
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charsRemaining = MAX_CHARS - question.length;
  const charsPercentage = (question.length / MAX_CHARS) * 100;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        title="Ask AI about this data"
      >
        🤖
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4">
            <div className="mb-4">
              <textarea
                ref={inputRef}
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
                onKeyPress={handleKeyPress}
                placeholder="Ask AI about this data..."
                className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                <span>{charsRemaining} characters remaining</span>
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      charsPercentage > 90 ? 'bg-red-500' :
                      charsPercentage > 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${charsPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {conversation.length > 0 && (
              <div className="mb-4 space-y-4 max-h-96 overflow-y-auto">
                {conversation.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-gray-50 p-2 rounded-lg text-sm">
                      <span className="font-medium">You:</span> {item.question}
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg text-sm">
                      <span className="font-medium">AI:</span>
                      <div className="prose prose-sm mt-1">
                        <ReactMarkdown>
                          {item.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!question.trim() || isLoading}
                className={`px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 
                  ${(!question.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="text-white" />
                    Thinking...
                  </>
                ) : (
                  'Ask AI'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 