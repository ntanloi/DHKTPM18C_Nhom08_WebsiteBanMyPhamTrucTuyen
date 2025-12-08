import { Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { CouponResponse } from '../../../api/coupon';

interface CouponsTabProps {
  coupons: CouponResponse[];
}

export default function CouponsTab({ coupons }: CouponsTabProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getDiscountText = (coupon: CouponResponse) => {
    if (coupon.discountType === 'PERCENTAGE') {
      return `Giảm ${coupon.discountValue}%`;
    } else if (coupon.discountType === 'FIXED') {
      return `Giảm ${coupon.discountValue.toLocaleString()}đ`;
    } else {
      return 'Miễn phí vận chuyển';
    }
  };

  const handleUseCoupon = () => {
    navigate('/products');
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Ưu đãi của tôi</h2>

      {coupons.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="overflow-hidden rounded-lg border-2 border-purple-200 transition hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Tag size={20} />
                      <span className="text-xl font-bold">{coupon.code}</span>
                    </div>
                    <p className="text-sm opacity-90">{coupon.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {getDiscountText(coupon)}
                    </div>
                    {coupon.maxUsageValue > 0 && (
                      <div className="mt-1 text-xs">
                        Tối đa {coupon.maxUsageValue.toLocaleString()}đ
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đơn tối thiểu:</span>
                    <span className="font-semibold">
                      {coupon.minOrderValue.toLocaleString()}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Có hiệu lực:</span>
                    <span className="font-semibold">
                      {formatDate(coupon.validFrom)} -{' '}
                      {formatDate(coupon.validTo)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleUseCoupon}
                  className="mt-4 w-full rounded-lg bg-purple-600 py-2 font-semibold text-white transition hover:bg-purple-700"
                >
                  Sử dụng ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <Tag size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg text-gray-500">Bạn chưa có mã giảm giá nào</p>
          <button
            onClick={handleUseCoupon}
            className="mt-4 rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
          >
            Khám phá ưu đãi
          </button>
        </div>
      )}
    </div>
  );
}
