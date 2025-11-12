import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import LuongVe from '../assets/images/luongve.png';
import DocQuyen99 from '../assets/images/docquyen99.png';
import RangRo7Nam from '../assets/images/rangro7nam.png';
import Clio from '../assets/images/bannerClio.jpg';
import SachSau from '../assets/images/sachsau.png';
import LungLinh from '../assets/images/lunglinh.png';
import Banilaco from '../assets/images/banilaco.png';
import BestSeller50 from '../assets/images/bestseller50.png';

export default function HomePage() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  const images = [LuongVe, DocQuyen99, RangRo7Nam, Clio, SachSau, LungLinh];
  const products = Array(17).fill(null);
  const itemsPerPage = 4;

  const totalProductPages = Math.ceil(products.length / itemsPerPage);

  const prevBanner = () =>
    setBannerIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  const nextBanner = () =>
    setBannerIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1));

  const prevProduct = () =>
    setProductIndex((curr) => (curr === 0 ? totalProductPages - 1 : curr - 1));
  const nextProduct = () =>
    setProductIndex((curr) => (curr === totalProductPages - 1 ? 0 : curr + 1));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-4">
        <div className="relative h-90 w-2/3 overflow-hidden rounded-xl bg-gray-100">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={index} className="h-full w-full shrink-0">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="h-90 w-full object-fill"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prevBanner}
            className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-gray-800 transition hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextBanner}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 text-gray-800 transition hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setBannerIndex(index)}
                className={`h-2 w-2 rounded-full transition ${
                  bannerIndex === index ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex h-90 w-1/3 flex-col gap-4">
          <div className="h-45 overflow-hidden rounded-xl shadow-lg">
            <img
              src={DocQuyen99}
              alt="Độc quyền 99"
              className="h-full w-full object-fill"
            />
          </div>
          <div className="h-45 overflow-hidden rounded-xl shadow-lg">
            <img
              src={RangRo7Nam}
              alt="Rạng rỡ 7 năm"
              className="h-full w-full object-fill"
            />
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-wide uppercase">
          TOP SẢN PHẨM BÁN CHẠY
        </h1>

        <div className="relative">
          <button
            onClick={prevProduct}
            className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
          >
            <ChevronLeft size={28} className="text-gray-800" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${productIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalProductPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="flex w-full flex-shrink-0 gap-4 px-2"
                >
                  {products
                    .slice(
                      pageIndex * itemsPerPage,
                      (pageIndex + 1) * itemsPerPage,
                    )
                    .map((_, index) => (
                      <div key={index} className="w-1/4">
                        <ProductCard />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextProduct}
            className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
          >
            <ChevronRight size={28} className="text-gray-800" />
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all duration-300 hover:border-[#c0595c] hover:text-[#c0595c]">
            Xem tất aHUHIUAHIU cả
          </button>
        </div>
      </div>
    </div>
  );
}
