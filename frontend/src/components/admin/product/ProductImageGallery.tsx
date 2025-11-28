import React, { useState, useEffect } from 'react';
import {
  getProductImagesByProductId,
  type ProductImageResponse,
} from '../../../api/productImage';

interface ProductImageGalleryProps {
  productId: number;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productId,
}) => {
  const [images, setImages] = useState<ProductImageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [productId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getProductImagesByProductId(productId);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load images:', err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100">
        <div className="text-gray-500">Đang tải hình ảnh...</div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
        <svg
          className="h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleMainImageClick = () => {
    setShowLightbox(true);
  };

  return (
    <div className="w-full">
      <div className="group relative mb-4 aspect-square w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
        <img
          src={currentImage.imageUrl}
          alt={`Product image ${currentImageIndex + 1}`}
          className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-105"
          onClick={handleMainImageClick}
        />

        <div className="bg-opacity-0 group-hover:bg-opacity-10 absolute inset-0 flex items-center justify-center bg-black transition-all duration-300">
          <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="rounded-full bg-white p-3 shadow-lg">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="bg-opacity-80 hover:bg-opacity-100 absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all"
            >
              <svg
                className="h-5 w-5 text-gray-800"
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
              className="bg-opacity-80 hover:bg-opacity-100 absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all"
            >
              <svg
                className="h-5 w-5 text-gray-800"
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

        {images.length > 1 && (
          <div className="bg-opacity-60 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-pink-500 ring-2 ring-pink-200'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {showLightbox && (
        <div
          className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white transition-colors hover:text-gray-300"
          >
            <svg
              className="h-8 w-8"
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

          <div className="relative max-h-[90vh] max-w-5xl">
            <img
              src={currentImage.imageUrl}
              alt="Full size"
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  className="bg-opacity-20 hover:bg-opacity-30 absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white p-3 transition-all"
                >
                  <svg
                    className="h-6 w-6 text-white"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="bg-opacity-20 hover:bg-opacity-30 absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white p-3 transition-all"
                >
                  <svg
                    className="h-6 w-6 text-white"
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

                <div className="bg-opacity-60 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-sm text-white">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
