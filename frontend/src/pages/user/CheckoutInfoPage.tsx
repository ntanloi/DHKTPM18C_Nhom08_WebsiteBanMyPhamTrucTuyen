import { useState, useEffect, useContext } from 'react';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/auth-context';
import {
  createOrder,
  createGuestOrder,
  getOrderDetail,
  type CreateOrderRequest,
  type CreateGuestOrderRequest,
} from '../../api/order';
import {
  createVNPayPayment,
  getPaymentMethods,
  type PaymentMethod,
} from '../../api/payment';
import CartItemCard from '../../components/user/ui/CartItemCard';
import { useAddress } from '../../hooks/useAddress';
import { getPaymentIcon } from '../../utils/paymentIcons';
import { Toast, type ToastType } from '../../components/user/ui/Toast';
import VNPayPaymentModal from '../../components/user/payment/VNPayPaymentModal';

interface CheckoutInfoPageProps {
  onNavigate?: (path: string) => void;
}

export default function CheckoutInfoPage({
  onNavigate,
}: CheckoutInfoPageProps) {
  const { provinces, districts, wards, fetchDistricts, fetchWards } =
    useAddress();
  const {
    cart,
    loading: cartLoading,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('CheckoutInfoPage must be used within AuthProvider');
  }
  const { user } = authContext;

  const [formData, setFormData] = useState({
    recipientFirstName: '',
    recipientLastName: '',
    recipientPhone: '',
    recipientEmail: '',
    province: '',
    district: '',
    ward: '',
    address: '',
    notes: '',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] =
    useState<number>(1); // Default COD
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // VNPay Payment Modal State
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [vnpayPaymentUrl, setVnpayPaymentUrl] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<number>(0);

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

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();

        if (methods && methods.length > 0) {
          setPaymentMethods(methods.filter((m) => m.isActive));

          // Set default to COD if available
          const codMethod = methods.find((m) => m.code === 'COD');
          if (codMethod) {
            setSelectedPaymentMethodId(codMethod.id);
          }
        } else {
          // Fallback data nếu API không trả về
          console.warn('⚠️ No payment methods from API, using fallback data');
          const fallbackMethods: PaymentMethod[] = [
            {
              id: 1,
              name: 'Thanh toán khi nhận hàng (COD)',
              code: 'COD',
              description:
                'Không chuyển khoản bất kỳ khoản tiền nào khi chưa nhận được hàng',
              isActive: true,
            },
            {
              id: 2,
              name: 'Chuyển khoản ngân hàng',
              code: 'BANK',
              isActive: true,
            },
            {
              id: 3,
              name: 'Thẻ tín dụng/Ghi nợ',
              code: 'CARD',
              isActive: true,
            },
            {
              id: 4,
              name: 'Ví Momo',
              code: 'MOMO',
              isActive: true,
            },
            {
              id: 5,
              name: 'ZaloPay',
              code: 'ZALO',
              isActive: true,
            },
            {
              id: 6,
              name: 'VNPay',
              code: 'VNPAY',
              isActive: true,
            },
          ];
          setPaymentMethods(fallbackMethods);
          setSelectedPaymentMethodId(1); // Default COD
        }
      } catch (error) {
        console.error('❌ Error loading payment methods:', error);

        // Use fallback data on error
        const fallbackMethods: PaymentMethod[] = [
          {
            id: 1,
            name: 'Thanh toán khi nhận hàng (COD)',
            code: 'COD',
            description:
              'Không chuyển khoản bất kỳ khoản tiền nào khi chưa nhận được hàng',
            isActive: true,
          },
          {
            id: 2,
            name: 'Chuyển khoản ngân hàng',
            code: 'BANK',
            isActive: true,
          },
          {
            id: 3,
            name: 'Thẻ tín dụng/Ghi nợ',
            code: 'CARD',
            isActive: true,
          },
          {
            id: 4,
            name: 'Ví Momo',
            code: 'MOMO',
            isActive: true,
          },
          {
            id: 5,
            name: 'ZaloPay',
            code: 'ZALO',
            isActive: true,
          },
          {
            id: 6,
            name: 'VNPay',
            code: 'VNPAY',
            isActive: true,
          },
        ];
        setPaymentMethods(fallbackMethods);
        setSelectedPaymentMethodId(1); // Default COD
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    loadPaymentMethods();
  }, []);

  // Auto-fill user info if logged in
  useEffect(() => {
    if (user && user.fullName) {
      const fullName = user.fullName || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[nameParts.length - 1] || '';
      const lastName = nameParts.slice(0, -1).join(' ') || '';

      setFormData((prev) => ({
        ...prev,
        recipientFirstName: firstName,
        recipientLastName: lastName,
        recipientEmail: user.email || '',
      }));
    }
  }, [user]);

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientFirstName.trim()) {
      newErrors.recipientFirstName = 'Vui lòng nhập tên';
    }
    if (!formData.recipientLastName.trim()) {
      newErrors.recipientLastName = 'Vui lòng nhập họ';
    }
    if (!formData.recipientPhone.trim()) {
      newErrors.recipientPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.recipientPhone)) {
      newErrors.recipientPhone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Email không hợp lệ';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }
    if (!formData.ward.trim()) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ cụ thể';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning');
      return;
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      showToast('Giỏ hàng trống', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`;

      if (!user) {
        // Guest checkout - Hỗ trợ tất cả payment methods
        const selectedMethod = paymentMethods.find(
          (m) => m.id === selectedPaymentMethodId,
        );

        if (!selectedMethod) {
          showToast('Vui lòng chọn phương thức thanh toán', 'warning');
          setIsProcessing(false);
          return;
        }

        // Nếu chọn thanh toán online (VNPay, Momo, ZaloPay...)
        // Lưu thông tin tạm vào localStorage để tạo order sau khi thanh toán thành công
        if (selectedMethod.code !== 'COD') {
          // Lưu thông tin guest order tạm thời
          const tempGuestOrder = {
            orderItems: cart.cartItems.map((item) => ({
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            })),
            notes: formData.notes || undefined,
            recipientInfo: {
              recipientFirstName: formData.recipientFirstName,
              recipientLastName: formData.recipientLastName,
              recipientPhone: formData.recipientPhone,
              recipientEmail: formData.recipientEmail,
              shippingRecipientAddress: shippingAddress,
              isAnotherReceiver: false,
            },
            paymentMethodId: selectedPaymentMethodId,
            totalAmount: cart.totalAmount,
          };

          localStorage.setItem(
            'pending_guest_order',
            JSON.stringify(tempGuestOrder),
          );

          // Redirect đến trang thanh toán (VNPay, Momo, ZaloPay...)
          if (selectedMethod.code === 'VNPAY') {
            // Tạo temporary order ID để tracking
            const tempOrderId = `TEMP-${Date.now()}`;
            const vnpayResponse = await createVNPayPayment({
              orderId: 0, // Temporary, sẽ tạo order thật sau khi thanh toán thành công
              amount: cart.totalAmount,
              orderInfo: `Guest Order - ${tempOrderId}`,
              language: 'vn',
            });

            if (vnpayResponse.success && vnpayResponse.paymentUrl) {
              // Lưu cart items để restore nếu thanh toán thất bại
              localStorage.setItem(
                'pending_cart',
                JSON.stringify(cart.cartItems),
              );
              window.location.href = vnpayResponse.paymentUrl;
            } else {
              throw new Error(
                vnpayResponse.message || 'Không thể tạo thanh toán VNPay',
              );
            }
          } else {
            // TODO: Implement other payment gateways (Momo, ZaloPay, etc.)
            showToast(
              `Phương thức thanh toán ${selectedMethod.name} đang được phát triển`,
              'info',
            );
            setIsProcessing(false);
          }
          return;
        }

        // COD - Tạo order ngay
        const guestOrderRequest: CreateGuestOrderRequest = {
          orderItems: cart.cartItems.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
          })),
          notes: formData.notes || undefined,
          recipientInfo: {
            recipientFirstName: formData.recipientFirstName,
            recipientLastName: formData.recipientLastName,
            recipientPhone: formData.recipientPhone,
            recipientEmail: formData.recipientEmail,
            shippingRecipientAddress: shippingAddress,
            isAnotherReceiver: false,
          },
          paymentMethodId: selectedPaymentMethodId,
        };

        const order = await createGuestOrder(guestOrderRequest);
        
        // Save guest email to localStorage for order retrieval
        localStorage.setItem(`guestOrder_${order.id}_email`, formData.recipientEmail);
        
        await clearCart();
        onNavigate?.(`/order-success/${order.id}`);
        return;
      }

      // Logged in user - create order via API
      const orderRequest: CreateOrderRequest = {
        userId: user.userId,
        orderItems: cart.cartItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
        notes: formData.notes || undefined,
        recipientInfo: {
          recipientFirstName: formData.recipientFirstName,
          recipientLastName: formData.recipientLastName,
          recipientPhone: formData.recipientPhone,
          recipientEmail: formData.recipientEmail,
          shippingRecipientAddress: shippingAddress,
          isAnotherReceiver: false,
        },
        paymentMethodId: selectedPaymentMethodId,
      };

      const order = await createOrder(orderRequest);

      // Check if payment method requires online payment (VNPay, Momo, ZaloPay, etc.)
      const selectedMethod = paymentMethods.find(
        (m) => m.id === selectedPaymentMethodId,
      );
      if (selectedMethod?.code === 'VNPAY') {
        const vnpayResponse = await createVNPayPayment({
          orderId: order.id,
          amount: cart.totalAmount,
          orderInfo: `Thanh toan don hang #${order.id} - BeautyBox`,
          language: 'vn',
        });

        if (vnpayResponse.success && vnpayResponse.paymentUrl) {
          // Show VNPay modal instead of redirecting
          setCurrentOrderId(order.id);
          setVnpayPaymentUrl(vnpayResponse.paymentUrl);
          setShowVNPayModal(true);
        } else {
          throw new Error(
            vnpayResponse.message || 'Không thể tạo thanh toán VNPay',
          );
        }
      } else {
        await clearCart();
        onNavigate?.(`/order-success/${order.id}`);
      }
    } catch (error: any) {
      console.error('Place order error:', error);
      showToast(
        error.response?.data?.error ||
          error.message ||
          'Có lỗi xảy ra khi đặt hàng',
        'error',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await updateQuantity(cartItemId, quantity);
      showToast('Đã cập nhật số lượng', 'success');
    } catch (error: any) {
      showToast(error.message || 'Không thể cập nhật số lượng', 'error');
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await removeItem(cartItemId);
        showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
      } catch (error: any) {
        showToast(error.message || 'Không thể xóa sản phẩm', 'error');
      }
    }
  };

  // VNPay Modal Handlers
  const handleVNPayModalClose = () => {
    setShowVNPayModal(false);
    setVnpayPaymentUrl('');
    // Don't clear currentOrderId immediately, user might want to check status
  };

  const handleVNPaySuccess = async () => {
    setShowVNPayModal(false);
    await clearCart();
    onNavigate?.(`/order-success/${currentOrderId}`);
  };

  const handleCheckPaymentStatus = async (): Promise<{ isPaid: boolean; status: string }> => {
    try {
      const order = await getOrderDetail(currentOrderId);
      const isPaid = order.paymentInfo?.status === 'PAID' || order.paymentInfo?.status === 'COMPLETED';
      return {
        isPaid,
        status: order.paymentInfo?.status || 'PENDING',
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { isPaid: false, status: 'UNKNOWN' };
    }
  };

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Giỏ hàng trống
          </h2>
          <button
            onClick={() => onNavigate?.('/products')}
            className="rounded-full bg-gradient-to-r from-[#f59e0b] via-[#d4145a] to-[#9333ea] px-8 py-3 font-semibold text-white"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
                Thông tin người nhận hàng
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Tên *"
                      value={formData.recipientFirstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientFirstName: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${errors.recipientFirstName ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                    />
                    {errors.recipientFirstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.recipientFirstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Họ *"
                      value={formData.recipientLastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientLastName: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${errors.recipientLastName ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                    />
                    {errors.recipientLastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.recipientLastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      placeholder="Số điện thoại *"
                      value={formData.recipientPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientPhone: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${errors.recipientPhone ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                    />
                    {errors.recipientPhone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.recipientPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email *"
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          recipientEmail: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border ${errors.recipientEmail ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                    />
                    {errors.recipientEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.recipientEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Địa chỉ nhận hàng
              </h2>

              <div className="space-y-4">
                <div>
                  <select
                    value={formData.province}
                    onChange={(e) => {
                      const provinceName = e.target.value;

                      setFormData((prev) => ({
                        ...prev,
                        province: provinceName,
                        district: '',
                        ward: '',
                      }));

                      const province = provinces.find(
                        (p) => p.name === provinceName,
                      );
                      if (province) {
                        fetchDistricts(province.code);
                      }
                    }}
                    className={`w-full rounded-lg border ${errors.province ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                  >
                    <option value="">Chọn Tỉnh/Thành phố *</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.province}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={formData.district}
                      onChange={(e) => {
                        const districtName = e.target.value;

                        setFormData((prev) => ({
                          ...prev,
                          district: districtName,
                          ward: '',
                        }));

                        const district = districts.find(
                          (d) => d.name === districtName,
                        );

                        if (district) fetchWards(district.code);
                      }}
                      disabled={!formData.province}
                      className={`w-full rounded-lg border ${errors.district ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100`}
                    >
                      <option value="">Chọn Quận/Huyện *</option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.district}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ward: e.target.value,
                        }))
                      }
                      disabled={!formData.district}
                      className={`w-full rounded-lg border ${errors.ward ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100`}
                    >
                      <option value="">Chọn Phường/Xã *</option>
                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.name}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                    {errors.ward && (
                      <p className="mt-1 text-xs text-red-500">{errors.ward}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường *"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className={`w-full rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Ghi chú đơn hàng (tùy chọn)"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Phương thức thanh toán
              </h2>

              {loadingPaymentMethods ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-pink-600"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedPaymentMethodId === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={isSelected}
                          onChange={() => setSelectedPaymentMethodId(method.id)}
                          className="mt-1 h-4 w-4 accent-pink-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {method.name}
                            </span>
                          </div>
                          {method.description && (
                            <p className="mt-1 text-xs text-gray-600">
                              {method.description}
                            </p>
                          )}
                          {!method.description && method.code === 'COD' && (
                            <p className="mt-1 text-xs text-gray-600">
                              Không chuyển khoản bất kỳ khoản tiền nào khi chưa
                              nhận được hàng
                            </p>
                          )}
                        </div>
                        <img
                          src={getPaymentIcon(method.icon)}
                          alt={method.name}
                          className="h-8 object-contain"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-gray-900">
                Đơn hàng
              </h2>

              <div className="mb-5 max-h-[400px] space-y-4 overflow-y-auto">
                {cart.cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    disabled={cartLoading || isProcessing}
                  />
                ))}
              </div>

              <div className="mb-5 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-bold text-gray-900">Miễn phí</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                  <span className="font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-pink-600">
                    {formatPrice(cart.totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cartLoading || loadingPaymentMethods}
                className="mb-4 w-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-3.5 text-sm font-bold tracking-wide text-white uppercase shadow-lg transition hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing
                  ? 'ĐANG XỬ LÝ...'
                  : loadingPaymentMethods
                    ? 'ĐANG TẢI...'
                    : 'ĐẶT HÀNG'}
              </button>

              <p className="text-center text-xs text-gray-500">
                Bằng việc đặt hàng, bạn đồng ý với{' '}
                <a href="#" className="text-pink-600 hover:underline">
                  Điều khoản sử dụng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VNPay Payment Modal */}
      <VNPayPaymentModal
        isOpen={showVNPayModal}
        paymentUrl={vnpayPaymentUrl}
        orderId={currentOrderId}
        amount={cart.totalAmount}
        orderInfo={`Thanh toán đơn hàng #${currentOrderId} - BeautyBox`}
        onClose={handleVNPayModalClose}
        onSuccess={handleVNPaySuccess}
        onCheckStatus={handleCheckPaymentStatus}
      />
    </div>
  );
}
