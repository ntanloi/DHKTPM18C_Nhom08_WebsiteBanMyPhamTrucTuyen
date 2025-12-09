import React from 'react';
import type { CouponResponse } from '../../../api/coupon';
import CouponStatusBadge from './CouponStatusBadge';
import { Toast } from '../../user/ui/Toast';
import { useToast } from '../../../hooks/useToast';

interface CouponTableProps {
  coupons: CouponResponse[];
  onView: (couponId: number) => void;
  onEdit: (couponId: number) => void;
  onDeactivate: (couponId: number) => void;
  onDelete: (couponId: number) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  onView,
  onEdit,
  onDeactivate,
  onDelete,
}) => {
  const { toast, showToast, hideToast } = useToast();

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Đã sao chép mã: ${code}`, 'success');
  };

  const getDiscountDisplay = (
    type: string,
    value: number,
  ): { text: string; color: string } => {
    if (type === 'percentage') {
      return {
        text: `-${value}%`,
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
      };
    }
    return {
      text: `-${formatCurrency(value)}`,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
    };
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="from-gray-50 to-pink-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ID
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Mã Coupon
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Mô tả
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Giảm giá
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Điều kiện
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Thời gian
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Trạng thái
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-700 uppercase">
                <div className="flex items-center justify-end gap-2">
                  <svg
                    className="h-4 w-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                  Thao tác
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {coupons.map((coupon) => {
              const discount = getDiscountDisplay(
                coupon.discountType,
                coupon.discountValue,
              );
              return (
                <tr
                  key={coupon.id}
                  className="transition-colors hover:bg-pink-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-bold text-pink-700">
                      #{coupon.id}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl from-pink-400 to-purple-500 shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-pink-600">
                            {coupon.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-pink-600"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Sao chép
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-xs px-6 py-4">
                    <div className="text-sm leading-relaxed text-gray-900">
                      {coupon.description.length > 60
                        ? `${coupon.description.substring(0, 60)}...`
                        : coupon.description}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-lg ${discount.color}`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {discount.text}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                        <svg
                          className="h-4 w-4 text-blue-600"
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
                        <div className="text-xs">
                          <span className="font-medium text-blue-700">
                            Tối thiểu:
                          </span>{' '}
                          <span className="font-bold text-blue-900">
                            {formatCurrency(coupon.minOrderValue || 0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                        <svg
                          className="h-4 w-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-xs">
                          <span className="font-medium text-green-700">
                            Tối đa:
                          </span>{' '}
                          <span className="font-bold text-green-900">
                            {formatCurrency(coupon.maxUsageValue || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
                        <svg
                          className="h-4 w-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-green-700">
                          {formatDate(coupon.validFrom || '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                        <svg
                          className="h-4 w-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-red-700">
                          {formatDate(coupon.validTo || '')}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <CouponStatusBadge
                      isActive={coupon.isActive}
                      validFrom={coupon.validFrom || ''}
                      validTo={coupon.validTo || ''}
                    />
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(coupon.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-200"
                        title="Xem chi tiết"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(coupon.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-200"
                        title="Chỉnh sửa"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      {coupon.isActive && (
                        <button
                          onClick={() => onDeactivate(coupon.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700 transition-all hover:bg-orange-200"
                          title="Vô hiệu hóa"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(coupon.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-200"
                        title="Xóa"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default CouponTable;