import { useRef, useState, useEffect } from 'react';
import { NextLeftNavIcon, NextRightNavIcon } from '../../../assets/icons/index';
import { categoriesService } from '../../../services/user.service';
import type { Category } from '../../../types/Category';
import { useNavigation } from '../../../context/NavigationContext';

interface DropdownColumn {
  title: string;
  items: string[];
}

interface DropdownBanner {
  bg: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  image?: string;
}

interface DropdownData {
  type: string;
  title?: string;
  columns?: DropdownColumn[];
  banners?: DropdownBanner[];
}

const navbarDropdownData: Record<number, DropdownData> = {
  0: {
    type: 'multi-column',
    title: 'TẤT CẢ THƯƠNG HIỆU',
    columns: [
      {
        title: '',
        items: [
          'AHC',
          'CLIO',
          'GOODAL',
          'PERIPERA',
          'DERMATORY',
          'DEAR DAHLIA',
          'BANILA CO',
        ],
      },
    ],
    banners: [
      {
        bg: 'bg-gradient-to-br from-purple-200 to-blue-200',
        title: 'ĐỘC QUYỀN TẠI BEAUTY BOX',
        subtitle: 'KILL COVER MESH BLUR',
      },
      {
        bg: 'bg-gradient-to-br from-pink-500 to-red-500',
        title: 'SẠCH SÂU CÂN BẰNG',
        subtitle: 'Giảm mụn hiệu quả',
      },
      {
        bg: 'bg-gradient-to-br from-pink-200 to-pink-300',
        title: 'MÀ HỒNG KEM SYRUPY TOK CHEEK',
        subtitle: 'Táo lăn da căng mọng',
      },
    ],
  },
  1: {
    type: 'mega',
    title: 'KHUYẾN MÃI HOT',
    columns: [
      {
        title: '',
        items: [
          'MEGA SALE - SĂN NGAY DEAL HỜI | ÁP DỤNG WEBSITE',
          'BANILACO - MUA 1 TẶNG 4',
          'AMUSE - GIẢM ĐÉN 30%',
          'ƯU ĐÃI 50% MẶT NA SIÊU HOT',
          'SIÊU DEAL RỰC RỠ | MUA 7 TẶNG 7',
        ],
      },
    ],
    banners: [
      {
        bg: 'bg-gradient-to-br from-green-300 to-lime-400',
        title: 'EM XINH LUNG LINH',
        subtitle: 'CÙNG DEAL HOT HOT',
      },
      {
        bg: 'bg-gradient-to-br from-cyan-300 to-blue-400',
        title: 'TIỆC HỌC THẦN',
        subtitle: 'CHILL DEAL ĐỘC NHẤT',
      },
      {
        bg: 'bg-gradient-to-br from-pink-200 to-pink-300',
        title: 'RẠNG NGỜI SẮC RIÊNG',
        subtitle: 'MUA 1 TẶNG 1',
      },
    ],
  },
  3: {
    type: 'multi-column',
    columns: [
      {
        title: 'TRANG ĐIỂM MẶT',
        items: [
          'Cushion',
          'Kem Nền',
          'Phấn Phủ',
          'Che Khuyết Điểm',
          'Kem Lót',
          'Phấn Má Hồng',
          'Tạo Khối',
        ],
      },
      {
        title: 'TRANG ĐIỂM MÔI',
        items: [
          'Son Thỏi',
          'Son Kem - Tint',
          'Son Dưỡng Môi - Đặc Trị',
          'Son Bóng',
        ],
      },
      {
        title: 'TRANG ĐIỂM MẮT',
        items: ['Phấn Mắt', 'Mascara', 'Kẻ Chân Mày', 'Kẻ Mắt'],
      },
    ],
    banners: [
      {
        bg: 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100',
        title: 'BỘ SƯU TẬP TRANG ĐIỂM',
        subtitle: 'Xu hướng mới nhất',
      },
    ],
  },
  4: {
    type: 'multi-column',
    columns: [
      {
        title: 'CHĂM SÓC DA MẶT',
        items: [
          'Sữa rửa mặt',
          'Tẩy trang',
          'Toner/Nước hoa hồng',
          'Serum/Tinh chất',
          'Kem dưỡng',
          'Kem chống nắng',
          'Mặt nạ',
        ],
      },
      {
        title: 'CHĂM SÓC CHUYÊN BIỆT',
        items: [
          'Trị mụn',
          'Dưỡng trắng',
          'Chống lão hóa',
          'Thu nhỏ lỗ chân lông',
        ],
      },
    ],
    banners: [
      {
        bg: 'bg-gradient-to-br from-blue-200 to-cyan-200',
        title: 'CHĂM SÓC DA CHUYÊN SÂU',
        subtitle: 'Giải pháp hoàn hảo',
      },
    ],
  },
  6: {
    type: 'multi-column',
    columns: [
      {
        title: 'CHĂM SÓC TOÀN THÂN',
        items: [
          'Sữa tắm',
          'Dưỡng thể',
          'Tẩy tế bào chết cơ thể',
          'Kem dưỡng tay',
          'Lăn khử mùi',
          'Dụng cụ chăm sóc cơ thể',
        ],
      },
      {
        title: 'CHĂM SÓC TÓC',
        items: [
          'Dầu gội',
          'Dầu xả',
          'Dưỡng tóc',
          'Nhuộm tóc',
          'Dụng cụ chăm sóc tóc',
        ],
      },
    ],
    banners: [
      {
        bg: 'bg-gradient-to-br from-teal-200 to-green-200',
        title: 'YÊU MÃI TÓC CỦA BẠN',
        subtitle: 'Mỗi ngày với Dyson',
      },
    ],
  },
};

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigation();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [_hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [navlist, setNavlist] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true); // ← THÊM

  const handleClickCategory = (item: Category) => {
    setHoveredIndex(null);
    navigate.navigate(`/products/${item.slug}`);
  };

  const getListNav = async () => {
    try {
      console.log('🔄 Fetching categories...'); // ← DEBUG
      const res = await categoriesService.getAll();
      console.log('📊 Categories response:', res); // ← DEBUG

      if (res && res.data) {
        setNavlist(res.data);
        console.log('✅ Navlist set:', res.data.length, 'items'); // ← DEBUG
      } else {
        console.warn('⚠️ No data in response'); // ← DEBUG
      }
    } catch (err) {
      console.error('❌ Error loading categories:', err); // ← DEBUG
    } finally {
      setIsLoading(false); // ← THÊM
    }
  };

  useEffect(() => {
    getListNav();
  }, []);

  const scrollLeft = () => {
    navRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    navRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

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
    handleScroll();

    return () => {
      nav?.removeEventListener('scroll', handleScroll);
    };
  }, [navlist]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleNavItemEnter = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredIndex(index);
  };

  const handleNavItemLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  };

  // ← THÊM: Debug render
  console.log(
    '🎨 Navbar render - navlist length:',
    navlist.length,
    'isLoading:',
    isLoading,
  );

  return (
    <>
      <div className="relative w-full border-t border-b border-gray-200 bg-white">
        {/* ← THÊM border để dễ thấy */}
        <div className="relative container mx-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <span className="text-gray-500">Đang tải...</span>
            </div>
          )}

          {/* No data state */}
          {!isLoading && navlist.length === 0 && (
            <div className="flex justify-center py-4">
              <span className="text-red-500">Không có danh mục</span>
            </div>
          )}

          {/* Navbar content */}
          {!isLoading && navlist.length > 0 && (
            <>
              {showLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-500 p-1 text-white shadow-md transition hover:bg-gray-600"
                  aria-label="Scroll left"
                >
                  <NextLeftNavIcon />
                </button>
              )}

              <nav
                ref={navRef}
                className="hide-scrollbar flex flex-nowrap items-center gap-8 overflow-x-auto scroll-smooth py-3"
                style={{ minHeight: '60px' }} // ← THÊM: đảm bảo có height
              >
                {navlist.map((item, index) => {
                  const hasDropdown = navbarDropdownData[index] !== undefined;

                  return (
                    <div
                      key={item.id || index}
                      onMouseEnter={() =>
                        hasDropdown && handleNavItemEnter(index)
                      }
                      onMouseLeave={
                        hasDropdown ? handleNavItemLeave : undefined
                      }
                      className="relative shrink-0"
                    >
                      <div
                        onClick={() => handleClickCategory(item)}
                        className={`cursor-pointer rounded-lg border border-[#efefef] px-5 py-1 transition ${
                          hasDropdown ? 'hover:bg-pink-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-block whitespace-nowrap">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </nav>

              {showRight && (
                <button
                  onClick={scrollRight}
                  className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-gray-500 p-1 text-white shadow-md transition hover:bg-gray-600"
                  aria-label="Scroll right"
                >
                  <NextRightNavIcon />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
