import React from 'react';

interface ReviewStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showCount?: boolean;
}

const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  showCount = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating);
    }
  };

  const renderStar = (index: number) => {
    const starRating = index + 1;
    const isFilled = rating >= starRating;
    const isHalf = rating >= starRating - 0.5 && rating < starRating;

    return (
      <button
        key={index}
        onClick={() => handleClick(starRating)}
        disabled={!interactive}
        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        aria-label={`${starRating} star`}
      >
        {isFilled ? (
          <svg
            className={`${sizeClasses[size]} text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : isHalf ? (
          <svg
            className={`${sizeClasses[size]} text-yellow-400`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#E5E7EB" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${index})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ) : (
          <svg
            className={`${sizeClasses[size]} text-gray-300`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </div>
      {showCount && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default ReviewStars;
