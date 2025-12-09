import { useState, useEffect, useContext } from 'react';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { useCart } from '../../../context/CartContext';
import { useNavigation } from '../../../context/NavigationContext';
import { useFavorites } from '../../../context/FavoriteContext';
import { AuthContext } from '../../../context/auth-context';
import { Toast, type ToastType } from '../ui/Toast';

interface ProductCardProps {
  id: number;
  slug?: string;
  name: string;
  brandName?: string;
  categoryName?: string;
  description?: string;
  images?: string[];
  freeShip?: boolean;
  badge?: string;
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

const QuickViewModal = ({
  isOpen,
  onClose,
  productId,
}: QuickViewModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('home');

  const { product, variants, selectedVariant, loading, error, selectVariant } =
    useProductDetail(productId, 'id');

  const { addToCart } = useCart();
  const { navigate } = useNavigation();
  const [isAdding, setIsAdding] = useState(false);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();

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

  const isFavorite = isFavorited(productId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'warning');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(productId);
        showToast('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        await addToFavorites(productId);
        showToast('Đã thêm vào danh sách yêu thích', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Có lỗi xảy ra', 'error');
    }
  };

  console.log(product);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [productId]);

  if (!isOpen) return null;

  const styles = `
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
`;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  const modalContent = (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', margin: 0 }}
        onClick={onClose}
      >
        <div
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-lg">Đang tải...</div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-lg text-red-500">Lỗi: {error}</div>
            </div>
          ) : product ? (
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full bg-pink-50 md:w-1/2">
                <div className="relative aspect-square">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[currentImageIndex]
                        : 'https://via.placeholder.com/400'
                    }
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'w-8 bg-black'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full p-6 md:w-1/2">
                <div className="mb-2 text-sm font-bold text-red-500">
                  {product?.brandName || 'Brand'}
                </div>

                <h2 className="mb-3 text-xl font-bold text-gray-900">
                  {product?.name || 'Product'}
                </h2>

                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-600">
                    Danh mục: {product?.categoryName || 'N/A'}
                  </span>
                  {selectedVariant && (
                    <span className="text-gray-600">
                      • SKU: {selectedVariant.sku}
                    </span>
                  )}
                </div>

                {variants.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-semibold">
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

                {selectedVariant && (
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(
                        selectedVariant.salePrice || selectedVariant.price,
                      )}
                    </span>
                    {selectedVariant.salePrice &&
                      selectedVariant.salePrice < selectedVariant.price && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(selectedVariant.price)}
                          </span>
                          <span className="rounded bg-red-500 px-2 py-1 text-sm font-bold text-white">
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

                {selectedVariant?.attributes &&
                  selectedVariant.attributes.length > 0 && (
                    <div className="mb-4 rounded-lg border border-gray-200 p-3">
                      <div className="mb-2 font-semibold">Thông số:</div>
                      {selectedVariant.attributes.map((attr) => (
                        <div key={attr.id} className="text-sm">
                          <strong>{attr.name}:</strong> {attr.value}
                        </div>
                      ))}
                    </div>
                  )}

                <div className="mb-4 rounded-lg border border-gray-300 p-4">
                  <div className="mb-3 font-semibold">Hình thức mua hàng</div>
                  <label className="mb-2 flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="home"
                      checked={deliveryMethod === 'home'}
                      onChange={() => setDeliveryMethod('home')}
                      className="mr-2"
                    />
                    <span>Giao hàng</span>
                  </label>
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                      className="mr-2"
                    />
                    <span>Click & Collect - Mua và lấy hàng tại cửa hàng</span>
                  </label>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100"
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
                    onClick={async () => {
                      if (!selectedVariant || !product) return;

                      setIsAdding(true);
                      try {
                        const price =
                          selectedVariant.salePrice || selectedVariant.price;
                        const imageUrl =
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://via.placeholder.com/400';
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
                          error.message ||
                            'Không thể thêm sản phẩm vào giỏ hàng',
                          'error',
                        );
                      } finally {
                        setIsAdding(false);
                      }
                    }}
                    className="flex min-w-[150px] flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stockQuantity === 0 ||
                      isAdding
                    }
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
                    {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ'}
                  </button>

                  <button
                    onClick={async () => {
                      if (!selectedVariant || !product) return;

                      setIsAdding(true);
                      try {
                        const price =
                          selectedVariant.salePrice || selectedVariant.price;
                        const imageUrl =
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://via.placeholder.com/400';
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
                          error.message ||
                            'Không thể thêm sản phẩm vào giỏ hàng',
                          'error',
                        );
                      } finally {
                        setIsAdding(false);
                      }
                    }}
                    className="rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 px-6 py-3 text-sm font-semibold whitespace-nowrap text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stockQuantity === 0 ||
                      isAdding
                    }
                  >
                    {isAdding ? 'Đang xử lý...' : 'MUA NGAY'}
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
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
                </div>

                <button
                  className="w-full text-sm text-gray-600 underline"
                  onClick={() => {
                    const url = product?.slug
                      ? `/product/${product.slug}`
                      : `/product/${product?.id}`;
                    window.location.href = url;
                  }}
                >
                  Xem chi tiết sản phẩm
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  return createPortal(
    <>
      <style>{styles}</style>
      {modalContent}
    </>,
    document.body,
  );
};

