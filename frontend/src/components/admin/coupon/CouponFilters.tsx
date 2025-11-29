import React, { useState } from 'react';

export interface CouponFiltersState {
  searchTerm: string;
  status: 'all' | 'active' | 'inactive' | 'expired' | 'upcoming';
  discountType: 'all' | 'percentage' | 'fixed_amount';
  validDateFrom?: string;
  validDateTo?: string;
}

interface CouponFiltersProps {
  filters: CouponFiltersState;
  onFilterChange: (filters: CouponFiltersState) => void;
  onClearFilters: () => void;
}

const CouponFilters: React.FC<CouponFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field: keyof CouponFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const isFiltered = (): boolean => {
    return (
      filters.searchTerm !== '' ||
      filters.status !== 'all' ||
      filters.discountType !== 'all' ||
      !!filters.validDateFrom ||
      !!filters.validDateTo
    );
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm mã hoặc mô tả..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="w-full rounded border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        >
          <option value="all"> Tất cả trạng thái</option>
          <option value="active"> Đang hoạt động</option>
          <option value="inactive"> Đã vô hiệu hóa</option>
          <option value="expired"> Đã hết hạn</option>
          <option value="upcoming"> Sắp có hiệu lực</option>
        </select>

        <select
          value={filters.discountType}
          onChange={(e) => handleChange('discountType', e.target.value)}
          className="rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        >
          <option value="all"> Tất cả loại giảm giá</option>
          <option value="percentage"> Giảm theo phần trăm (%)</option>
          <option value="fixed_amount"> Giảm cố định (VNĐ)</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700"
        >
          <svg
            className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          {showAdvanced ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
        </button>

        {isFiltered() && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
          {/* Valid Date From */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Có hiệu lực từ ngày
            </label>
            <input
              type="date"
              value={filters.validDateFrom || ''}
              onChange={(e) => handleChange('validDateFrom', e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Valid Date To */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Có hiệu lực đến ngày
            </label>
            <input
              type="date"
              value={filters.validDateTo || ''}
              onChange={(e) => handleChange('validDateTo', e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {isFiltered() && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          <span className="text-sm font-medium text-gray-700">
            Đang lọc theo:
          </span>

          {filters.searchTerm && (
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800">
              🔍 "{filters.searchTerm}"
              <button
                onClick={() => handleChange('searchTerm', '')}
                className="ml-1 hover:text-pink-900"
              >
                ×
              </button>
            </span>
          )}

          {filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              {filters.status === 'active' && ' Đang hoạt động'}
              {filters.status === 'inactive' && ' Đã vô hiệu hóa'}
              {filters.status === 'expired' && ' Đã hết hạn'}
              {filters.status === 'upcoming' && ' Sắp có hiệu lực'}
              <button
                onClick={() => handleChange('status', 'all')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}

          {filters.discountType !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
              {filters.discountType === 'percentage' && '📊 Phần trăm'}
              {filters.discountType === 'fixed_amount' && '💵 Cố định'}
              <button
                onClick={() => handleChange('discountType', 'all')}
                className="ml-1 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}

          {filters.validDateFrom && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Từ {new Date(filters.validDateFrom).toLocaleDateString('vi-VN')}
              <button
                onClick={() => handleChange('validDateFrom', '')}
                className="ml-1 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}

          {filters.validDateTo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Đến {new Date(filters.validDateTo).toLocaleDateString('vi-VN')}
              <button
                onClick={() => handleChange('validDateTo', '')}
                className="ml-1 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponFilters;
