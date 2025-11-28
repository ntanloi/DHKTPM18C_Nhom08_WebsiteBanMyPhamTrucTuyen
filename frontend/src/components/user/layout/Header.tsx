import { useState, useRef, useEffect } from 'react';
import logo from '../../../assets/images/logo.png';
import {
  AccountIcon,
  CartIcon,
  HeartIcon,
  MagazineIcon,
  MoreIcon,
  SearchIcon,
  StoreIcon,
} from '../../../assets/icons/index';
import MenuItem from '../ui/MenuItem';
import Navbar from './Navbar';
import SearchDropdown from '../ui/SearchDropdown';
import CartSidebar from '../ui/CartSidebar';

interface HeaderProps {
  onOpenStores?: () => void;
  onOpenLogin?: () => void;
  onNavigate?: (path: string) => void; // Thêm prop này
}

export default function Header({
  onOpenStores,
  onOpenLogin,
  onNavigate,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false); // Sửa từ cartOpen thành isCartOpen
  const searchRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header>
        {/* sale */}
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
          <a href="/home">
            <img src={logo} alt="logo" className="w-[190px]" />
          </a>

          {/* Search */}
          <div className="relative mx-8 max-w-[400px] flex-1" ref={searchRef}>
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
                placeholder="Mua 1 Tặng 1 Kem Chống Nắng"
              />

              {/* Icon camera (nếu có) */}
              <button className="rounded-full bg-white p-1 transition hover:bg-gray-50">
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

            {/* Search Dropdown */}
            <SearchDropdown
              isVisible={searchFocused}
              searchValue={searchValue}
            />
          </div>

          {/* He thong */}
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
              <MenuItem
                icon={<AccountIcon />}
                title="Đăng nhập"
                onClick={onOpenLogin}
              />

              <button
                onClick={() => setIsCartOpen(true)}
                className="transition-colors hover:text-pink-500"
              >
                <HeartIcon />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="transition-colors hover:text-pink-500"
              >
                <CartIcon />
              </button>
            </div>
          </div>
        </div>

        <Navbar />
      </header>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={onNavigate || (() => {})}
      />
    </>
  );
}
