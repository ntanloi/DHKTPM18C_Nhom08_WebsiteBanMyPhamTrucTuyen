import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/user/ui/ProductCard';
import { useProducts } from '../../hooks/useProducts';

interface ProductListPageProps {
  categorySlug?: string;
}

export default function ProductListPage({
  categorySlug,
}: ProductListPageProps) {
  // Sử dụng custom hook để fetch products theo slug
  const { products, loading, error, categoryName } = useProducts(
    categorySlug || null,
  );

  // === LOCAL FILTERS & SORTING ===
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [showPriceFilter, setShowPriceFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);

  // Pagination
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

  // Reset filters when category changes
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSortBy('default');
  }, [categorySlug]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Available brands từ products
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.category?.toLowerCase().includes(searchLower),
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price filter
    if (selectedPriceRanges.length > 0) {
      result = result.filter((p) => {
        const price = parseInt(p.price.replace(/\D/g, ''));
        return selectedPriceRanges.some((rangeId) => {
          const range = priceRanges.find((r) => r.id === rangeId);
          if (!range) return false;
          return (
            price >= range.min &&
            (range.max === Infinity ? true : price <= range.max)
          );
        });
      });
    }

    // Sorting
    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return (
              parseInt(a.price.replace(/\D/g, '')) -
              parseInt(b.price.replace(/\D/g, ''))
            );
          case 'price-desc':
            return (
              parseInt(b.price.replace(/\D/g, '')) -
              parseInt(a.price.replace(/\D/g, ''))
            );
          case 'rating-desc':
            return b.rating - a.rating;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }

    return result;
  }, [products, debouncedSearch, selectedBrands, selectedPriceRanges, sortBy]);

  // Paginated products
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset page khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  // Scroll to top on page change
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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        {/* Header */}
        <h1 className="mb-4 text-xl font-bold tracking-wide uppercase">
          {categoryName || 'DANH SÁCH SẢN PHẨM'}
        </h1>

        {/* Error State */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trong bộ sưu tập"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-gray-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <div className="w-56 shrink-0">
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
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(range.id)}
                        onChange={() => togglePriceRange(range.id)}
                        className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-gray-800"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
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
                  {availableBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-3.5 w-3.5 cursor-pointer rounded border-gray-300 text-gray-800"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-sm text-gray-600">
                Sắp xếp theo: <span className="font-medium">Mặc định</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} Kết quả
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-gray-400 focus:outline-none"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating-desc">Đánh giá cao nhất</option>
                  <option value="name-asc">Tên: A-Z</option>
                </select>
                <button className="rounded border border-gray-300 bg-white p-1.5 hover:bg-gray-50">
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
              </div>
            )}

            {/* Product Grid */}
            {!loading && displayedProducts.length > 0 && (
              <div className="grid auto-rows-fr grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8">
                {displayedProducts.map((product, index) => (
                  <div key={product.id || index} className="flex">
                    <ProductCard {...product} />
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
                  Vui lòng thử lại với bộ lọc khác
                </p>
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
