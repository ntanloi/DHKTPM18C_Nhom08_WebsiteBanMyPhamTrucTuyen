import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import brand images
import TheFaceShop from '../../assets/images/TheFaceShop.png';
import Ahc from '../../assets/images/ahc.png';
import Amuse from '../../assets/images/amuse.png';
import DearDahilia from '../../assets/images/deardahilia.png';
import Clio from '../../assets/images/clio.png';
import Freshian from '../../assets/images/freshian.png';
import Goodal from '../../assets/images/goodal.png';
import Glint from '../../assets/images/glint.png';
import Klavuu from '../../assets/images/klavuu.png';
import Thewhoo from '../../assets/images/thewhoo.png';
import Sum37 from '../../assets/images/sum37.png';
import Ohui from '../../assets/images/ohui.png';
import Payot from '../../assets/images/payot.png';
import Cnp from '../../assets/images/cnp.png';
import Beyond from '../../assets/images/beyond.png';
import Avene from '../../assets/images/avene.png';
import Elixir from '../../assets/images/elixir.png';
import PaulaChoice from '../../assets/images/paulachoice.png';
import Laroche from '../../assets/images/laroche.png';
import Cocoon from '../../assets/images/cocoon.png';
import Obagi from '../../assets/images/obagi.png';
import Miseen from '../../assets/images/miseen.png';
import Ofelia from '../../assets/images/ofelia.png';
import Bioderma from '../../assets/images/bioderma.png';
import Aestura from '../../assets/images/aestura.png';
import Stylenada from '../../assets/images/stylenada.png';
import Skinfood from '../../assets/images/skinfood.png';

export default function AllBrandSlide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Danh sách 27 brands
  const brands = [
    { id: 1, name: 'The Face Shop', image: TheFaceShop },
    { id: 2, name: 'AHC', image: Ahc },
    { id: 3, name: 'Amuse', image: Amuse },
    { id: 4, name: 'Dear Dahlia', image: DearDahilia },
    { id: 5, name: 'Clio', image: Clio },
    { id: 6, name: 'Freshian', image: Freshian },
    { id: 7, name: 'Goodal', image: Goodal },
    { id: 8, name: 'Glint', image: Glint },
    { id: 9, name: 'Klavuu', image: Klavuu },
    { id: 10, name: 'The Whoo', image: Thewhoo },
    { id: 11, name: 'Su:m37', image: Sum37 },
    { id: 12, name: 'Ohui', image: Ohui },
    { id: 13, name: 'Payot', image: Payot },
    { id: 14, name: 'CNP', image: Cnp },
    { id: 15, name: 'Beyond', image: Beyond },
    { id: 16, name: 'Avene', image: Avene },
    { id: 17, name: 'Elixir', image: Elixir },
    { id: 18, name: 'Paula', image: PaulaChoice },
    { id: 19, name: 'La Roche-Posay', image: Laroche },
    { id: 20, name: 'Cocoon', image: Cocoon },
    { id: 21, name: 'Obagi', image: Obagi },
    { id: 22, name: 'Mise En Scène', image: Miseen },
    { id: 23, name: 'Ofelia', image: Ofelia },
    { id: 24, name: 'Bioderma', image: Bioderma },
    { id: 25, name: 'Aestura', image: Aestura },
    { id: 26, name: '3CE Stylenanda', image: Stylenada },
    { id: 27, name: 'Skinfood', image: Skinfood },
  ];

  // Tạo mảng với items duplicate ở đầu và cuối để tạo hiệu ứng infinite
  const itemsToShow = 6;
  const duplicatedBrands = [
    ...brands.slice(-itemsToShow), // Clone 6 items cuối
    ...brands,
    ...brands.slice(0, itemsToShow), // Clone 6 items đầu
  ];

  const prevBrand = () => {
    if (!isTransitioning) return;
    setCurrentIndex((curr) => curr - 2);
  };

  const nextBrand = () => {
    if (!isTransitioning) return;
    setCurrentIndex((curr) => curr + 2);
  };

  // Reset position khi đến điểm duplicate
  useEffect(() => {
    if (currentIndex <= -2) {
      // Đã scroll qua bên trái
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(brands.length - 2);
      }, 500);
    } else if (currentIndex >= brands.length) {
      // Đã scroll qua bên phải
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentIndex, brands.length]);

  // Bật lại transition sau khi reset
  useEffect(() => {
    if (!isTransitioning) {
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  }, [isTransitioning]);

  const brandWidth = 100 / itemsToShow;
  const translateValue = (currentIndex + itemsToShow) * brandWidth;

  return (
    <div className="relative mt-10 h-[100px] w-full overflow-hidden">
      {/* Nút Previous */}
      <button
        onClick={prevBrand}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/60 p-3 transition hover:bg-white/80"
      >
        <ChevronLeft size={28} className="text-gray-800" />
      </button>

      {/* Carousel Container */}
      <div className="h-full overflow-hidden rounded-xl">
        <div
          className="flex h-full gap-4"
          style={{
            transform: `translateX(-${translateValue}%)`,
            transition: isTransitioning
              ? 'transform 500ms ease-in-out'
              : 'none',
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="h-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ width: `calc(${brandWidth}% - 16px)` }}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Nút Next */}
      <button
        onClick={nextBrand}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/60 p-3 transition hover:bg-white/80"
      >
        <ChevronRight size={28} className="text-gray-800" />
      </button>
    </div>
  );
}
