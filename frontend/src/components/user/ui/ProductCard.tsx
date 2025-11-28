import { useState, useEffect } from 'react';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';

import skincareImage1 from '../../../assets/images/skin1.png';
import skincareImage2 from '../../../assets/images/skin2.png';
import skincareImage3 from '../../../assets/images/skin3.png';
import skincareImage4 from '../../../assets/images/skin4.png';
import skincareImage5 from '../../../assets/images/skin5.png';
import skincareImage6 from '../../../assets/images/skin6.png';
import skincareImage7 from '../../../assets/images/skin7.png';
import skincareImage8 from '../../../assets/images/skin8.png';
import skincareImage9 from '../../../assets/images/skin9.png';
import skincareImage10 from '../../../assets/images/skin10.png';
import skincareImage11 from '../../../assets/images/skin11.png';
import skincareImage12 from '../../../assets/images/skin12.png';
import skincareImage13 from '../../../assets/images/skin13.png';
import skincareImage14 from '../../../assets/images/skin14.png';
import skincareImage15 from '../../../assets/images/skin15.png';
import skincareImage16 from '../../../assets/images/skin16.png';
import skincareImage17 from '../../../assets/images/skin17.png';
import skincareImage18 from '../../../assets/images/skin18.png';
import skincareImage19 from '../../../assets/images/skin19.png';
import skincareImage20 from '../../../assets/images/skin20.png';

import makeupImage1 from '../../../assets/images/make1.png';
import makeupImage2 from '../../../assets/images/make2.png';
import makeupImage3 from '../../../assets/images/make3.png';
import makeupImage4 from '../../../assets/images/make4.png';
import makeupImage5 from '../../../assets/images/make5.png';
import makeupImage6 from '../../../assets/images/make6.png';
import makeupImage7 from '../../../assets/images/make7.png';
import makeupImage8 from '../../../assets/images/make8.png';
import makeupImage9 from '../../../assets/images/make9.png';
import makeupImage10 from '../../../assets/images/make10.png';
import makeupImage11 from '../../../assets/images/make11.png';
import makeupImage12 from '../../../assets/images/make12.png';
import makeupImage13 from '../../../assets/images/make13.png';
import makeupImage14 from '../../../assets/images/make14.png';
import makeupImage15 from '../../../assets/images/make15.png';
import makeupImage16 from '../../../assets/images/make16.png';
import makeupImage17 from '../../../assets/images/make17.png';
import makeupImage18 from '../../../assets/images/make18.png';
import makeupImage19 from '../../../assets/images/make19.png';
import makeupImage20 from '../../../assets/images/make20.png';

