import React from 'react';
import type { OrderItem } from '../../../types/OrderItem';
import { formatCurrency } from '../../../utils/orderStatusUtils';

interface OrderItemsTableProps {
  items: OrderItem[];
  showActions?: boolean;
  onRemoveItem?: (itemId: number) => void;
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({
  items,
  showActions = false,
  onRemoveItem,
}) => {
  const calculateItemTotal = (item: OrderItem): number => {
    const price =
      item.productVariant?.salePrice || item.productVariant?.price || 0;
    return price * item.quantity;
  };

  const calculateTotalAmount = (): number => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <p className="text-gray-500">Không có sản phẩm nào trong đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Sản phẩm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Đơn giá
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                Số lượng
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Thành tiền
              </th>
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {items.map((item) => {
              const variant = item.productVariant;
              const price = variant?.salePrice || variant?.price || 0;
              const originalPrice = variant?.price || 0;
              const hasDiscount =
                variant?.salePrice && variant.salePrice < originalPrice;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {variant?.name || 'N/A'}
                        </p>
                        {variant?.product && (
                          <p className="text-xs text-gray-500">
                            {variant.product.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                      {variant?.sku || 'N/A'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatCurrency(originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(calculateItemTotal(item))}
                    </span>
                  </td>

                  {showActions && onRemoveItem && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa sản phẩm"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>

          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan={showActions ? 4 : 4}
                className="px-6 py-4 text-right text-sm font-bold text-gray-900"
              >
                Tổng cộng:
              </td>
              <td
                className="px-6 py-4 text-right text-base font-bold whitespace-nowrap text-pink-600"
                colSpan={showActions ? 2 : 1}
              >
                {formatCurrency(calculateTotalAmount())}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsTable;
