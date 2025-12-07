import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import CancelOrderModal from '../../components/user/ui/CancelOrderModal';
import { getOrderDetail, type OrderDetailResponse } from '../../api/order';
import { Toast, type ToastType } from '../../components/user/ui/Toast';

interface OrderSuccessPageProps {
  orderCode: string;
  onBack: () => void;
}

interface OrderInfo {
  code: string;
  customer: string;
  customerId?: string;
  address: string;
  paymentMethod: string;
  deliveryDate: string;
  items: Array<{
    id: number;
    name: string;
    size: string;
    sku?: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export default function OrderSuccessPage({
  orderCode,
  onBack,
}: OrderSuccessPageProps) {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: '',
    type: 'info',
  });
  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  useEffect(() => {
    const loadOrderDetail = async () => {
      try {
        setLoading(true);
        const orderId = parseInt(orderCode);
        const orderDetail: OrderDetailResponse = await getOrderDetail(orderId);

        // Transform API response to OrderInfo format
        const transformedInfo: OrderInfo = {
          code: orderDetail.id.toString(),
          customer: orderDetail.recipientInfo
            ? `${orderDetail.recipientInfo.recipientFirstName} ${orderDetail.recipientInfo.recipientLastName}`
            : 'Khách hàng',
          customerId: orderDetail.recipientInfo?.recipientEmail || '',
          address:
            orderDetail.recipientInfo?.shippingRecipientAddress ||
            'Địa chỉ giao hàng',
          paymentMethod:
            orderDetail.paymentInfo?.status === 'PENDING'
              ? 'Trả tiền mặt khi nhận hàng (COD)'
              : 'Thanh toán online',
          deliveryDate:
            orderDetail.estimateDeliveryFrom && orderDetail.estimateDeliveryTo
              ? `${new Date(orderDetail.estimateDeliveryFrom).toLocaleDateString('vi-VN')} - ${new Date(orderDetail.estimateDeliveryTo).toLocaleDateString('vi-VN')}`
              : 'Đang cập nhật',
          items: orderDetail.orderItems.map((item) => ({
            id: item.id,
            name: item.productName || 'Sản phẩm',
            size: item.variantName || 'Phiên bản',
            sku: item.productVariantId?.toString() || '000000',
            quantity: item.quantity,
            price: item.price || 0,
            image: 'https://via.placeholder.com/80', // TODO: Add image from product variant
          })),
          subtotal: orderDetail.subtotal || 0,
          discount: orderDetail.discountAmount || 0,
          shipping: orderDetail.shippingFee || 0,
          total: orderDetail.totalAmount || 0,
        };

        setOrderInfo(transformedInfo);
        setError(null);
      } catch (err: any) {
        console.error('Error loading order detail:', err);
        const errorMessage = err.message || 'Không thể tải thông tin đơn hàng';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) {
      loadOrderDetail();
    }
  }, [orderCode]);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600"></div>
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !orderInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-red-600">
            <Package size={48} className="mx-auto mb-2" />
            <p className="text-lg font-semibold">
              Không thể tải thông tin đơn hàng
            </p>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </div>
          <button
            onClick={onBack}
            className="mt-4 rounded-full bg-pink-600 px-6 py-2 text-white hover:bg-pink-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in-right {
      animation: slideInRight 0.3s ease-out;
    }
  `}
      </style>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}

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
                  <p className="text-sm font-semibold text-gray-400">
                    Hoàn tất
                  </p>
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
                <p className="text-sm text-gray-600">
                  {orderInfo.paymentMethod}
                </p>
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
                        <p className="mb-1 text-xs text-gray-500">
                          {item.size}
                        </p>
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
            showToast('Đơn hàng đã được hủy thành công', 'success');
          }}
          orderCode={orderInfo.code}
        />
      </div>
    </>
  );
}
