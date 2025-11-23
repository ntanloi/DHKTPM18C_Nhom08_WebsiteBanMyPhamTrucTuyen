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
import MenuItem from '../../user/ui/MenuItem';
import Navbar from './Navbar';

interface HeaderProps {
  onOpenStores?: () => void;
  onOpenLogin?: () => void;
}

export default function Header({ onOpenStores, onOpenLogin }: HeaderProps) {
  return (
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
        <div className="flex h-10 w-[400px] max-w-[400px] items-center gap-2 rounded-[42px] border border-transparent bg-[rgb(246,246,246)] py-2.5 pr-1 pl-[11px]">
          <span className="search">
            <SearchIcon />
          </span>

          {/* Input */}
          <input
            type="text"
            className="flex-1 border-none outline-none"
            placeholder="Mua 1 Tặng 1 Kem Chống Nắng"
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

            <MenuItem icon={<MagazineIcon />} title="Tạp chí làm đẹp" url="#" />

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

            <a href="">
              <HeartIcon />
            </a>

            <a href="">
              <CartIcon />
            </a>
          </div>
        </div>
      </div>

      <Navbar />
    </header>
  );
}