const ProductCard = ({
  id,
  slug,
  name,
  brandName = 'Brand',
  categoryName = 'Category',
  images = [],
  freeShip = true,
  badge,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { product, variants, selectedVariant, loading } = useProductDetail(
    id,
    'id',
  );

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();

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

  const isFavorite = isFavorited(id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'warning');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(id);
        showToast('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        await addToFavorites(id);
        showToast('Đã thêm vào danh sách yêu thích', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Có lỗi xảy ra', 'error');
    }
  };

  const navigateToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = slug ? `/product/${slug}` : `/product/${id}`;
    window.location.href = url;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Get display images from product data or props
  const displayImages =
    product?.images && product.images.length > 0
      ? product.images
      : images && images.length > 0
        ? images
        : ['https://via.placeholder.com/400'];

  // Ensure we have at least 2 images for hover effect
  const image1 = displayImages[0] || 'https://via.placeholder.com/400';
  const image2 =
    displayImages[1] || displayImages[0] || 'https://via.placeholder.com/400';

  const priceVariant =
    selectedVariant || (variants.length > 0 ? variants[0] : null);

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}
      <div
        className="w-80 overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative aspect-square cursor-pointer overflow-hidden"
          onClick={navigateToDetail}
        >
          <img
            src={image1}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/400?text=No+Image';
            }}
          />
          <img
            src={image2}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => {
              e.currentTarget.src =
                'https://via.placeholder.com/400?text=No+Image';
            }}
          />

          {badge && (
            <div className="absolute top-3 left-3 flex h-12 w-12 items-center justify-center rounded-full bg-black font-bold text-white">
              {badge}
            </div>
          )}

          <button
            className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-100"
            onClick={handleToggleFavorite}
          >
            <Heart
              size={20}
              className={
                isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
              }
            />
          </button>

          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <button
              className={`cursor-pointer rounded-full bg-gradient-to-r px-8 py-3 font-semibold transition-all ${
                isButtonHovered
                  ? 'from-yellow-400 to-purple-500 text-white shadow-lg'
                  : 'bg-black text-white'
              }`}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              Xem nhanh
            </button>
          </div>

          {freeShip && (
            <div className="absolute bottom-3 left-3">
              <div className="rounded bg-gradient-to-r from-pink-400 to-pink-300 px-4 py-1 text-sm font-bold text-white">
                FREESHIP
              </div>
            </div>
          )}
        </div>

        <div className="p-4" onClick={navigateToDetail}>
          <div className="mb-1 text-center font-bold text-gray-900">
            {brandName}
          </div>

          <div className="mb-1 text-center text-sm text-gray-600">
            {categoryName}
          </div>

          <div className="mb-3 line-clamp-2 text-center text-gray-800">
            {name}
          </div>

          {!loading && priceVariant && (
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(priceVariant.salePrice || priceVariant.price)}
              </span>
              {priceVariant.salePrice &&
                priceVariant.salePrice < priceVariant.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(priceVariant.price)}
                    </span>
                    <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      -
                      {calculateDiscount(
                        priceVariant.price,
                        priceVariant.salePrice,
                      )}
                      %
                    </span>
                  </>
                )}
            </div>
          )}

          {variants.length > 1 && (
            <div
              className={`flex items-center justify-center gap-1 text-sm text-gray-600 transition-all duration-300 ${
                isHovered ? 'mb-3 max-h-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {variants.length} phiên bản
            </div>
          )}

          {priceVariant && priceVariant.stockQuantity === 0 && (
            <div className="mb-2 text-center text-sm text-red-500">
              Hết hàng
            </div>
          )}
        </div>
      </div>

      <QuickViewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={id}
      />
    </>
  );
};

export default ProductCard;
