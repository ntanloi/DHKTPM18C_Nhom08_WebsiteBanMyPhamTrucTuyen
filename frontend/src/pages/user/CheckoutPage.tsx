import { ChevronDown, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  gift?: {
    name: string;
    image: string;
    sku: string;
  };
}

export default function CheckoutPage() {
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      sku: '11112251',
      name: 'Bảng Phấn Mắt 9 Ô Thuần Chay Amuse Eye Color Palette 11g',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
      price: 659000,
      quantity: 1,
      gift: {
        name: '(GWP) Gương Trang Điểm Amuse My Amuse Mirror 87g',
        image:
          'https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp',
        sku: '11112291',
      },
    },
    {
      id: '2',
      sku: '11112232',
      name: 'Kem Dưỡng Tay Thuần Chay Amuse Vegan Soybean Hand...',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
      price: 469000,
      quantity: 1,
    },
  ]);

  const [gwpExpanded, setGwpExpanded] = useState(true);
  const [ahcExpanded, setAhcExpanded] = useState(true);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span>Trang chủ</span>
            <span className="mx-2">›</span>
            <span className="font-medium text-gray-900">Thanh toán</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="mb-6 text-[28px] font-bold text-gray-900">
          Giỏ hàng giao tận nơi
        </h1>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left Column - Promotions */}
          <div className="space-y-5 lg:col-span-2">
            {/* GWP Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => setGwpExpanded(!gwpExpanded)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <h2 className="text-[15px] font-semibold text-gray-900">
                  Quà tặng độc quyền từ Beauty Box
                </h2>
                <ChevronDown
                  className={`text-gray-500 transition-transform ${gwpExpanded ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>

              {gwpExpanded && (
                <div className="border-t border-gray-100 px-5 pt-4 pb-5">
                  <div className="mb-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 p-4">
                    <div className="mb-2 inline-block rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-sm">
                      DGAY T11.2025 - GIFT ON TOP
                    </div>
                    <p className="text-[13px] text-gray-700">
                      Bạn được chọn 1 trong những phần quà sau
                    </p>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-3">
                      <img
                        src="https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp"
                        alt="Gift 1"
                        className="h-[72px] w-[72px] rounded-lg border border-gray-100 object-cover"
                      />
                      <img
                        src="https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp"
                        alt="Gift 2"
                        className="h-[72px] w-[72px] rounded-lg border border-gray-100 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 text-[13px] text-gray-600">
                        11112261 | Bảng Tây Trang GLM...
                      </p>
                      <p className="text-[15px] font-bold text-[#d4145a]">
                        35.000đ
                      </p>
                    </div>
                    <button className="rounded-full border-2 border-black px-7 py-2 text-[13px] font-semibold transition hover:bg-gray-50">
                      Thêm
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AHC Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => setAhcExpanded(!ahcExpanded)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <h2 className="text-[15px] font-semibold text-gray-900">AHC</h2>
                <ChevronDown
                  className={`text-gray-500 transition-transform ${ahcExpanded ? 'rotate-180' : ''}`}
                  size={20}
                />
              </button>

              {ahcExpanded && (
                <div className="space-y-3 border-t border-gray-100 px-5 pt-4 pb-5">
                  {/* Product 1 */}
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <img
                      src="https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp"
                      alt="AHC Product 1"
                      className="h-[85px] w-[85px] rounded-lg border border-gray-100 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1.5 text-[13px] leading-snug font-medium text-gray-900">
                        Kem Mắt Và Mặt AHC Mã Năm, Làm Đều Màu Da Pro Shot
                        Gluta-C+lvation Bright 3 30ml
                      </h3>
                      <div className="mb-1.5 flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[12px]">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500">(1)</span>
                      </div>
                      <p className="text-[15px] font-bold text-gray-900">
                        542.900đ
                      </p>
                    </div>
                    <button className="rounded-full border-2 border-black px-7 py-2 text-[13px] font-semibold transition hover:bg-gray-50">
                      Thêm
                    </button>
                  </div>

                  {/* Product 2 */}
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <img
                      src="https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp"
                      alt="AHC Product 2"
                      className="h-[85px] w-[85px] rounded-lg border border-gray-100 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1.5 text-[13px] leading-snug font-medium text-gray-900">
                        Tinh Chất AHC Làm Mờ Nám, Đều Màu Da Pro Shot
                        Gluta-C+lvation Bright 3 Intra-Serum 40M
                      </h3>
                      <div className="mb-1.5 flex items-center gap-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-[12px]">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500">(1)</span>
                      </div>
                      <p className="text-[15px] font-bold text-gray-900">
                        937.600đ
                      </p>
                    </div>
                    <button className="rounded-full border-2 border-black px-7 py-2 text-[13px] font-semibold transition hover:bg-gray-50">
                      Thêm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
                Đơn hàng
              </h2>

              <div className="mb-5 space-y-5">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-[90px] w-[90px] rounded-lg border border-gray-200 object-cover"
                        />
                        <button className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[11px] font-bold text-gray-700 hover:bg-gray-400">
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 line-clamp-2 text-[13px] leading-tight font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="mb-3 text-[11px] text-gray-500">
                          SKU: {item.sku}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-gray-300">
                            <button className="flex h-7 w-7 items-center justify-center hover:bg-gray-50">
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="px-3 text-[13px] font-medium">
                              {item.quantity}
                            </span>
                            <button className="flex h-7 w-7 items-center justify-center hover:bg-gray-50">
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                          <span className="text-[15px] font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.gift && (
                      <div className="mt-3 ml-2 flex gap-3 rounded-lg bg-pink-50 p-3">
                        <img
                          src={item.gift.image}
                          alt={item.gift.name}
                          className="h-14 w-14 flex-shrink-0 rounded-lg border border-pink-100 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="mb-1.5 inline-block rounded bg-[#d4145a] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                            Quà Tặng
                          </span>
                          <p className="line-clamp-2 text-[12px] text-gray-800">
                            {item.gift.name}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-500">
                            SKU: {item.gift.sku}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-4 border-t border-gray-200 pt-4">
                <div className="mb-2 flex justify-between text-[13px]">
                  <span className="text-gray-600">Tổng giá trị đơn hàng</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <div className="mb-5 rounded-lg bg-gray-50 p-3.5">
                <p className="text-[12px] leading-relaxed text-gray-600">
                  Mã giảm giá, voucher có thể thêm vào ở màn hình kế tiếp
                </p>
              </div>

              <button className="w-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] py-3.5 text-[14px] font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 hover:shadow-xl">
                TIẾP TỤC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
