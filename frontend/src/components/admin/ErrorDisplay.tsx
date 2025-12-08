import React from 'react';
import type { ErrorInfo } from '../../utils/errorHandler';

interface ErrorDisplayProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="h-6 w-6 flex-shrink-0 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 whitespace-pre-line">
            {error.message}
          </p>
          {error.supportContact && (
            <p className="mt-2 text-xs text-red-700">{error.supportContact}</p>
          )}
          <div className="mt-3 flex gap-2">
            {error.canRetry && onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Thử lại
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
