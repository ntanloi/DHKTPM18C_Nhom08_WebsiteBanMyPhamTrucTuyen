import { Minus, Plus, X } from 'lucide-react';
import type { CartItemResponse } from '../../../api/cart';

interface CartItemCardProps {
  item: CartItemResponse;
  onUpdateQuantity: (cartItemId: number, quantity: number) => void;
  onRemove: (cartItemId: number) => void;
  disabled?: boolean;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false,
}: CartItemCardProps) {
  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-3">
      <div className="relative flex-shrink-0">
        <div className="h-[90px] w-[90px] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img
            src={
              item.imageUrl || 'https://via.placeholder.com/90?text=No+Image'
            }
            alt={item.productName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/90?text=No+Image';
            }}
          />
        </div>
        <button
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[11px] font-bold text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={12} strokeWidth={3} />
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-2 line-clamp-2 text-[13px] leading-tight font-medium text-gray-900">
          {item.productName}
        </p>
        <p className="mb-1 text-[11px] text-gray-500">
          Phân loại: {item.variantName}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-gray-300">
            <button
              onClick={handleDecrease}
              disabled={disabled || item.quantity <= 1}
              className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="px-3 text-[13px] font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={disabled}
              className="flex h-7 w-7 items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-bold text-gray-900">
              {formatPrice(item.subtotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[11px] text-gray-500">
                {formatPrice(item.price)} x {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
