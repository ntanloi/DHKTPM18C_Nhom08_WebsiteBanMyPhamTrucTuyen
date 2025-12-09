import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import CancelOrderModal from '../../components/user/ui/CancelOrderModal';
import {
  getOrderDetail,
  cancelOrder,
  type OrderDetailResponse,
} from '../../api/order';
import { Toast, type ToastType } from '../../components/user/ui/Toast';
import { useCart } from '../../context/CartContext';

interface OrderSuccessPageProps {
  orderCode: string;
  onBack: () => void;
}

interface OrderInfo {
  code: string;
  status: string; // Order status: PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
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
    productSlug?: string; // Product slug for navigation to detail page
    productVariantId: number; // Product variant ID for adding to cart
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
  const { addToCart } = useCart();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_canceling, setCanceling] = useState(false);
  const [reordering, setReordering] = useState(false);
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

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!orderInfo) return;

    try {
      setCanceling(true);
      await cancelOrder(parseInt(orderInfo.code));
      showToast('Đơn hàng đã được hủy thành công!', 'success');
      setShowCancelModal(false);

      // Reload order detail to update status
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      showToast(
        error.response?.data?.error || 'Có lỗi xảy ra khi hủy đơn hàng',
        'error',
      );
    } finally {
      setCanceling(false);
    }
  };

  // Handle reorder - add all items back to cart
  const handleReorder = async () => {
    if (!orderInfo || !orderInfo.items.length) return;

    try {
      setReordering(true);

      // Add each item to cart
      for (const item of orderInfo.items) {
        if (item.productVariantId) {
          await addToCart(item.productVariantId, item.quantity);
        }
      }

      showToast('Đã thêm tất cả sản phẩm vào giỏ hàng!', 'success');

      // Navigate to cart after a short delay
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 1500);
    } catch (error: any) {
      showToast(
        error.response?.data?.error || 'Có lỗi xảy ra khi thêm vào giỏ hàng',
        'error',
      );
    } finally {
      setReordering(false);
    }
  };

  // Handle complete order - go to homepage
  const handleCompleteOrder = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const loadOrderDetail = async () => {
      try {
        setLoading(true);
        console.log('📡 Loading order detail for order:', orderCode);
        const orderId = parseInt(orderCode);

        // Try authenticated endpoint first (for logged in users), fallback to guest endpoint
        let orderDetail: OrderDetailResponse;
        try {
          console.log('Trying authenticated order endpoint...');
          orderDetail = await getOrderDetail(orderId);
          console.log(
            '✅ Order detail loaded from authenticated endpoint:',
            orderDetail,
          );
        } catch (authError) {
          console.log(
            'Authenticated endpoint failed, trying guest endpoint...',
          );
          // For guest orders, we would need email from URL params or localStorage
          // For now, just throw the error
          throw authError;
        }

        // Transform API response to OrderInfo format
        const transformedInfo: OrderInfo = {
          code: orderDetail.id.toString(),
          status: orderDetail.status || 'PENDING', // Add order status
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
            productSlug: item.productSlug, // Add product slug for navigation
            productVariantId: item.productVariantId, // Add variant ID for cart
            quantity: item.quantity,
            price: item.price || 0,
            image: item.imageUrl || 'https://via.placeholder.com/80',
          })),
          subtotal: orderDetail.subtotal || 0,
          discount: orderDetail.discountAmount || 0,
          shipping: orderDetail.shippingFee || 0,
          total: orderDetail.totalAmount || 0,
        };

        setOrderInfo(transformedInfo);
        setError(null);
      } catch (err: any) {
        console.error('❌ Error loading order detail:', err);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);

        // Create fallback order info if API fails
        const fallbackInfo: OrderInfo = {
          code: orderCode,
          status: 'PENDING',
          customer: 'Khách hàng',
          customerId: '',
          address: 'Đang cập nhật',
          paymentMethod: 'Trả tiền mặt khi nhận hàng (COD)',
          deliveryDate: 'Đang cập nhật',
          items: [],
          subtotal: 0,
          discount: 0,
          shipping: 0,
          total: 0,
        };

        setOrderInfo(fallbackInfo);
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          'Không thể tải chi tiết đơn hàng';
        console.warn('⚠️ Using fallback order info:', errorMessage);
        showToast(
          'Đơn hàng đã được tạo thành công! Chi tiết đơn hàng sẽ được cập nhật sau.',
          'info',
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) {
      loadOrderDetail();
    }
  }, [orderCode]);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  // Helper function to determine which steps are completed based on order status
  const getOrderProgress = (status: string) => {
    const steps = {
      PENDING: 1, // Đã đặt đơn hàng
      CONFIRMED: 2, // Xác nhận đơn hàng
      PREPARING: 3, // Đang chuẩn bị đơn hàng
      SHIPPING: 4, // Đang vận chuyển
      DELIVERED: 5, // Hoàn tất
      DELIVERY: 5, // Hoàn tất (alternative name)
      CANCELLED: 0, // Đã hủy
    };
    return steps[status as keyof typeof steps] || 1;
  };

  const currentStep = orderInfo ? getOrderProgress(orderInfo.status) : 1;

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
                {orderInfo.status === 'CANCELLED'
                  ? `Đơn hàng #${orderInfo.code} đã được hủy thành công!`
                  : `Đơn hàng #${orderInfo.code} đã đặt thành công!`}
              </h1>
              <p className="text-sm text-gray-600">
                Giao hàng dự kiến: {orderInfo.deliveryDate}
              </p>
              <p className="text-sm text-red-600">
                Tuyệt đối không chuyển khoản cho shipper trước khi nhận hàng.
              </p>
            </div>
            <div className="flex gap-3">
              {/* Reorder button - add all items back to cart */}
              <button
                onClick={handleReorder}
                disabled={reordering}
                className="rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {reordering ? 'Đang xử lý...' : 'Mua lại'}
              </button>

              {/* Complete order button - go to homepage */}
              <button
                onClick={handleCompleteOrder}
                className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Hoàn tất đơn hàng
              </button>

              {/* Cancel button - only show for PENDING orders */}
              {orderInfo.status === 'PENDING' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-full border-2 border-red-300 px-6 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="relative flex items-center justify-between">
              {/* Step 1 - Đã đặt đơn hàng */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                    currentStep >= 1
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <Package
                    className={
                      currentStep >= 1 ? 'text-white' : 'text-gray-400'
                    }
                    size={28}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    Đã đặt đơn hàng
                  </p>
                  {currentStep >= 1 && (
                    <p className="text-xs text-gray-500">Đã hoàn thành</p>
                  )}
                </div>
              </div>

              {/* Connector 1-2 */}
              <div
                className={`absolute top-8 right-[80%] left-[10%] h-1 ${currentStep >= 2 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`}
              />

              {/* Step 2 - Xác nhận đơn hàng */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                    currentStep >= 2
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <Clock
                    className={
                      currentStep >= 2 ? 'text-white' : 'text-gray-400'
                    }
                    size={28}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    Xác nhận đơn hàng
                  </p>
                  {currentStep >= 2 && (
                    <p className="text-xs text-gray-500">Đã hoàn thành</p>
                  )}
                </div>
              </div>

              {/* Connector 2-3 */}
              <div
                className={`absolute top-8 right-[60%] left-[30%] h-1 ${currentStep >= 3 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`}
              />

              {/* Step 3 - Đang chuẩn bị */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                    currentStep >= 3
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <Package
                    className={
                      currentStep >= 3 ? 'text-white' : 'text-gray-400'
                    }
                    size={28}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    Đang chuẩn bị
                  </p>
                  {currentStep >= 3 && (
                    <p className="text-xs text-gray-500">Đã hoàn thành</p>
                  )}
                </div>
              </div>

              {/* Connector 3-4 */}
              <div
                className={`absolute top-8 right-[40%] left-[50%] h-1 ${currentStep >= 4 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`}
              />

              {/* Step 4 - Đang vận chuyển */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                    currentStep >= 4
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <Truck
                    className={
                      currentStep >= 4 ? 'text-white' : 'text-gray-400'
                    }
                    size={28}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${currentStep >= 4 ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    Đang vận chuyển
                  </p>
                  {currentStep >= 4 && (
                    <p className="text-xs text-gray-500">Đã hoàn thành</p>
                  )}
                </div>
              </div>

              {/* Connector 4-5 */}
              <div
                className={`absolute top-8 right-[20%] left-[70%] h-1 ${currentStep >= 5 ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-gray-200'}`}
              />

              {/* Step 5 - Hoàn tất */}
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full ${
                    currentStep >= 5
                      ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <CheckCircle
                    className={
                      currentStep >= 5 ? 'text-white' : 'text-gray-400'
                    }
                    size={28}
                  />
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${currentStep >= 5 ? 'text-gray-900' : 'text-gray-400'}`}
                  >
                    Hoàn tất
                  </p>
                  {currentStep >= 5 && (
                    <p className="text-xs text-gray-500">Đã giao hàng</p>
                  )}
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
                    <div key={item.id} className="flex flex-col gap-2">
                      <div className="flex gap-3">
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
                      {/* Review button - only show when order is delivered */}
                      {(orderInfo.status === 'DELIVERED' ||
                        orderInfo.status === 'DELIVERY') &&
                        item.productSlug && (
                          <button
                            onClick={() =>
                              (window.location.href = `/product/${item.productSlug}`)
                            }
                            className="w-full rounded-lg border-2 border-[rgb(235,97,164)] bg-white px-3 py-2 text-sm font-medium text-[rgb(235,97,164)] transition-colors duration-200 hover:bg-[rgb(235,97,164)] hover:text-white"
                          >
                            Đánh giá sản phẩm
                          </button>
                        )}
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
          onConfirm={handleCancelOrder}
          orderCode={orderInfo.code}
        />
      </div>
    </>
  );
}
