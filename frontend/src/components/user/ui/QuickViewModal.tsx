import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brandName: string;
  categoryName: string;
  images: string[];
  variants: ProductVariant[];
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
}: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    if (selectedVariant.stockQuantity === 0) {
      alert('Sản phẩm đã hết hàng');
      return;
    }

    if (quantity > selectedVariant.stockQuantity) {
      alert(`Chỉ còn ${selectedVariant.stockQuantity} sản phẩm trong kho`);
      return;
    }

    setIsAdding(true);
    try {
      const price = selectedVariant.salePrice || selectedVariant.price;
      await addToCart(
        selectedVariant.id,
        quantity,
        product.name,
        selectedVariant.name,
        price
      );
      alert('Đã thêm sản phẩm vào giỏ hàng');
      onClose();
    } catch (error: any) {
      alert(error.message || 'Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Left - Image */}
          <div>
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[0] || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            <div className="mb-2 text-sm font-bold text-red-500">
              {product.brandName}
            </div>

            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {product.name}
            </h2>

            <div className="mb-4 text-sm text-gray-600">
              Danh mục: {product.categoryName}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 text-sm font-semibold">Chọn phiên bản:</div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stockQuantity === 0}
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-black bg-black text-white'
                          : variant.stockQuantity === 0
                            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div>{variant.name}</div>
                      {variant.stockQuantity === 0 && (
                        <div className="text-xs">(Hết hàng)</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {selectedVariant && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(
                    selectedVariant.salePrice || selectedVariant.price
                  )}
                </span>
                {selectedVariant.salePrice &&
                  selectedVariant.salePrice < selectedVariant.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(selectedVariant.price)}
                      </span>
                      <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                        -
                        {calculateDiscount(
                          selectedVariant.price,
                          selectedVariant.salePrice
                        )}
                        %
                      </span>
                    </>
                  )}
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant && (
              <div className="mb-4 text-sm">
                <span
                  className={
                    selectedVariant.stockQuantity > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {selectedVariant.stockQuantity > 0
                    ? `Còn ${selectedVariant.stockQuantity} sản phẩm`
                    : 'Hết hàng'}
                </span>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <div className="mb-2 text-sm font-semibold">Số lượng:</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border-2 border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-base font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-lg hover:bg-gray-100"
                    disabled={
                      selectedVariant
                        ? quantity >= selectedVariant.stockQuantity
                        : false
                    }
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stockQuantity === 0 ||
                isAdding
              }
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 py-3 text-base font-bold text-white shadow-lg transition hover:opacity-95 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={20} />
              {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>

            {/* Description */}
            {product.description && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="mb-2 text-sm font-semibold">Mô tả:</div>
                <p className="line-clamp-3 text-sm text-gray-600">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
