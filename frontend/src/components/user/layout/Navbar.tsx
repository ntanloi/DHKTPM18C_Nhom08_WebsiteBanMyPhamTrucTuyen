import { useRef, useState, useEffect } from 'react';
import { NextLeftNavIcon, NextRightNavIcon } from '../../../assets/icons';

const navlist = [
  'Thương hiệu',
  'Khuyến mãi hot',
  'Sản phẩm cao cấp',
  'Trang điểm',
  'Chăm sóc da',
  'Chăm sóc cá nhân',
  'Chăm sóc cơ thể',
  'Sản phẩm mới',
  'Dưỡng tóc',
  'Sữa tắm',
  'Nước hoa',
  'Phụ kiện làm đẹp',
  'Thực phẩm chức năng',
  'Chăm sóc răng miệng',
];

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Hàm cuộn trái/phải
  const scrollLeft = () => {
    navRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    navRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Theo dõi vị trí cuộn
  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;

      const { scrollLeft, scrollWidth, clientWidth } = nav;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    };

    const nav = navRef.current;
    nav?.addEventListener('scroll', handleScroll);
    handleScroll(); // chạy lần đầu khi mount

    return () => {
      nav?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative w-screen">
      {/* Nút trái */}
      {showLeft && (
        <span
          onClick={scrollLeft}
          className="absolute top-1/2 left-7 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-500 p-1 text-white shadow-md transition hover:bg-gray-600"
        >
          <NextLeftNavIcon />
        </span>
      )}

      {/* Thanh nav */}
      <nav
        ref={navRef}
        className="hide-scrollbar container flex flex-nowrap items-center gap-8 overflow-x-auto scroll-smooth"
      >
        {navlist.map((item, index) => (
          <div
            key={index}
            className="shrink-0 cursor-pointer rounded-lg border border-[#efefef] px-5 py-1 transition hover:bg-pink-100"
          >
            <span className="inline-block whitespace-nowrap">{item}</span>
          </div>
        ))}
      </nav>

      {/* Nút phải */}
      {showRight && (
        <span
          onClick={scrollRight}
          className="absolute top-1/2 right-7 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-500 p-1 text-white shadow-md transition hover:bg-gray-600"
        >
          <NextRightNavIcon />
        </span>
      )}
    </div>
  );
}
