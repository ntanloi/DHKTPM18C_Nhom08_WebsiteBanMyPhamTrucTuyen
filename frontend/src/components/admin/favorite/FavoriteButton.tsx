import React, { useState } from 'react';

interface FavoriteButtonProps {
  productId: number;
  isFavorited: boolean;
  onToggle: (productId: number, isFavorited: boolean) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  isFavorited,
  onToggle,
  size = 'md',
  showLabel = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      await onToggle(productId, isFavorited);
      setTimeout(() => setIsAnimating(false), 300);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setIsAnimating(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={` ${sizeClasses[size]} flex items-center justify-center rounded-full ${isFavorited ? 'bg-pink-100 text-pink-600' : 'bg-white text-gray-400'} border-2 ${isFavorited ? 'border-pink-300' : 'border-gray-300'} transition-all duration-200 hover:scale-110 hover:shadow-lg ${isLoading ? 'cursor-wait opacity-50' : 'cursor-pointer'} ${isAnimating ? 'animate-bounce' : ''} `}
      title={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    >
      {isLoading ? (
        <svg
          className={`${iconSizes[size]} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className={`${iconSizes[size]} transition-transform ${isAnimating ? 'scale-125' : ''}`}
          fill={isFavorited ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isFavorited ? 0 : 2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}

      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isFavorited ? 'Đã thích' : 'Yêu thích'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
