import { useState, useEffect } from 'react';
import { Search, TrendingUp, X, Clock } from 'lucide-react';
import { productService } from '../../../services/user.service';

interface SearchDropdownProps {
  isVisible: boolean;
  searchValue: string;
  onSearch: (keyword: string) => void; // NEW: Callback to parent
}

export default function SearchDropdown({
  isVisible,
  searchValue,
  onSearch, // NEW: Receive callback
}: SearchDropdownProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const recent = localStorage.getItem('recentSearches');
      if (recent) {
        setRecentSearches(JSON.parse(recent));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Fetch suggestions when searchValue changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await productService.getSearchSuggestions(searchValue);
        setSuggestions(response.data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return;

    // Save to recent searches
    const updatedRecent = [
      keyword,
      ...recentSearches.filter((s) => s !== keyword),
    ].slice(0, 5);

    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    // Call parent's search handler
    onSearch(keyword);
  };

  const removeRecentSearch = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== keyword);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  if (!isVisible) return null;

  return (
    <div className="animate-fadeIn absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white shadow-2xl">
      <div className="max-h-[500px] overflow-y-auto p-4">
        {/* Recent Searches */}
        {recentSearches.length > 0 && searchValue.trim().length === 0 && (
          <div className="mb-4">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
              <Clock className="h-4 w-4" />
              Tìm kiếm gần đây
            </h4>
            <ul className="space-y-1">
              {recentSearches.map((search, idx) => (
                <li
                  key={idx}
                  className="group flex items-center justify-between"
                >
                  <button
                    onClick={() => handleSearch(search)}
                    className="flex-1 cursor-pointer rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-pink-50"
                  >
                    {search}
                  </button>
                  <button
                    onClick={(e) => removeRecentSearch(e, search)}
                    className="rounded p-2 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Divider */}
        {recentSearches.length > 0 && searchValue.trim().length === 0 && (
          <div className="my-3 border-t border-gray-200" />
        )}

        {/* Suggestions */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
            {searchValue.trim().length > 0 ? (
              <>
                <Search className="h-4 w-4" />
                Gợi ý tìm kiếm
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Tìm kiếm phổ biến
              </>
            )}
          </h4>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <ul className="space-y-1">
              {suggestions.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-gray-500">
                  Không tìm thấy gợi ý
                </li>
              ) : (
                suggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleSearch(suggestion)}
                      className="w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-pink-50"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
