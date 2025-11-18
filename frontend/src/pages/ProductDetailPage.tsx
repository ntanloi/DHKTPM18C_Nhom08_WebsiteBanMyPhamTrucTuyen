import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Share2, Star } from 'lucide-react';

// Import tất cả danh sách sản phẩm
import {
  bestSellingProducts,
  flashSaleProducts,
  newProducts,
  skincareProducts,
  makeupProducts,
} from '../components/ui/ProductCard';

const ProductDetailPage = ({ productId }: { productId?: string }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('home');
  const [activeTab, setActiveTab] = useState('intro');
  const [isFavorite, setIsFavorite] = useState(false);

  // Tìm sản phẩm từ tất cả các danh sách
  const findProductById = (id?: string) => {
    if (!id) return null;

    const allProducts = [
      ...bestSellingProducts,
      ...flashSaleProducts,
      ...newProducts,
      ...skincareProducts,
      ...makeupProducts,
    ];

    return allProducts.find((p) => p.id === id);
  };

  const productData = findProductById(productId);

  // Nếu không tìm thấy sản phẩm, hiển thị thông báo
  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Không tìm thấy sản phẩm
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

  // Chuyển đổi dữ liệu từ ProductCard sang format ProductDetail
  const product = {
    images: productData.images,
    brand: productData.brand,
    name: productData.name,
    price: productData.price,
    oldPrice: productData.oldPrice || undefined,
    discount: productData.discount || undefined,
    rating: productData.rating,
    reviewCount: productData.reviewCount,
    colors: productData.colors || undefined,
    sku: '11112238',
    origin: 'Hàn Quốc',
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
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
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="h-full w-full object-cover"
            />

            {product.images.length > 1 && (
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
            {product.images.map((img, index) => (
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
            {product.brand}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <div className="mb-4 flex items-center gap-3 text-sm">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  size={16}
                  className={
                    index < product.rating
                      ? 'fill-black stroke-black'
                      : 'fill-gray-300 stroke-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              ({product.reviewCount} đánh giá)
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Xuất xứ: {product.origin}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">SKU: {product.sku}</span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <span className="text-4xl font-bold text-gray-900">
              {product.price}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {product.oldPrice}
                </span>
                {product.discount && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    {product.discount}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 text-base font-semibold">
                Màu sắc: {selectedColor + 1}. Oat Fig - hồng đất
              </div>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`h-12 w-12 rounded-full border-2 transition-all ${
                      selectedColor === index
                        ? 'scale-110 border-gray-800'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
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
                Click & Collect - Mua và lấy hàng tại cửa hàng{' '}
                <span className="text-blue-600 underline">Chọn cửa hàng</span>
              </span>
            </label>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>24 / 26 chi nhánh còn mặt hàng này</span>
              <button className="ml-auto text-blue-600 underline hover:text-blue-700">
                Xem tất cả các cửa hàng ›
              </button>
            </div>
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
              >
                +
              </button>
            </div>

            <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-base font-semibold text-white hover:bg-gray-800">
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
              Thêm vào giỏ
            </button>

            <button className="rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 px-8 py-3 text-base font-semibold whitespace-nowrap text-white hover:shadow-lg">
              MUA NGAY
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
            Đánh giá ({product.reviewCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mx-auto max-w-4xl">
          {activeTab === 'intro' && (
            <div className="prose max-w-none">
              <h2 className="mb-4 text-2xl font-bold">Mô tả sản phẩm</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                {product.name} mang đến cho bạn vẻ đẹp tự nhiên với công thức
                lành tính, chất lượng cao. Sản phẩm được thiết kế với sự tỉ mỉ,
                từ màu sắc đến kết cấu, giúp bạn dễ dàng tạo nên những look hoàn
                hảo cho mọi dịp.
              </p>

              <h3 className="mb-3 text-xl font-bold">Đặc điểm nổi bật</h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
                <li>Công thức cao cấp, an toàn cho làn da</li>
                <li>Màu sắc đa dạng, dễ dàng phối hợp</li>
                <li>Độ bám màu cao, lên màu chuẩn</li>
                <li>Chất liệu mịn mượt, dễ tán đều</li>
                <li>Không gây kích ứng, phù hợp với mọi loại da</li>
              </ul>

              <h3 className="mb-3 text-xl font-bold">Hướng dẫn sử dụng</h3>
              <ol className="mb-4 list-decimal space-y-2 pl-6 text-gray-700">
                <li>Sử dụng công cụ trang điểm hoặc đầu ngón tay</li>
                <li>Tán đều theo ý muốn</li>
                <li>Có thể kết hợp nhiều sản phẩm để tạo hiệu ứng đẹp mắt</li>
                <li>Kết hợp với các sản phẩm khác để hoàn thiện look</li>
              </ol>

              <h3 className="mb-3 text-xl font-bold">Thông tin sản phẩm</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Thương hiệu:</strong> {product.brand}
                </p>
                <p>
                  <strong>Xuất xứ:</strong> {product.origin}
                </p>
                <p>
                  <strong>SKU:</strong> {product.sku}
                </p>
                <p>
                  <strong>Hạn sử dụng:</strong> 3 năm kể từ ngày sản xuất
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="mb-8 rounded-lg bg-gray-50 p-6">
                <div className="mb-4 text-center">
                  <div className="mb-2 text-5xl font-bold">
                    {product.rating}.0
                  </div>
                  <div className="mb-2 flex justify-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        className="fill-black stroke-black"
                      />
                    ))}
                  </div>
                  <div className="text-gray-600">
                    {product.reviewCount} đánh giá
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-200 font-semibold">
                        N{i}
                      </div>
                      <div>
                        <div className="font-semibold">Người dùng {i}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                size={14}
                                className="fill-black stroke-black"
                              />
                            ))}
                          </div>
                          <span>• 2 tuần trước</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Sản phẩm rất tốt, màu sắc đẹp và bám màu lâu. Chất lượng
                      tuyệt vời, không bị vón cục. Rất đáng để mua và sử dụng!
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all hover:bg-black hover:text-white">
                  Xem thêm đánh giá
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
