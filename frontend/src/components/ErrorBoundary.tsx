
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  messageId: number;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Message error boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-start">
          <div className="flex items-end space-x-3 max-w-[85%]">
            {/* Avatar */}
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            
            {/* Error message bubble */}
            <div className="relative px-5 py-4 rounded-2xl bg-red-900/30 border border-red-700/50 shadow-lg backdrop-blur-sm">
              <div className="text-sm text-red-300">
                <div className="font-medium mb-1">Message Error</div>
                <div className="text-xs opacity-80">
                  Failed to render message #{this.props.messageId}
                </div>
              </div>
              
              {/* Message tail */}
              <div className="absolute w-3 h-3 bg-red-900/30 border-r border-b border-red-700/50 transform rotate-45 -left-1 bottom-4" />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
