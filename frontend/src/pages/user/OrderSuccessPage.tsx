import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import CancelOrderModal from '../../components/user/ui/CancelOrderModal';

interface OrderSuccessPageProps {
  orderCode: string;
  onBack: () => void;
}

export default function OrderSuccessPage({
  orderCode,
  onBack,
}: OrderSuccessPageProps) {
  const orderInfo = {
    code: orderCode,
    customer: 'Nguyen Tan Loi',
    customerId: '7197ab0597c5453dce02dc70db38bcf1:86d3e497d1df70c70550',
    address: '206/16 - đường số 20, Phường 5, Quận Gò Vấp, Hồ Chí Minh',
    paymentMethod: 'Trả tiền mặt khi nhận hàng (COD)',
    deliveryDate: '12/04/2025 - 12/07/2025',
    items: [
      {
        id: 1,
        name: 'Kem Chống Nắng Lâu Trôi THE FACE SHOP Natural Sun Eco Power Long-Lasting Sun Cream Spf50+ Pa+++',
        size: '20ml',
        sku: '56001542',
        quantity: 1,
        price: 279000,
        image:
          'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
      },
      {
        id: 2,
        name: 'Kem Chống Nắng Lâu Trôi THE FACE SHOP Natural Sun Eco Power Long-Lasting Sun Cream Spf50+ Pa+++',
        size: '20ml',
        sku: '56001542',
        quantity: 1,
        price: 279000,
        image:
          'https://image.hsv-tech.io/150x0/bbx/common/e75ba095-a52f-4ee2-a866-d3bd8b3b1ce3.webp',
      },
    ],
    subtotal: 558000,
    discount: 272000,
    shipping: 0,
    total: 286000,
  };

  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span>Trang chủ</span>
            <span className="mx-2">›</span>
            <span>Đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Đơn hàng #{orderInfo.code} đã đặt thành công!
            </h1>
            <p className="text-sm text-gray-600">
              Giao hàng dự kiến: {orderInfo.deliveryDate}
            </p>
            <p className="text-sm text-red-600">
              Tuyệt đối không chuyển khoản cho shipper trước khi nhận hàng.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Mua lại
            </button>
            <button className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800">
              Hoàn tất đơn hàng
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Hủy
            </button>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="relative flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600">
                <Package className="text-white" size={28} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-900">
                  Đã đặt đơn hàng
                </p>
                <p className="text-xs text-gray-500">a few seconds ago</p>
              </div>
            </div>

            {/* Connector */}
            <div className="absolute top-8 right-[12.5%] left-[12.5%] h-1 bg-gray-200" />

            {/* Step 2 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Clock className="text-gray-400" size={28} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-400">
                  Xác nhận đơn hàng
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Package className="text-gray-400" size={28} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-400">
                  Đang chuẩn bị đơn hàng
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Truck className="text-gray-400" size={28} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-400">
                  Đang vận chuyển
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-1 flex-col items-center">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <CheckCircle className="text-gray-400" size={28} />
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-400">Hoàn tất</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Order Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thông tin nhận hàng
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {orderInfo.customer}
                </p>
                <p className="text-gray-600">{orderInfo.customerId}</p>
                <p className="text-gray-600">{orderInfo.address}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </h2>
              <p className="text-sm text-gray-600">{orderInfo.paymentMethod}</p>
              <p className="mt-2 text-sm text-gray-900">
                Tổng giá trị thanh toán{' '}
                <span className="font-bold">
                  {formatPrice(orderInfo.total)}
                </span>{' '}
                khi nhận hàng
              </p>
            </div>

            {/* Shipping Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Thông tin vận chuyển
              </h2>
              <p className="text-sm text-gray-600">
                Chưa có thông tin vận chuyển
              </p>
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Đơn hàng
              </h2>

              <div className="mb-5 space-y-4">
                {orderInfo.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="mb-2 line-clamp-2 text-sm leading-tight font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="mb-1 text-xs text-gray-500">{item.size}</p>
                      <p className="mb-2 text-xs text-gray-500">
                        SKU: {item.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          x{item.quantity}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(orderInfo.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(orderInfo.discount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(orderInfo.shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold text-gray-900">Tổng</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(orderInfo.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          alert('Đơn hàng đã được hủy');
        }}
        orderCode={orderInfo.code}
      />
    </div>
  );
}
