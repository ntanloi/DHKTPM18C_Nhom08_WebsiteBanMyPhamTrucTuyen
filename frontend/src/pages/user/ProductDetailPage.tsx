import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2, Star } from 'lucide-react';
import { useProductDetail } from '../../hooks/useProductDetail';
import { useCart } from '../../context/CartContext';
import { AuthContext } from '../../context/auth-context';
import { useNavigation } from '../../context/NavigationContext';

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
  const { user } = authContext;
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

    setIsAddingToCart(true);
    try {
      const price = selectedVariant.salePrice || selectedVariant.price;
      const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
      await addToCart(
        selectedVariant.id, 
        quantity,
        product.name,
        selectedVariant.name,
        price,
        imageUrl
      );
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error: any) {
      alert(error.message || 'Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
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

    setIsAddingToCart(true);
    try {
      const price = selectedVariant.salePrice || selectedVariant.price;
      const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '';
      await addToCart(
        selectedVariant.id, 
        quantity,
        product.name,
        selectedVariant.name,
        price,
        imageUrl
      );
      navigate('/checkout');
    } catch (error: any) {
      alert(error.message || 'Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
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
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left - Images */}
        <div>
          {/* Main Image */}
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-pink-50">
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
          <div className="flex gap-2">
            {displayImages.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div>
          <div className="mb-2 text-sm font-bold text-red-500">
            {product.brandName}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mb-4 flex items-center gap-3 text-sm">
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
            <div className="mb-6">
              <div className="mb-3 text-base font-semibold">
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
            <div className="mb-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                {formatPrice(
                  selectedVariant.salePrice || selectedVariant.price,
                )}
              </span>
              {selectedVariant.salePrice &&
                selectedVariant.salePrice < selectedVariant.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(selectedVariant.price)}
                    </span>
                    <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
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
          <div className="mb-6 rounded-lg border border-gray-300 p-5">
            <div className="mb-4 text-base font-semibold">
              Hình thức mua hàng
            </div>

            <label className="mb-3 flex cursor-pointer items-center">
              <input
                type="radio"
                name="delivery"
                value="home"
                checked={deliveryMethod === 'home'}
                onChange={() => setDeliveryMethod('home')}
                className="mr-3 h-4 w-4"
              />
              <span className="text-base">Giao hàng tận nơi</span>
            </label>

            <label className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={() => setDeliveryMethod('pickup')}
                className="mr-3 h-4 w-4"
              />
              <span className="text-base">
                Click & Collect - Mua và lấy hàng tại cửa hàng
              </span>
            </label>
          </div>

          {/* Quantity and Actions */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border-2 border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-5 py-3 text-xl hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-16 text-center text-lg font-semibold">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-5 py-3 text-xl hover:bg-gray-100"
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
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-base font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0 || isAddingToCart}
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
            </button>

            <button
              onClick={handleBuyNow}
              className="rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 px-8 py-3 text-base font-semibold whitespace-nowrap text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedVariant || selectedVariant.stockQuantity === 0 || isAddingToCart}
            >
              {isAddingToCart ? 'Đang xử lý...' : 'MUA NGAY'}
            </button>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100"
            >
              <Heart
                size={22}
                className={
                  isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
                }
              />
            </button>

            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100">
              <Share2 size={22} className="stroke-gray-600" />
            </button>
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
            <div>
              <div className="mb-8 rounded-lg bg-gray-50 p-6">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-5xl font-bold">5.0</div>
                  <div className="mb-2 flex justify-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        className="fill-black stroke-black"
                      />
                    ))}
                  </div>
                  <div className="text-gray-600">Chưa có đánh giá</div>
                </div>
              </div>

              <div className="text-center text-gray-500">
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                <p className="mt-2">Hãy là người đầu tiên đánh giá sản phẩm!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
