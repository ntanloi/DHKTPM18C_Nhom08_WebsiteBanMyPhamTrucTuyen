import { useState, useRef, useEffect } from 'react';
import logo from '../../../assets/images/logo.png';
import {
  AccountIcon,
  CartIcon,
  MagazineIcon,
  MoreIcon,
  SearchIcon,
  StoreIcon,
} from '../../../assets/icons/index';
import MenuItem from '../ui/MenuItem';
import Navbar from './Navbar';
import SearchDropdown from '../ui/SearchDropdown';
import CartSidebar from '../ui/CartSidebar';
import NotificationBell from '../../NotificationBell';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../context/CartContext';
import FavoriteSidebar, { HeartIconWithBadge } from '../ui/FavoriteList';

interface HeaderProps {
  onOpenStores?: () => void;
  onOpenLogin?: () => void;
  onNavigate?: (path: string) => void;
}

export default function Header({
  onOpenStores,
  onOpenLogin,
  onNavigate,
}: HeaderProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (keyword: string) => {
    if (!keyword.trim()) return;

    console.log('🔍 Searching for:', keyword);

    // Close dropdown and clear input
    setSearchFocused(false);
    setSearchValue('');

    // Navigate to search page with query
    const searchURL = `/search?q=${encodeURIComponent(keyword.trim())}`;

    if (onNavigate) {
      onNavigate(searchURL);
    } else {
      // Fallback if onNavigate is not provided
      window.location.href = searchURL;
    }
  };

  // Handle form submit (Enter key)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(searchValue);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header>
        {/* Sale banner */}
        <div className="color-brand h-[26.85px]">
          <ul className="mx-auto flex justify-center gap-5 px-20 text-white">
            <li>Freeship 15K mọi đơn hàng</li>
            <li>Quà Tặng Cho Đơn Từ 499K</li>
            <li>Giao Hàng Nhanh 24H</li>
            <li>Mua online nhận tại cửa hàng gần nhất</li>
          </ul>
        </div>

        {/* Header */}
        <div className="header container flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('/home')}
            className="cursor-pointer border-none bg-transparent p-0"
          >
            <img src={logo} alt="logo" className="w-[190px]" />
          </button>

          {/* Search */}
          <div className="relative mx-8 max-w-[400px] flex-1" ref={searchRef}>
            <form onSubmit={handleFormSubmit}>
              <div className="flex h-10 w-full items-center gap-2 rounded-[42px] border border-transparent bg-[rgb(246,246,246)] py-2.5 pr-1 pl-[11px] transition focus-within:border-pink-300">
                <span className="search">
                  <SearchIcon />
                </span>

                {/* Input */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="flex-1 border-none bg-transparent outline-none"
                  placeholder="Tìm kiếm sản phẩm..."
                />

                {/* Camera icon */}
                <button
                  type="button"
                  className="rounded-full bg-white p-1 transition hover:bg-gray-50"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Search Dropdown */}
            <SearchDropdown
              isVisible={searchFocused}
              searchValue={searchValue}
              onSearch={handleSearchSubmit}
            />
          </div>

          {/* Menu section */}
          <div className="flex items-center justify-between">
            {/* Menu Item 1 */}
            <div className="flex items-center justify-between gap-3 border-r px-5">
              <MenuItem
                icon={<StoreIcon />}
                title="Hệ thống cửa hàng"
                onClick={onOpenStores}
              />

              <MenuItem
                icon={<MagazineIcon />}
                title="Tạp chí làm đẹp"
                url="#"
              />

              <a href="#..." className="py-2">
                <MoreIcon />
              </a>
            </div>

            {/* Menu Item 2 */}
            <div className="flex items-center justify-between gap-3 pl-5">
              {isLoggedIn && user ? (
                // Logged in - Show user menu
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
                  >
                    {/* Avatar */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-semibold text-white">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate text-sm font-medium text-gray-700">
                      {user.email.split('@')[0]}
                    </span>
                    {/* Dropdown arrow */}
                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
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
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                      {/* User Info */}
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.role === 'ADMIN'
                            ? 'Quản trị viên'
                            : 'Khách hàng'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate?.('/account');
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Tài khoản của tôi
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            // Navigate to orders page
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
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
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Đơn hàng của tôi
                        </button>

                        {user.role === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              onNavigate?.('/admin');
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
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
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Quản trị hệ thống
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg
                            className="h-5 w-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Show login button
                <MenuItem
                  icon={<AccountIcon />}
                  title="Đăng nhập"
                  onClick={onOpenLogin}
                />
              )}

              <HeartIconWithBadge
                count={2} // Số lượng yêu thích
                onClick={() => setIsFavoriteOpen(true)}
              />

              {/* Notification Bell */}
              {isLoggedIn && <NotificationBell />}

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative transition-colors hover:text-pink-500"
              >
                <CartIcon />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <Navbar />
      </header>

      <FavoriteSidebar
        isOpen={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={onNavigate || (() => {})}
      />
    </>
  );
}
