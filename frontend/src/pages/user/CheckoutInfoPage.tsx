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
    sku: string;
  };
}

interface CheckoutInfoPageProps {
  isLoggedIn?: boolean;
  onPlaceOrder?: () => void;
}

export default function CheckoutInfoPage({
  isLoggedIn = false,
  onPlaceOrder,
}: CheckoutInfoPageProps) {
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      sku: 'J6740032',
      name: 'Kem Dưỡng Goodal Làm Sáng Da Green Tangerine Vita C Dark Spot...',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
      price: 649000,
      quantity: 1,
    },
    {
      id: '2',
      sku: 'EC25-BBK06-TRAFFIC_4.2',
      name: '(Gift) Combo Goodal - 1 Tinh Chất Chống Nắng Green...',
      image:
        'https://image.hsv-tech.io/150x0/bbx/common/4873f479-daba-4074-bd62-be3de38377dd.webp',
      price: 0,
      quantity: 1,
      gift: {
        name: 'Quà Tặng',
        sku: 'EC25-BBK06-TRAFFIC_4.2',
      },
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: isLoggedIn ? 'Nguyen Tan' : '',
    gender: isLoggedIn ? 'Loi' : '',
    phone: isLoggedIn ? '8486748359' : '',
    email: isLoggedIn ? 'nguyenloidt.052017@gmail.com' : '',
    city: '',
    district: '',
    address: '',
    location: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [_showNote, _setShowNote] = useState(false);
  const [_showInvoice, _setShowInvoice] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = 0;
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const updateQuantity = (id: string, delta: number) => {
    // Handle quantity update
    console.log('Update quantity:', id, delta);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white">
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
          Thông tin thanh toán
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Thông tin người mua hàng
              </h2>

              {!isLoggedIn ? (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-pink-50 p-3 text-sm">
                  <span className="text-pink-600">Đăng nhập nhanh</span>
                  <span className="text-gray-600">|</span>
                  <button className="font-semibold text-pink-600 hover:underline">
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="mb-5 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-700">
                    Bạn đã đăng nhập với tài khoản{' '}
                    <span className="font-semibold text-gray-900">
                      {formData.email}
                    </span>
                    .{' '}
                    <button className="font-semibold text-pink-600 hover:underline">
                      Đăng xuất
                    </button>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tên"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Họ"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      placeholder="+ 84"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                </div>

                {!isLoggedIn && (
                  <p className="text-xs text-gray-500">
                    Người nhận là người khác
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Thông tin nhận hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tỉnh/Thành phố"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                  />
                  {!formData.city && (
                    <p className="mt-1 text-xs text-red-500">
                      Tỉnh/Thành phố là bắt buộc
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Quận/huyện"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                    {!formData.district && (
                      <p className="mt-1 text-xs text-red-500">
                        Quận/huyện là bắt buộc
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Phường/xã"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                    />
                    {!formData.address && (
                      <p className="mt-1 text-xs text-red-500">
                        Phường/xã là bắt buộc
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tòa nhà, số nhà, tên đường"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Tên địa chỉ (vd: Văn phòng, Nhà...)"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <button className="text-sm text-gray-600 hover:text-gray-900">
                  Tạo tài khoản với thông tin này
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Trả tiền mặt khi nhận hàng (COD)
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Không chuyển khoản trước khi nhận hàng vào tài khoản mình
                      không được thông báo
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="zalopay"
                    checked={paymentMethod === 'zalopay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-pink-600"
                  />
                  <span className="flex-1 text-gray-900">
                    ZaloPay & Chuyển khoản Ngân Hàng
                  </span>
                  <img
                    src="https://cdn.zalopay.vn/web/assets/images/logo_zalopay.svg"
                    alt="ZaloPay"
                    className="h-6"
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="aftee"
                    checked={paymentMethod === 'aftee'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        AFTEE - Mua sắm thuận tiện, trả sau linh hoạt
                      </span>
                      <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                        Hoàn tiền 3%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Trả sau miễn phí trong 30 ngày với mã số điện thoại
                    </p>
                  </div>
                  <img
                    src="https://aftee.vn/logo.png"
                    alt="AFTEE"
                    className="h-6"
                  />
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="payoo"
                    checked={paymentMethod === 'payoo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-pink-600"
                  />
                  <span className="flex-1 text-gray-900">
                    Thẻ ATM/ Visa/ Master/ JCB/ QR Pay/ Ví điện tử khác qua
                    Payoo
                  </span>
                  <img
                    src="https://www.payoo.vn/assets/images/logo.svg"
                    alt="Payoo"
                    className="h-6"
                  />
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-pink-600"
                  />
                  <span className="flex-1 text-gray-900">Ví MoMo</span>
                  <div className="flex h-6 items-center rounded bg-pink-600 px-2 text-xs font-bold text-white">
                    MOMO
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="fundiin"
                    checked={paymentMethod === 'fundiin'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">
                        Fundiin - Mua trước trả sau 0% lãi suất
                      </span>
                      <span className="rounded bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                        💰 Giảm 50%
                      </span>
                    </div>
                  </div>
                  <img
                    src="https://fundiin.vn/logo.png"
                    alt="Fundiin"
                    className="h-6"
                  />
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="momo-installment"
                    checked={paymentMethod === 'momo-installment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-pink-600"
                  />
                  <span className="flex-1 text-gray-900">
                    Ví Trả Sau - MoMo
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex h-6 items-center rounded bg-pink-600 px-2 text-xs font-bold text-white">
                      MOMO
                    </div>
                    <div className="flex h-6 items-center rounded bg-purple-600 px-2 text-xs font-bold text-white">
                      TRẢ SAU
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Phương thức vận chuyển
              </h2>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Giao hàng tiêu chuẩn (3 - 6 ngày) (Giao gia hành chánh)
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Vật nước nào nhận hàng trong ngày; sau 10h nhận ngày kế
                      tiếp (các trường hợp HCM, HN chỉ nhận)
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="mt-1 h-4 w-4 accent-pink-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Giao hàng trong 24h
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Vật nước nào nhận hàng trong ngày; sau 10h nhận ngày kế
                      tiếp (các trường hợp HCM, HN chỉ nhận)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Đơn hàng
              </h2>

              <div className="mb-5 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                      />
                      {item.gift && (
                        <span className="absolute -top-1 -left-1 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {item.gift.name}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 text-sm leading-tight font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="mb-2 text-xs text-gray-500">
                        SKU: {item.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng giá trị đơn hàng</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(discount)}
                  </span>
                </div>
                {discount > 0 && (
                  <>
                    <div className="text-xs text-gray-500">
                      DGAY T09.2025 - GOODAL GRE...
                    </div>
                    <div className="text-xs text-gray-500">
                      Black Friday 2025- GIFT ON T...
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                  <span className="font-semibold text-gray-900">
                    Tổng (đã bao gồm VAT)
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={onPlaceOrder}
                className="mb-4 w-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 hover:shadow-xl"
              >
                ĐẶT HÀNG
              </button>

              <p className="mb-4 text-center text-xs text-gray-500">
                *Vui lòng không hủy đơn hàng khi đã thanh toán*
              </p>

              {/* Coupon Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-3 font-semibold text-gray-900">
                  Coupon & Voucher
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="NHẬP MÃ GIẢM GIÁ (NẾU CÓ)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none"
                  />
                  <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
