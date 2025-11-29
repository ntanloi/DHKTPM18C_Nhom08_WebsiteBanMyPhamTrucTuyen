import React, { useState } from 'react';
import type { ReviewImageResponse } from '../../../api/reviewImage';

interface ReviewImageGalleryProps {
  images: ReviewImageResponse[];
  onImageClick?: (imageUrl: string, index: number) => void;
}

const ReviewImageGallery: React.FC<ReviewImageGalleryProps> = ({
  images,
  onImageClick,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    if (onImageClick) {
      onImageClick(images[index].imageUrl, index);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const displayImages = images.slice(0, 4);
  const remainingCount = images.length - 4;

  return (
    <>
      <div className="flex gap-2">
        {displayImages.map((image, index) => (
          <div
            key={image.id}
            className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-pink-400"
            onClick={() => handleImageClick(index)}
          >
            <img
              src={image.imageUrl}
              alt={`Review image ${index + 1}`}
              className="h-full w-full object-cover transition-transform hover:scale-110"
            />
            {index === 3 && remainingCount > 0 && (
              <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-white">
                <span className="text-sm font-bold">+{remainingCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex].imageUrl}
              alt={`Review image ${currentIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white p-2 text-gray-800 hover:bg-gray-200"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <div className="bg-opacity-60 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewImageGallery;
