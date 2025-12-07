import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../../components/user/ui/ProductCard';
import {
  productService,
  productImageService,
  categoriesService,
  productVariantService,
} from '../../services/user.service';

interface Product {
  id: number;
  slug: string;
  name: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  images: string[];
  freeShip?: boolean;
  badge?: string;
  averageRating?: number;
  reviewCount?: number;
  minPrice?: number; // Giá thấp nhất từ variants
  maxPrice?: number; // Giá cao nhất từ variants
  salePrice?: number; // Giá sale từ variants
}

interface ProductListPageProps {
  categorySlug?: string;
  searchKeyword?: string;
}

export default function ProductListPage({
  categorySlug,
  searchKeyword,
}: ProductListPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const priceRanges = [
    { id: 'under-500k', label: 'Dưới 500.000đ', min: 0, max: 500000 },
    {
      id: '500k-1m',
      label: '500.000đ - 1.000.000đ',
      min: 500000,
      max: 1000000,
    },
    {
      id: '1m-1.5m',
      label: '1.000.000đ - 1.500.000đ',
      min: 1000000,
      max: 1500000,
    },
    {
      id: '1.5m-2m',
      label: '1.500.000đ - 2.000.000đ',
      min: 1500000,
      max: 2000000,
    },
    { id: 'over-2m', label: 'Trên 2.000.000đ', min: 2000000, max: Infinity },
  ];

  // Fetch product prices from variants
  const fetchProductPrice = async (productId: number) => {
    try {
      const variantsResponse =
        await productVariantService.getByProductId(productId);
      const variants = variantsResponse?.data || [];

      if (variants.length === 0) {
        return { minPrice: 0, maxPrice: 0, salePrice: 0 };
      }

      // Get all prices
      const prices = variants.map((v: any) => v.price || 0);
      const salePrices = variants
        .map((v: any) => v.salePrice || 0)
        .filter((p: number) => p > 0);

      return {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        salePrice: salePrices.length > 0 ? Math.min(...salePrices) : 0,
      };
    } catch (error) {
      console.error(`Error fetching price for product ${productId}:`, error);
      return { minPrice: 0, maxPrice: 0, salePrice: 0 };
    }
  };

  // Main fetch function
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let productsResponse;
      let titleText = '';

      // SEARCH MODE
      if (searchKeyword && searchKeyword.trim()) {
        productsResponse = await productService.search(searchKeyword);
        titleText = `KẾT QUẢ TÌM KIẾM CHO "${searchKeyword}"`;
      }
      // CATEGORY MODE
      else if (categorySlug) {
        productsResponse =
          await productService.getProductsByCategorySlug(categorySlug);
        const categoryResponse =
          await categoriesService.getBySlug(categorySlug);
        titleText = categoryResponse?.data?.name || 'SẢN PHẨM';
      }
      // ALL PRODUCTS MODE
      else {
        productsResponse = await productService.getAll();
        titleText = 'TẤT CẢ SẢN PHẨM';
      }

      setPageTitle(titleText);

      if (productsResponse?.data) {
        let productsList: any[] = [];

        if (Array.isArray(productsResponse.data)) {
          productsList = productsResponse.data;
        } else if (
          productsResponse.data.products &&
          Array.isArray(productsResponse.data.products)
        ) {
          productsList = productsResponse.data.products;
        }

        // Fetch images and prices for each product
        const productsWithDetails = await Promise.all(
          productsList.map(async (product: any) => {
            try {
              // Fetch images
              const imagesResponse = await productImageService.getByProductId(
                product.id,
              );
              const imageUrls =
                imagesResponse?.data?.map((img: any) => img.imageUrl) || [];

              // Fetch prices from variants
              const priceData = await fetchProductPrice(product.id);

              return {
                ...product,
                id: Number(product.id),
                images: imageUrls,
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
                minPrice: priceData.minPrice,
                maxPrice: priceData.maxPrice,
                salePrice: priceData.salePrice,
              };
            } catch (err) {
              console.error(
                `Error fetching details for product ${product.id}:`,
                err,
              );
              return {
                ...product,
                id: Number(product.id),
                images: [],
                freeShip: true,
                badge: product.badge || undefined,
                averageRating: product.averageRating || 0,
                reviewCount: product.reviewCount || 0,
                minPrice: 0,
                maxPrice: 0,
                salePrice: 0,
              };
            }
          }),
        );

        setProducts(productsWithDetails);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err?.message || 'Không thể tải sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSortBy('default');
  }, [searchKeyword, categorySlug]);

  // Debounce local search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get available brands
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brandName))).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Local search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brandName.toLowerCase().includes(searchLower) ||
          p.categoryName?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brandName));
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        // Use salePrice if available, otherwise use minPrice
        const effectivePrice =
          p.salePrice && p.salePrice > 0 ? p.salePrice : p.minPrice;

        if (!effectivePrice || effectivePrice === 0) return false;

        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          if (!range) return false;

          return (
            effectivePrice >= range.min &&
            (range.max === Infinity ? true : effectivePrice <= range.max)
          );
        });
      });
    }

    // Sorting
    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc': {
            const priceA =
              a.salePrice && a.salePrice > 0 ? a.salePrice : a.minPrice || 0;
            const priceB =
              b.salePrice && b.salePrice > 0 ? b.salePrice : b.minPrice || 0;
            return priceA - priceB;
          }
          case 'price-desc': {
            const priceA =
              a.salePrice && a.salePrice > 0 ? a.salePrice : a.minPrice || 0;
            const priceB =
              b.salePrice && b.salePrice > 0 ? b.salePrice : b.minPrice || 0;
            return priceB - priceA;
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [products, debouncedSearch, selectedBrands, selectedPriceRanges, sortBy]);

  // Paginate
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearAllFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedPriceRanges.length > 0 ||
    searchQuery.trim() !== '';

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="flex h-8 min-w-[32px] items-center justify-center rounded border border-gray-300 bg-white px-2 text-sm hover:border-gray-400"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-1 text-gray-400">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`flex h-8 min-w-[32px] items-center justify-center rounded px-2 text-sm ${
            currentPage === i
              ? 'bg-black text-white'
              : 'border border-gray-300 bg-white hover:border-gray-400'
          }`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-1 text-gray-400">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="flex h-8 min-w-[32px] items-center justify-center rounded border border-gray-300 bg-white px-2 text-sm hover:border-gray-400"
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  // Count products by price range
  const getPriceRangeCount = (rangeId: string) => {
    const range = priceRanges.find((r) => r.id === rangeId);
    if (!range) return 0;

    return products.filter((p) => {
      const effectivePrice =
        p.salePrice && p.salePrice > 0 ? p.salePrice : p.minPrice;
      if (!effectivePrice || effectivePrice === 0) return false;

      return (
        effectivePrice >= range.min &&
        (range.max === Infinity ? true : effectivePrice <= range.max)
      );
    }).length;
  };

  // Count products by brand
  const getBrandCount = (brand: string) => {
    return products.filter((p) => p.brandName === brand).length;
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        {/* Page Title */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide uppercase">
            {pageTitle}
          </h1>

          {searchKeyword && (
            <div className="flex items-center gap-2 rounded-lg bg-pink-50 px-3 py-1.5">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-pink-600">
                  {products.length}
                </span>{' '}
                kết quả
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Local Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trong bộ sưu tập"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-10 pl-10 text-sm focus:border-gray-400 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Filters Sidebar */}
          <div className="w-56 shrink-0">
            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mb-4 rounded-lg border border-pink-200 bg-pink-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Bộ lọc ({selectedBrands.length + selectedPriceRanges.length}
                    )
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium text-pink-600 hover:text-pink-700"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPriceRanges.map((rangeId) => {
                    const range = priceRanges.find((r) => r.id === rangeId);
                    return (
                      <span
                        key={rangeId}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
                      >
                        {range?.label}
                        <button
                          onClick={() => togglePriceRange(rangeId)}
                          className="text-gray-400 transition-colors hover:text-gray-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                  {selectedBrands.map((brand) => (
                    <span
                      key={brand}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700"
                    >
                      {brand}
                      <button
                        onClick={() => toggleBrand(brand)}
                        className="text-gray-400 transition-colors hover:text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="mb-3">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className="mb-2 flex w-full items-center justify-between text-sm font-semibold"
              >
                <span>Giá sản phẩm</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`}
                />
              </button>
              {showPriceFilter && (
                <div className="space-y-1.5">
                  {priceRanges.map((range) => {
                    const count = getPriceRangeCount(range.id);
                    return (
                      <label
                        key={range.id}
                        className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 hover:text-gray-900"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.id)}
                            onChange={() => togglePriceRange(range.id)}
                            className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-pink-500"
                          />
                          <span>{range.label}</span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={() => setShowBrandFilter(!showBrandFilter)}
                className="mb-2 flex w-full items-center justify-between text-sm font-semibold"
              >
                <span>Thương hiệu</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showBrandFilter ? 'rotate-180' : ''}`}
                />
              </button>
              {showBrandFilter && (
                <div className="max-h-80 space-y-1.5 overflow-y-auto">
                  {availableBrands.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Không có thương hiệu
                    </p>
                  ) : (
                    availableBrands.map((brand) => {
                      const count = getBrandCount(brand);
                      return (
                        <label
                          key={brand}
                          className="flex cursor-pointer items-center justify-between gap-2 text-sm text-gray-700 hover:text-gray-900"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-pink-500"
                            />
                            <span>{brand}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            ({count})
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium focus:border-gray-400 focus:outline-none"
                >
                  <option value="default">Mặc định</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold">
                    {filteredProducts.length}
                  </span>{' '}
                  sản phẩm
                </span>
                <button
                  onClick={clearAllFilters}
                  className="rounded border border-gray-300 bg-white p-1.5 hover:bg-gray-50"
                  title="Xóa bộ lọc"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex h-96 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-pink-500"></div>
                  <p className="mt-4 text-sm text-gray-500">
                    Đang tải sản phẩm...
                  </p>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && displayedProducts.length > 0 && (
              <div className="grid auto-rows-fr grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8">
                {displayedProducts.map((product) => (
                  <div key={product.id} className="flex">
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      brandName={product.brandName}
                      categoryName={product.categoryName}
                      images={product.images}
                      freeShip={product.freeShip}
                      badge={product.badge}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && displayedProducts.length === 0 && (
              <div className="flex h-96 flex-col items-center justify-center text-gray-400">
                <svg
                  className="mb-3 h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-base font-medium text-gray-600">
                  Không tìm thấy sản phẩm nào
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {searchKeyword
                    ? `Không có kết quả cho "${searchKeyword}"`
                    : hasActiveFilters
                      ? 'Vui lòng thử bộ lọc khác'
                      : 'Danh mục này chưa có sản phẩm'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && displayedProducts.length > 0 && !loading && (
              <div className="mt-8 flex items-center justify-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 items-center rounded border border-gray-300 bg-white px-3 text-sm hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &lt;
                </button>

                {renderPagination()}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-8 items-center rounded border border-gray-300 bg-white px-3 text-sm hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