const QuickViewModal = ({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('home');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', margin: 0 }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left side - Image gallery */}
          <div className="relative w-full bg-pink-50 md:w-1/2">
            <div className="relative aspect-square">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {product.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-black'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="w-full p-6 md:w-1/2">
            <div className="mb-2 text-sm font-bold text-red-500">
              {product.brand}
            </div>

            <h2 className="mb-3 text-xl font-bold text-gray-900">
              {product.name}
            </h2>

            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={
                      index < product.rating ? 'text-black' : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount})</span>
              <span className="text-gray-600">• Xuất xứ: Hàn Quốc</span>
              <span className="text-gray-600">• SKU: 11112238</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {product.price}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                  {product.discount && (
                    <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
                      {product.discount}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-sm font-semibold">
                  Color: {selectedColor + 1}. Oat Fig - hồng đất
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        selectedColor === index
                          ? 'scale-110 border-gray-800'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Delivery method */}
            <div className="mb-4 rounded-lg border border-gray-300 p-4">
              <div className="mb-3 font-semibold">Hình thức mua hàng</div>

              <label className="mb-2 flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="delivery"
                  value="home"
                  checked={deliveryMethod === 'home'}
                  onChange={() => setDeliveryMethod('home')}
                  className="mr-2"
                />
                <span>Giao hàng</span>
              </label>

              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="mr-2"
                />
                <span>
                  Click & Collect Mua và lấy hàng tại cửa hàng{' '}
                  <span className="text-blue-600 underline">Chọn cửa hàng</span>
                </span>
              </label>

              <div className="mt-3 flex items-center text-sm text-gray-600">
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>24 / 26 chi nhánh còn mặt hàng này</span>
                <button className="ml-auto text-blue-600 underline">
                  Xem tất cả các cửa hàng ›
                </button>
              </div>
            </div>

            {/* Quantity and Add to cart */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button className="flex min-w-[150px] flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Thêm vào giỏ
              </button>

              <button className="rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white hover:shadow-lg">
                MUA NGAY
              </button>

              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
                <Heart size={20} />
              </button>
            </div>

            <button className="w-full text-sm text-gray-600 underline">
              Xem chi tiết sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use Portal to render modal at document.body level
  return createPortal(modalContent, document.body);
};

// ==================== SẢN PHẨM BÁN CHẠY ====================
// ==================== SẢN PHẨM BÁN CHẠY ====================
export const bestSellingProducts = [
  {
    id: 'dermatory-mask-001',
    images: [skincareImage3, skincareImage4],
    brand: 'DERMATORY',
    category: 'Mặt Nạ',
    name: '[Mua 5 tặng 5] Mặt Na Cấp Ẩm Dermatory Pro Hyal Shot Moisture',
    price: '260.000đ',
    oldPrice: '520.000đ',
    discount: '-50%',
    rating: 0,
    reviewCount: 0,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'goodal-cream-001',
    images: [skincareImage5, skincareImage6],
    brand: 'CLUB CLIO',
    category: 'Kem Dưỡng',
    name: 'Kem Dưỡng Goodal Làm Sáng Da Green Tangerine Vita C Dark Spot',
    price: '649.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 43,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'amuse-palette-001',
    images: [makeupImage1, makeupImage2],
    brand: 'AMUSE',
    category: 'Bảng Phấn Mắt 9 Ô Thuần Chay',
    name: 'Amuse Eye Color Palette 11g',
    price: '639.000đ',
    oldPrice: '659.000đ',
    discount: '-3%',
    rating: 5,
    reviewCount: 5,
    colors: ['#E8B4B8', '#C9A5A0', '#F5D5D5', '#D4A5A5', '#F0C5C5'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'amuse-tint-001',
    images: [makeupImage3, makeupImage4],
    brand: 'AMUSE',
    category: 'Son Môi',
    name: 'Son Thạch Bóng Thuần Chay Amuse Jel-Fit Tint 3.8g',
    price: '329.000đ',
    oldPrice: '399.000đ',
    discount: '-18%',
    rating: 4,
    reviewCount: 34,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'banilaco-toner-001',
    images: [makeupImage19, makeupImage20],
    brand: 'BANILA CO',
    category: 'Toner Pad',
    name: 'Toner Pad Cấp Ẩm Banila Co Clean It Zero Pink Hydration Toner Pad',
    price: '502.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 2,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
];

// ==================== SẢN PHẨM FLASH SALE ====================
export const flashSaleProducts = [
  {
    id: 'loreal-sunscreen-001',
    images: [skincareImage1, skincareImage2],
    brand: "L'OREAL PARIS",
    category: 'Kem Chống Nắng',
    name: "Kem Chống Nắng L'Oreal Paris Ngừa Lão Hóa Sâm UV Defender Serum",
    price: '399.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 0,
    reviewCount: 0,
    colors: undefined,
    freeShip: false,
    badge: undefined,
  },
  {
    id: 'dermatory-mask-002',
    images: [skincareImage3, skincareImage4],
    brand: 'DERMATORY',
    category: 'Mặt Nạ',
    name: '[Mua 5 tặng 5] Mặt Na Cấp Ẩm Dermatory Pro Hyal Shot Moisture',
    price: '260.000đ',
    oldPrice: '520.000đ',
    discount: '-50%',
    rating: 0,
    reviewCount: 0,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'goodal-cream-002',
    images: [skincareImage5, skincareImage6],
    brand: 'CLUB CLIO',
    category: 'Kem Dưỡng',
    name: 'Kem Dưỡng Goodal Làm Sáng Da Green Tangerine Vita C Dark Spot',
    price: '649.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 43,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-cushion-001',
    images: [makeupImage11, makeupImage12],
    brand: 'CLIO',
    category: 'Phấn Nước',
    name: 'Phấn Nước Clio Mỏng Nhẹ & Che Khuyết Điểm Hoàn Hảo Kill Cover Founwear Cushion The Original',
    price: '565.000đ',
    oldPrice: '729.000đ',
    discount: '-22%',
    rating: 4,
    reviewCount: 40,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-foundation-001',
    images: [makeupImage13, makeupImage14],
    brand: 'CLIO',
    category: 'Kem Nền',
    name: 'Kem Nền Che Khuyết Điểm Clio Kill Cover Founwear Foundation The Original',
    price: '545.000đ',
    oldPrice: '699.000đ',
    discount: '-22%',
    rating: 1,
    reviewCount: 18,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-cushion-hp-001',
    images: [makeupImage15, makeupImage16],
    brand: 'CLIO',
    category: 'Phấn Nước Harry Potter',
    name: '[Phiên bản Harry Potter] Phấn Clio Mỏng Nhẹ & Che Khuyết Điểm',
    price: '565.000đ',
    oldPrice: '729.000đ',
    discount: '-22%',
    rating: 1,
    reviewCount: 7,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
];

// ==================== SẢN PHẨM MỚI ====================
export const newProducts = [
  {
    id: 'amuse-tint-002',
    images: [makeupImage3, makeupImage4],
    brand: 'AMUSE',
    category: 'Son Môi',
    name: 'Son Thạch Bóng Thuần Chay Amuse Jel-Fit Tint 3.8g',
    price: '329.000đ',
    oldPrice: '399.000đ',
    discount: '-18%',
    rating: 4,
    reviewCount: 34,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'amuse-palette-002',
    images: [makeupImage5, makeupImage6],
    brand: 'AMUSE',
    category: 'Phấn Mắt',
    name: 'Bảng Phấn Mắt 9 Ô Thuần Chay Amuse Eye Color Palette 11g',
    price: '593.100đ',
    oldPrice: '659.000đ',
    discount: '-10%',
    rating: 4,
    reviewCount: 5,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-cushion-002',
    images: [makeupImage11, makeupImage12],
    brand: 'CLIO',
    category: 'Phấn Nước',
    name: 'Phấn Nước Clio Mỏng Nhẹ & Che Khuyết Điểm Hoàn Hảo Kill Cover Founwear Cushion',
    price: '565.000đ',
    oldPrice: '729.000đ',
    discount: '-22%',
    rating: 4,
    reviewCount: 40,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-foundation-002',
    images: [makeupImage13, makeupImage14],
    brand: 'CLIO',
    category: 'Kem Nền',
    name: 'Kem Nền Che Khuyết Điểm Clio Kill Cover Founwear Foundation',
    price: '545.000đ',
    oldPrice: '699.000đ',
    discount: '-22%',
    rating: 1,
    reviewCount: 18,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-cushion-hp-002',
    images: [makeupImage15, makeupImage16],
    brand: 'CLIO',
    category: 'Phấn Nước Harry Potter',
    name: '[Phiên bản Harry Potter] Phấn Clio Mỏng Nhẹ & Che Khuyết Điểm',
    price: '565.000đ',
    oldPrice: '729.000đ',
    discount: '-22%',
    rating: 1,
    reviewCount: 7,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
];

// ==================== XU HƯỚNG - DƯỠNG DA ====================
export const skincareProducts = [
  {
    id: 'loreal-sunscreen-002',
    images: [skincareImage1, skincareImage2],
    brand: "L'OREAL PARIS",
    category: 'Kem Chống Nắng',
    name: "Kem Chống Nắng L'Oreal Paris Ngừa Lão Hóa Sâm UV Defender Serum",
    price: '399.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 0,
    reviewCount: 0,
    colors: undefined,
    freeShip: false,
    badge: undefined,
  },
  {
    id: 'dermatory-mask-003',
    images: [skincareImage3, skincareImage4],
    brand: 'DERMATORY',
    category: 'Mặt Nạ',
    name: '[Mua 5 tặng 5] Mặt Na Cấp Ẩm Dermatory Pro Hyal Shot Moisture',
    price: '260.000đ',
    oldPrice: '520.000đ',
    discount: '-50%',
    rating: 0,
    reviewCount: 0,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'goodal-cream-003',
    images: [skincareImage5, skincareImage6],
    brand: 'CLUB CLIO',
    category: 'Kem Dưỡng',
    name: 'Kem Dưỡng Goodal Làm Sáng Da Green Tangerine Vita C Dark Spot',
    price: '649.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 43,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'goodal-serum-001',
    images: [skincareImage7, skincareImage8],
    brand: 'CLUB CLIO',
    category: 'Tinh Chất',
    name: 'Tinh Chất Goodal Hỗ Trợ Làm Sáng Da, Mờ Đốm Nâu Green Tangerine',
    price: '749.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 32,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'ahc-eye-cream-001',
    images: [skincareImage9, skincareImage10],
    brand: 'AHC',
    category: 'Kem Mắt',
    name: 'Kem Mắt Và Mặt AHC Mờ Nám Đều Màu Da Pro Shot Gluta-C3',
    price: '542.900đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 1,
    colors: undefined,
    freeShip: false,
    badge: undefined,
  },
  {
    id: 'innisfree-cleanser-001',
    images: [skincareImage11, skincareImage12],
    brand: 'INNISFREE',
    category: 'Sữa Rửa Mặt',
    name: 'Sữa Rửa Mặt Innisfree Green Tea Foam Cleanser',
    price: '159.000đ',
    oldPrice: '189.000đ',
    discount: '-16%',
    rating: 5,
    reviewCount: 156,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'cosrx-toner-001',
    images: [skincareImage13, skincareImage14],
    brand: 'COSRX',
    category: 'Toner',
    name: 'Nước Cân Bằng COSRX AHA/BHA Clarifying Treatment Toner',
    price: '399.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 234,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'laneige-mask-001',
    images: [skincareImage15, skincareImage16],
    brand: 'LANEIGE',
    category: 'Mặt Nạ Ngủ',
    name: 'Mặt Nạ Ngủ Laneige Water Sleeping Mask',
    price: '599.000đ',
    oldPrice: '650.000đ',
    discount: '-8%',
    rating: 5,
    reviewCount: 189,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'somebymi-serum-001',
    images: [skincareImage17, skincareImage18],
    brand: 'SOME BY MI',
    category: 'Serum',
    name: 'Serum Trị Mụn Some By Mi AHA BHA PHA 30 Days Miracle',
    price: '429.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 312,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'sulwhasoo-serum-001',
    images: [skincareImage19, skincareImage20],
    brand: 'SULWHASOO',
    category: 'Sữa Dưỡng',
    name: 'Sữa Dưỡng Sulwhasoo First Care Activating Serum',
    price: '1.890.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 78,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
];

// ==================== XU HƯỚNG - TRANG ĐIỂM ====================
export const makeupProducts = [
  {
    id: 'amuse-palette-003',
    images: [makeupImage1, makeupImage2],
    brand: 'AMUSE',
    category: 'Bảng Phấn Mắt 9 Ô Thuần Chay',
    name: 'Amuse Eye Color Palette 11g',
    price: '639.000đ',
    oldPrice: '659.000đ',
    discount: '-3%',
    rating: 5,
    reviewCount: 5,
    colors: ['#E8B4B8', '#C9A5A0', '#F5D5D5', '#D4A5A5', '#F0C5C5'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: '3ce-tint-001',
    images: [makeupImage3, makeupImage4],
    brand: '3CE',
    category: 'Son Môi',
    name: '3CE Velvet Lip Tint',
    price: '299.000đ',
    oldPrice: '350.000đ',
    discount: '-15%',
    rating: 5,
    reviewCount: 128,
    colors: ['#E8B4B8', '#C9A5A0', '#F5D5D5', '#D4A5A5'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'etude-cushion-001',
    images: [makeupImage5, makeupImage6],
    brand: 'ETUDE',
    category: 'Cushion',
    name: 'Double Lasting Cushion SPF50+ PA+++',
    price: '459.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 89,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'clio-mascara-001',
    images: [makeupImage7, makeupImage8],
    brand: 'CLIO',
    category: 'Mascara',
    name: 'Kill Lash Superproof Mascara',
    price: '329.000đ',
    oldPrice: '380.000đ',
    discount: '-13%',
    rating: 5,
    reviewCount: 64,
    colors: undefined,
    freeShip: false,
    badge: undefined,
  },
  {
    id: 'romand-blush-001',
    images: [makeupImage9, makeupImage10],
    brand: 'ROMAND',
    category: 'Má Hồng',
    name: 'Better Than Cheek Blush',
    price: '219.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 45,
    colors: ['#FFB6C1', '#FF69B4', '#FFE4E1', '#FFC0CB'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'hera-cushion-001',
    images: [makeupImage11, makeupImage12],
    brand: 'HERA',
    category: 'Phấn Nền',
    name: 'Hera Black Cushion SPF34 PA++',
    price: '899.000đ',
    oldPrice: '950.000đ',
    discount: '-5%',
    rating: 5,
    reviewCount: 167,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'peripera-tint-001',
    images: [makeupImage13, makeupImage14],
    brand: 'PERIPERA',
    category: 'Son Kem',
    name: 'Peripera Ink The Velvet',
    price: '189.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 289,
    colors: ['#FF6B6B', '#FF8787', '#FFA5A5', '#FFC0C0', '#FFE0E0'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'merzy-palette-001',
    images: [makeupImage15, makeupImage16],
    brand: 'MERZY',
    category: 'Phấn Mắt',
    name: 'Merzy The First Eye Edition',
    price: '359.000đ',
    oldPrice: '399.000đ',
    discount: '-10%',
    rating: 5,
    reviewCount: 94,
    colors: ['#E8D5C4', '#C9B5A0', '#A58975', '#8B6F4F'],
    freeShip: true,
    badge: undefined,
  },
  {
    id: 'lilybyred-eyeliner-001',
    images: [makeupImage17, makeupImage18],
    brand: 'LILYBYRED',
    category: 'Kẻ Mắt',
    name: 'Lilybyred Starry Eyes Am9 To Pm9 Gel Eyeliner',
    price: '179.000đ',
    oldPrice: undefined,
    discount: undefined,
    rating: 5,
    reviewCount: 212,
    colors: undefined,
    freeShip: false,
    badge: undefined,
  },
  {
    id: 'luna-powder-001',
    images: [makeupImage19, makeupImage20],
    brand: 'LUNA',
    category: 'Phấn Phủ',
    name: 'Luna Long Lasting Cover Powder Pact',
    price: '289.000đ',
    oldPrice: '320.000đ',
    discount: '-10%',
    rating: 5,
    reviewCount: 138,
    colors: undefined,
    freeShip: true,
    badge: undefined,
  },
];

const ProductCard = ({
  id,
  images = [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
  ],
  freeShip = true,
  brand = 'AMUSE',
  category = 'Bảng Phấn Mắt 9 Ô Thuần Chay',
  name = 'Amuse Eye Color Palette 11g',
  price = '639.000đ',
  oldPrice,
  discount,
  rating = 5,
  reviewCount = 5,
  colors,
  badge,
}: {
  id?: string | number;
  images?: string[];
  freeShip?: boolean;
  brand?: string;
  category?: string;
  name?: string;
  price?: string;
  oldPrice?: string | null;
  discount?: string | null;
  rating?: number;
  reviewCount?: number;
  colors?: string[] | null;
  badge?: string | null;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigateToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.history.pushState({}, '', `/product/${id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const displayColors = colors ? colors.slice(0, 4) : [];
  const remainingColors = colors && colors.length > 4 ? colors.length - 4 : 0;

  return (
    <>
      <div
        className="w-80 overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={navigateToDetail}
        >
          <img
            src={images[0]}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={images[1]}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {badge && (
            <div className="absolute top-3 left-3 flex h-12 w-12 items-center justify-center rounded-full bg-black font-bold text-white">
              {badge}
            </div>
          )}

          <button
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-100"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={20}
              className={
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
              }
            />
          </button>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <button
              className={`cursor-pointer rounded-full bg-gradient-to-r px-8 py-3 font-semibold transition-all ${
                isButtonHovered
                  ? 'from-yellow-400 to-purple-500 text-white shadow-lg'
                  : 'bg-black text-white'
              }`}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={(e) => {
                e.stopPropagation(); // THÊM stopPropagation
                setIsModalOpen(true);
              }}
            >
              Xem nhanh
            </button>
          </div>

          {freeShip && (
            <div className="absolute bottom-3 left-3">
              <div className="rounded bg-gradient-to-r from-pink-400 to-pink-300 px-4 py-1 text-sm font-bold text-white">
                FREESHIP
              </div>
            </div>
          )}
        </div>

        <div className="p-4" onClick={navigateToDetail}>
          <div className="mb-1 text-center font-bold text-gray-900">
            {brand}
          </div>

          <div className="mb-1 text-center text-sm text-gray-600">
            {category}
          </div>

          <div className="mb-3 text-center text-gray-800">{name}</div>

          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-gray-900">{price}</span>
            {oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {oldPrice}
              </span>
            )}
            {discount && (
              <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                {discount}
              </span>
            )}
          </div>

          {colors && colors.length > 0 && (
            <div
              className={`flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ${
                isHovered ? 'mb-3 max-h-10 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {displayColors.map((color, index) => (
                <button
                  key={index}
                  className="h-8 w-8 rounded-full border-2 border-gray-200 transition-transform hover:scale-110 hover:border-gray-400"
                  style={{ backgroundColor: color }}
                />
              ))}
              {remainingColors > 0 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                  +{remainingColors}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={index < rating ? 'text-black' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
            <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
          </div>
        </div>
      </div>

      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{
          images,
          brand,
          name,
          price,
          oldPrice,
          discount,
          rating,
          reviewCount,
          colors,
        }}
      />
    </>
  );
};

export default ProductCard;
