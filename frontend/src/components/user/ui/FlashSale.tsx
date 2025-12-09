import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useAllProducts } from '../../../hooks/useProducts';
import FlashSaleLogo from '../../../assets/images/flashsale.png';

export default function FlashSale() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Load products from API
  const { products, loading } = useAllProducts();

  // Get flash sale products (you can filter based on your criteria)
  // For now, we'll take the first 8 products
  const flashSaleProducts = products.slice(0, 8);

  const navigateToProducts = () => {
    // Navigate to all products page
    window.location.href = '/products';
  };

  // Calculate countdown to midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const difference = midnight.getTime() - now.getTime();

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const visibleProducts = 4; // Show 4 products at once

  const prevProduct = () => {
    setCurrentIndex((curr) =>
      curr === 0 ? flashSaleProducts.length - 1 : curr - 1,
    );
  };

  const nextProduct = () => {
    setCurrentIndex((curr) =>
      curr === flashSaleProducts.length - 1 ? 0 : curr + 1,
    );
  };

  if (loading) {
    return (
      <div className="color-brand mt-10 rounded-3xl p-8">
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500"></div>
        </div>
      </div>
    );
  }

  if (flashSaleProducts.length === 0) {
    return null;
  }

  return (
    <div className="color-brand mt-10 rounded-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        {/* Logo Flash Sale */}
        <div className="flex items-center">
          <img src={FlashSaleLogo} alt="Flash Sale" className="h-16 w-auto" />
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex flex-col">
          <span className="mb-2 text-base font-medium text-gray-800">
            Thời gian còn lại
          </span>
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-3">
            <div className="text-center">
              <span className="text-2xl font-bold text-[#d20062]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="ml-1 text-xs font-semibold text-[#d20062]">
                NGÀY
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-[#d20062]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="ml-1 text-xs font-semibold text-[#d20062]">
                GIỜ
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-[#d20062]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="ml-1 text-xs font-semibold text-[#d20062]">
                PHÚT
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-[#d20062]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="ml-1 text-xs font-semibold text-[#d20062]">
                GIÂY
              </span>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <button
          onClick={navigateToProducts}
          className="rounded-xl border-2 border-white bg-white px-8 py-3 font-semibold text-[#d20062] transition-all hover:bg-pink-50"
        >
          Xem tất cả
        </button>
      </div>

      {/* Products Carousel */}
      <div className="relative">
        <button
          onClick={prevProduct}
          className="absolute top-1/2 -left-6 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 transition hover:bg-gray-50"
        >
          <ChevronLeft size={28} className="text-gray-800" />
        </button>

        <div className="overflow-hidden rounded-2xl px-4">
          <div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
            }}
          >
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="w-1/4 flex-shrink-0">
                <ProductCard
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brandName={product.brandName}
                  categoryName={product.categoryName}
                  images={product.images}
                  freeShip={product.freeShip}
                  badge={product.badge}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={nextProduct}
          className="absolute top-1/2 -right-6 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 transition hover:bg-gray-50"
        >
          <ChevronRight size={28} className="text-gray-800" />
        </button>
      </div>
    </div>
  );
}
