import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import Logo from '../../assets/images/logo.png';
import verified from '../../assets/images/verified.png';
import cod from '../../assets/images/cod.png';
import master from '../../assets/images/master.png';
import momo from '../../assets/images/momo.png';
import napas from '../../assets/images/napas.png';
import visa from '../../assets/images/visa.png';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container mx-auto mb-14 px-4">
        <div className="color-brand rounded-2xl px-6 py-8 text-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="text-left">
              <h2 className="mb-1 text-2xl font-bold">NHẬN BẢN TIN LÀM ĐẸP</h2>
              <p className="text-sm opacity-90">
                Đừng bỏ lỡ hàng ngàn sản phẩm và chương trình siêu hấp dẫn
              </p>
            </div>
            <div className="flex items-center overflow-hidden rounded-full bg-amber-50/20 p-1 transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-white">
              <input
                type="email"
                placeholder="Điền email của bạn"
                className="flex-1 bg-transparent px-6 py-3 text-sm text-white placeholder-white focus:outline-none"
              />
              <button className="px-8 py-3 font-semibold whitespace-nowrap text-white transition-all duration-300 ease-in-out hover:opacity-50">
                THEO DÕI
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto bg-white px-4 py-12">
        <div className="grid grid-cols-5 gap-8">
          <div>
            <img src={Logo} className="mb-8" />
            <div className="mb-8 flex gap-4">
              <a href="#" className="text-2xl transition hover:opacity-70">
                <FaFacebookF />
              </a>
              <a href="#" className="text-2xl transition hover:opacity-70">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl transition hover:opacity-70">
                <FaTiktok />
              </a>
            </div>
            <img src={verified} className="w-32" />
          </div>

          <div>
            <h3 className="mb-2 font-semibold">VỀ BEAUTY BOX</h3>
            <ul className="space-y-1">
              <li>
                <a href="#">Câu chuyện thương hiệu</a>
              </li>
              <li>
                <a href="#">Về chúng tôi</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">CHÍNH SÁCH</h3>
            <ul className="space-y-1">
              <li>
                <a href="#">Chính sách và quy định chung</a>
              </li>
              <li>
                <a href="#">Chính sách giao nhận thanh toán</a>
              </li>
              <li>
                <a href="#">Chính sách đổi trả sản phẩm</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật thông tin cá nhân</a>
              </li>
              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">MY BEAUTY BOX</h3>
            <ul className="space-y-1">
              <li>
                <a href="#">Quyền lợi thành viên</a>
              </li>
              <li>
                <a href="#">Thông tin thành viên</a>
              </li>
              <li>
                <a href="#">Theo dõi đơn hàng</a>
              </li>
              <li>
                <a href="#">Hướng dẫn mua hàng online</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">ĐỐI TÁC - LIÊN KẾT</h3>
            <ul>
              <li>
                <a href="#">THE FACE SHOP Vietnam</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex justify-between border-t border-gray-100 px-4 pt-6 text-xs leading-relaxed text-gray-600">
        <p>
          ©beautybox.com.vn thuộc quyền sở hữu của Công ty CP TMDV Tổng Hợp
          Hoàn Vũ GPKD số 0309802418 cấp ngày 11/02/2010 tại Sở Kế hoạch & Đầu
          tư TP HCM | VP Miền Nam Lầu 1, G Tower 3 - 196A, Nguyễn Văn Hưởng,
          Phường Thảo Điền, Thành Phố Thủ Đức, TP.HCM — Chi nhánh Công ty CP
          TMDV Tổng Hợp Hoàn Vũ tại Hà Nội GPKD chi nhánh số 0309802418-004 cấp
          ngày 22/11/2017 | Tầng 4 tháp 2, Times Tower, 35 Lê Văn Lương, Phường
          Nhân Chính, Q. Thanh Xuân, TP.Hà Nội, Việt Nam.
        </p>

        <div className="mr-50 ml-100 flex flex-col items-center gap-2">
          <span className="text-sm font-semibold whitespace-nowrap">
            PHƯƠNG THỨC THANH TOÁN
          </span>
          <div className="flex items-center gap-3">
            <img src={visa} alt="Visa" className="h-6" />
            <img src={master} alt="MasterCard" className="h-6" />
            <img src={napas} alt="Napas" className="h-6" />
            <img src={cod} alt="COD" className="h-6" />
            <img src={momo} alt="Momo" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
