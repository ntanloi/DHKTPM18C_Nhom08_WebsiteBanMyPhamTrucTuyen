import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProductCard from '../../components/user/ui/ProductCard';
import { useAllProducts } from '../../hooks/useProducts';

import LuongVe from '../../assets/images/luongve.png';
import DocQuyen99 from '../../assets/images/docquyen99.png';
import RangRo7Nam from '../../assets/images/rangro7nam.png';
import Clio from '../../assets/images/bannerClio.jpg';
import SachSau from '../../assets/images/sachsau.png';
import LungLinh from '../../assets/images/lunglinh.png';
import Gif1 from '../../assets/images/gif6.gif';

import AllBrandSlide from '../../components/user/ui/AllBrandSlide';
import FlashSale from '../../components/user/ui/FlashSale';
import MagazineSection from '../../components/user/ui/MagazineSection';

import Anh1 from '../../assets/images/anh1.png';
import Anh2 from '../../assets/images/anh2.png';
import Anh3 from '../../assets/images/anh3.png';

import TimKiem1 from '../../assets/images/search1.png';
import TimKiem2 from '../../assets/images/search2.png';
import TimKiem3 from '../../assets/images/search3.png';
import TimKiem4 from '../../assets/images/search4.png';

export default function HomePage() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bestSellingIndex, setBestSellingIndex] = useState(0);
  const [newProductIndex, setNewProductIndex] = useState(0);
  const [trendIndex, setTrendIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('skincare');

  // Load products from API
  const { products, loading } = useAllProducts();

  // Filter products by category for different sections
  // You can customize these filters based on your actual data structure
  const bestSellingProducts = products.slice(0, 12); // First 12 products as best selling
  const newProducts = products.slice(12, 24); // Next 12 as new products

  // Filter by category name for skincare and makeup
  const skincareProducts = products
    .filter(
      (p) =>
        p.categoryName?.toLowerCase().includes('dưỡng') ||
        p.categoryName?.toLowerCase().includes('skincare') ||
        p.categoryName?.toLowerCase().includes('chăm sóc'),
    )
    .slice(0, 12);

  const makeupProducts = products
    .filter(
      (p) =>
        p.categoryName?.toLowerCase().includes('trang điểm') ||
        p.categoryName?.toLowerCase().includes('makeup') ||
        p.categoryName?.toLowerCase().includes('son') ||
        p.categoryName?.toLowerCase().includes('phấn'),
    )
    .slice(0, 12);

  const navigateToProducts = (category: string) => {
    window.history.pushState({}, '', `/products/${category}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const images = [LuongVe, DocQuyen99, RangRo7Nam, Clio, SachSau, LungLinh];
  const itemsPerPage = 4;

  const totalBestSellingPages = Math.ceil(
    bestSellingProducts.length / itemsPerPage,
  );
  const totalNewProductPages = Math.ceil(newProducts.length / itemsPerPage);

  const displayProducts =
    activeTab === 'skincare' ? skincareProducts : makeupProducts;
  const totalTrendPages = Math.ceil(displayProducts.length / itemsPerPage);

  const prevBanner = () =>
    setBannerIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  const nextBanner = () =>
    setBannerIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1));

  const prevBestSelling = () =>
    setBestSellingIndex((curr) =>
      curr === 0 ? totalBestSellingPages - 1 : curr - 1,
    );
  const nextBestSelling = () =>
    setBestSellingIndex((curr) =>
      curr === totalBestSellingPages - 1 ? 0 : curr + 1,
    );

  const prevNewProduct = () =>
    setNewProductIndex((curr) =>
      curr === 0 ? totalNewProductPages - 1 : curr - 1,
    );
  const nextNewProduct = () =>
    setNewProductIndex((curr) =>
      curr === totalNewProductPages - 1 ? 0 : curr + 1,
    );

  const prevTrend = () =>
    setTrendIndex((curr) => (curr === 0 ? totalTrendPages - 1 : curr - 1));
  const nextTrend = () =>
    setTrendIndex((curr) => (curr === totalTrendPages - 1 ? 0 : curr + 1));

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Banner Section */}
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

      {/* Top Sản Phẩm Bán Chạy */}
      {bestSellingProducts.length > 0 && (
        <div className="relative mt-10">
          <h1 className="mb-6 text-center text-2xl font-bold tracking-wide uppercase">
            TOP SẢN PHẨM BÁN CHẠY
          </h1>

          <div className="relative">
            <button
              onClick={prevBestSelling}
              className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
            >
              <ChevronLeft size={28} className="text-gray-800" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${bestSellingIndex * 100}%)`,
                }}
              >
                {Array.from({ length: totalBestSellingPages }).map(
                  (_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="flex w-full flex-shrink-0 gap-4 px-2"
                    >
                      {bestSellingProducts
                        .slice(
                          pageIndex * itemsPerPage,
                          (pageIndex + 1) * itemsPerPage,
                        )
                        .map((product) => (
                          <div key={product.id} className="w-1/4">
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
                  ),
                )}
              </div>
            </div>

            <button
              onClick={nextBestSelling}
              className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
            >
              <ChevronRight size={28} className="text-gray-800" />
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigateToProducts('best-selling')}
              className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all duration-300 hover:border-[#c0595c] hover:text-[#c0595c]"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      )}

      {/* GIF Section */}
      <div className="mt-10">
        <img
          src={Gif1}
          alt="GIF quảng cáo"
          className="w-full rounded-xl object-contain"
        />
      </div>

      {/* All Brand Slide */}
      <div className="container mx-auto mt-10">
        <AllBrandSlide />
      </div>

      {/* Flash Sale */}
      <div className="mt-10 mb-10">
        <FlashSale />
      </div>

      {/* 3 Images */}
      <div className="flex gap-1">
        <img className="w-1/3 rounded-xl" src={Anh1} alt="" />
        <img className="w-1/3 rounded-xl" src={Anh2} alt="" />
        <img className="w-1/3 rounded-xl" src={Anh3} alt="" />
      </div>

      {/* Phần Xu hướng làm đẹp */}
      {(skincareProducts.length > 0 || makeupProducts.length > 0) && (
        <div className="mt-16 mb-16">
          <h1 className="mb-6 text-center text-3xl font-bold tracking-wider uppercase">
            XU HƯỚNG LÀM ĐẸP
          </h1>

          {/* Tabs */}
          <div className="mb-10 flex justify-center gap-12 border-gray-200">
            <button
              onClick={() => {
                setActiveTab('skincare');
                setTrendIndex(0);
              }}
              className={`pb-3 text-lg font-semibold transition-all ${
                activeTab === 'skincare'
                  ? 'border-b-3 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={
                activeTab === 'skincare'
                  ? { borderBottomWidth: '3px', borderBottomColor: '#000' }
                  : {}
              }
            >
              Dưỡng da
            </button>
            <button
              onClick={() => {
                setActiveTab('makeup');
                setTrendIndex(0);
              }}
              className={`pb-3 text-lg font-semibold transition-all ${
                activeTab === 'makeup'
                  ? 'border-b-3 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={
                activeTab === 'makeup'
                  ? { borderBottomWidth: '3px', borderBottomColor: '#000' }
                  : {}
              }
            >
              Trang điểm
            </button>
          </div>

          {/* Products Slider */}
          {displayProducts.length > 0 && (
            <div className="relative">
              <button
                onClick={prevTrend}
                className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
              >
                <ChevronLeft size={28} className="text-gray-800" />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${trendIndex * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalTrendPages }).map(
                    (_, pageIndex) => (
                      <div
                        key={pageIndex}
                        className="flex w-full flex-shrink-0 gap-4 px-2"
                      >
                        {displayProducts
                          .slice(
                            pageIndex * itemsPerPage,
                            (pageIndex + 1) * itemsPerPage,
                          )
                          .map((product) => (
                            <div
                              key={`${activeTab}-${product.id}`}
                              className="w-1/4"
                            >
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
                    ),
                  )}
                </div>
              </div>

              <button
                onClick={nextTrend}
                className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
              >
                <ChevronRight size={28} className="text-gray-800" />
              </button>
            </div>
          )}

          {/* Nút Xem tất cả */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigateToProducts(activeTab)}
              className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all duration-300 hover:border-[#c0595c] hover:text-[#c0595c]"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      )}

      {/* Sản phẩm mới */}
      {newProducts.length > 0 && (
        <div className="relative mt-10">
          <h1 className="mb-6 text-center text-2xl font-bold tracking-wide uppercase">
            Sản Phẩm Mới
          </h1>

          <div className="relative">
            <button
              onClick={prevNewProduct}
              className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
            >
              <ChevronLeft size={28} className="text-gray-800" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${newProductIndex * 100}%)`,
                }}
              >
                {Array.from({ length: totalNewProductPages }).map(
                  (_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="flex w-full flex-shrink-0 gap-4 px-2"
                    >
                      {newProducts
                        .slice(
                          pageIndex * itemsPerPage,
                          (pageIndex + 1) * itemsPerPage,
                        )
                        .map((product) => (
                          <div key={product.id} className="w-1/4">
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
                  ),
                )}
              </div>
            </div>

            <button
              onClick={nextNewProduct}
              className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
            >
              <ChevronRight size={28} className="text-gray-800" />
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigateToProducts('new')}
              className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all duration-300 hover:border-[#c0595c] hover:text-[#c0595c]"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      )}

      {/* Tìm kiếm nhiều nhất */}
      <div className="mt-16 mb-10">
        <h1 className="mb-8 text-center text-2xl font-bold tracking-wide uppercase">
          TÌM KIẾM NHIỀU NHẤT
        </h1>

        {/* Search Tags */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {[
            'son peripera',
            'toner pad',
            'cushion clio',
            'lipcerin',
            'pad',
            'mặt nạ',
            'sữa rửa mặt',
          ].map((tag, index) => (
            <button
              key={index}
              className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-black hover:text-white"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 4 Banner Images */}
        <div className="grid grid-cols-4 gap-4">
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={TimKiem1}
              alt="Banner 1"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={TimKiem2}
              alt="Banner 2"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={TimKiem3}
              alt="Banner 3"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={TimKiem4}
              alt="Banner 4"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* BeautyBox Magazine */}
      <div className="container">
        <MagazineSection />
      </div>
    </div>
  );
}
