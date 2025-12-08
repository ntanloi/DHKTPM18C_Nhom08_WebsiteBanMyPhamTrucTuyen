import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/auth-context';
import { useNavigation } from '../../context/NavigationContext';
import ReviewSection from '../../components/user/ui/ReviewSection';
import { Toast, type ToastType } from '../../components/user/ui/Toast';

interface ProductDetailPageProps {
  productSlug?: string;
  productId?: number;
}

const ProductDetailPage = ({
  productSlug,
  productId,
}: ProductDetailPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('home');
  const [activeTab, setActiveTab] = useState('intro');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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

  // Determine which identifier to use (prefer slug over id)
  const identifier = productSlug || productId;
  const identifierType = productSlug ? 'slug' : 'id';

  const { product, variants, selectedVariant, loading, error, selectVariant } =
    useProductDetail(identifier || null, identifierType);

  const { addToCart } = useCart();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('ProductDetailPage must be used within AuthProvider');
  }
  const { user: _user } = authContext;
  const { navigate } = useNavigation();

  // Reset states when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
    setActiveTab('intro');
  }, [identifier]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev + 1) % (product.images?.length || 1),
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex(
        (prev) =>
          (prev - 1 + (product.images?.length || 1)) %
          (product.images?.length || 1),
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {error || 'Không tìm thấy sản phẩm'}
          </h2>
          <a
            href="/"
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Quay về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : ['https://via.placeholder.com/400'];

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      showToast('Vui lòng chọn phiên bản sản phẩm', 'warning');
      return;
    }

    if (selectedVariant.stockQuantity === 0) {
      showToast('Sản phẩm đã hết hàng', 'error');
      return;
    }

    if (quantity > selectedVariant.stockQuantity) {
      showToast(
        `Chỉ còn ${selectedVariant.stockQuantity} sản phẩm trong kho`,
        'warning',
      );
      return;
    }

    setIsAddingToCart(true);
    try {
      const price = selectedVariant.salePrice || selectedVariant.price;
      const imageUrl =
        product.images && product.images.length > 0 ? product.images[0] : '';
      await addToCart(
        selectedVariant.id,
        quantity,
        product.name,
        selectedVariant.name,
        price,
        imageUrl,
      );
      showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
    } catch (error: any) {
      showToast(
        error.message || 'Không thể thêm sản phẩm vào giỏ hàng',
        'error',
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      showToast('Vui lòng chọn phiên bản sản phẩm', 'warning');
      return;
    }

    if (selectedVariant.stockQuantity === 0) {
      showToast('Sản phẩm đã hết hàng', 'error');
      return;
    }

    if (quantity > selectedVariant.stockQuantity) {
      showToast(
        `Chỉ còn ${selectedVariant.stockQuantity} sản phẩm trong kho`,
        'warning',
      );
      return;
    }

    setIsAddingToCart(true);
    try {
      const price = selectedVariant.salePrice || selectedVariant.price;
      const imageUrl =
        product.images && product.images.length > 0 ? product.images[0] : '';
      await addToCart(
        selectedVariant.id,
        quantity,
        product.name,
        selectedVariant.name,
        price,
        imageUrl,
      );
      navigate('/checkout');
    } catch (error: any) {
      showToast(
        error.message || 'Không thể thêm sản phẩm vào giỏ hàng',
        'error',
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

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

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600 sm:mb-6 sm:text-sm">
          <a
            href="/"
            className="hover:text-black"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Trang chủ
          </a>
          <span>/</span>
          <a
            href="/products"
            className="hover:text-black"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/products');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            Sản phẩm
          </a>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:gap-8 lg:grid-cols-2">
          {/* Left - Images */}
          <div>
            {/* Main Image */}
            <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-pink-50 sm:mb-4">
              <img
                src={displayImages[currentImageIndex]}
                alt={product.name}
                className="h-full w-full object-cover"
              />

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {displayImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${
                    index === currentImageIndex
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            <div className="mb-2 text-xs font-bold text-red-500 sm:text-sm">
              {product.brandName}
            </div>

            <h1 className="mb-3 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl lg:text-3xl">
              {product.name}
            </h1>

            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:mb-4 sm:gap-3 sm:text-sm">
              <span className="text-gray-600">
                Danh mục: {product.categoryName}
              </span>
              {selectedVariant && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    SKU: {selectedVariant.sku}
                  </span>
                </>
              )}
            </div>

            {/* Variants Selection */}
            {variants.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <div className="mb-2 text-sm font-semibold sm:mb-3 sm:text-base">
                  Chọn phiên bản:
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => selectVariant(variant.id)}
                      disabled={variant.stockQuantity === 0}
                      className={`rounded-lg border px-4 py-2 text-sm transition-all ${
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
              <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-4">
                <span className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                  {formatPrice(
                    selectedVariant.salePrice || selectedVariant.price,
                  )}
                </span>
                {selectedVariant.salePrice &&
                  selectedVariant.salePrice < selectedVariant.price && (
                    <>
                      <span className="text-base text-gray-400 line-through sm:text-lg lg:text-xl">
                        {formatPrice(selectedVariant.price)}
                      </span>
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white sm:px-3 sm:py-1 sm:text-sm">
                        -
                        {calculateDiscount(
                          selectedVariant.price,
                          selectedVariant.salePrice,
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

            {/* Variant Attributes */}
            {selectedVariant?.attributes &&
              selectedVariant.attributes.length > 0 && (
                <div className="mb-6 rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 font-semibold">Thông số:</div>
                  {selectedVariant.attributes.map((attr) => (
                    <div key={attr.id} className="text-sm">
                      <strong>{attr.name}:</strong> {attr.value}
                    </div>
                  ))}
                </div>
              )}

            {/* Delivery Method */}
            <div className="mb-4 rounded-lg border border-gray-300 p-3 sm:mb-6 sm:p-5">
              <div className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">
                Hình thức mua hàng
              </div>

              <label className="mb-2 flex cursor-pointer items-center sm:mb-3">
                <input
                  type="radio"
                  name="delivery"
                  value="home"
                  checked={deliveryMethod === 'home'}
                  onChange={() => setDeliveryMethod('home')}
                  className="mr-2 h-4 w-4 sm:mr-3"
                />
                <span className="text-sm sm:text-base">Giao hàng tận nơi</span>
              </label>

              <label className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                  className="mr-2 h-4 w-4 sm:mr-3"
                />
                <span className="text-sm sm:text-base">
                  Click & Collect - Mua và lấy hàng tại cửa hàng
                </span>
              </label>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-4 space-y-3 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center rounded-lg border-2 border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-lg hover:bg-gray-100 sm:px-5 sm:py-3 sm:text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-base font-semibold sm:w-16 sm:text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-lg hover:bg-gray-100 sm:px-5 sm:py-3 sm:text-xl"
                    disabled={
                      selectedVariant
                        ? quantity >= selectedVariant.stockQuantity
                        : false
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-6 sm:py-3 sm:text-base"
                  disabled={
                    !selectedVariant ||
                    selectedVariant.stockQuantity === 0 ||
                    isAddingToCart
                  }
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
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
                  <span className="hidden sm:inline">
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
                  </span>
                  <span className="sm:hidden">
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm'}
                  </span>
                </button>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-3 sm:text-base"
                  disabled={
                    !selectedVariant ||
                    selectedVariant.stockQuantity === 0 ||
                    isAddingToCart
                  }
                >
                  {isAddingToCart ? 'Đang xử lý...' : 'MUA NGAY'}
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100 sm:h-12 sm:w-12"
                >
                  <Heart
                    size={20}
                    className={
                      isFavorite
                        ? 'fill-red-500 stroke-red-500'
                        : 'stroke-gray-600'
                    }
                  />
                </button>

                <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100 sm:h-12 sm:w-12">
                  <Share2 size={20} className="stroke-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-gray-200">
          <div className="mb-8 flex justify-center gap-12 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('intro')}
              className={`pt-6 pb-4 text-lg font-semibold transition-all ${
                activeTab === 'intro'
                  ? 'border-b-3 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={
                activeTab === 'intro'
                  ? { borderBottomWidth: '3px', borderBottomColor: '#000' }
                  : {}
              }
            >
              Giới thiệu
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pt-6 pb-4 text-lg font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'border-b-3 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              style={
                activeTab === 'reviews'
                  ? { borderBottomWidth: '3px', borderBottomColor: '#000' }
                  : {}
              }
            >
              Đánh giá
            </button>
          </div>

          {/* Tab Content */}
          <div className="mx-auto max-w-4xl">
            {activeTab === 'intro' && (
              <div className="prose max-w-none">
                <h2 className="mb-4 text-2xl font-bold">Mô tả sản phẩm</h2>
                <div className="mb-4 leading-relaxed whitespace-pre-wrap text-gray-700">
                  {product.description ||
                    'Chưa có mô tả chi tiết cho sản phẩm này.'}
                </div>

                <h3 className="mb-3 text-xl font-bold">Thông tin sản phẩm</h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Thương hiệu:</strong> {product.brandName}
                  </p>
                  <p>
                    <strong>Danh mục:</strong> {product.categoryName}
                  </p>
                  {selectedVariant && (
                    <p>
                      <strong>SKU:</strong> {selectedVariant.sku}
                    </p>
                  )}
                  <p>
                    <strong>Trạng thái:</strong>{' '}
                    {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection
                productId={product.id}
                productName={product.name}
                productImage={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
