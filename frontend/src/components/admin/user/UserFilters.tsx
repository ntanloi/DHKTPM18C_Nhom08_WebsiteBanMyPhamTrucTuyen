import React, { useState, useEffect } from 'react';

export interface UserFilterValues {
  search: string;
  isActive: 'all' | 'active' | 'inactive';
  emailVerified: 'all' | 'verified' | 'unverified';
}

interface UserFiltersProps {
  onFilterChange: (filters: UserFilterValues) => void;
  initialFilters?: Partial<UserFilterValues>;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<UserFilterValues>({
    search: initialFilters.search || '',
    isActive: initialFilters.isActive || 'all',
    emailVerified: initialFilters.emailVerified || 'all',
  });

  const [searchDebounce, setSearchDebounce] = useState<number | null>(null);

  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      isActive: e.target.value as UserFilterValues['isActive'],
    }));
  };

  const handleVerifiedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      emailVerified: e.target.value as UserFilterValues['emailVerified'],
    }));
  };

  const handleReset = () => {
    setFilters({
      search: '',
      isActive: 'all',
      emailVerified: 'all',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.isActive !== 'all' ||
    filters.emailVerified !== 'all';

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1 md:col-span-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full rounded border border-gray-300 px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <svg
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
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
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Account Status
          </label>
          <select
            value={filters.isActive}
            onChange={handleStatusChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Email Verification
          </label>
          <select
            value={filters.emailVerified}
            onChange={handleVerifiedChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 border-t border-gray-200 pt-3">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, search: '' }))
                  }
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.isActive !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                Status: {filters.isActive}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, isActive: 'all' }))
                  }
                  className="ml-1 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.emailVerified !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                Email: {filters.emailVerified}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, emailVerified: 'all' }))
                  }
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
