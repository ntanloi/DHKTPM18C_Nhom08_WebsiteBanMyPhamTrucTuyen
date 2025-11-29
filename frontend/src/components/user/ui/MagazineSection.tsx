/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';

import TinTuc1 from '../../../assets/images/tintuc1.png';
import TinTuc2 from '../../../assets/images/tintuc2.png';
import TinTuc3 from '../../../assets/images/tintuc3.png';

import GocRe1 from '../../../assets/images/goc1.png';
import GocRe2 from '../../../assets/images/goc2.png';
import GocRe3 from '../../../assets/images/goc3.png';

import ChamSoc1 from '../../../assets/images/chamsocda1.png';
import ChamSoc2 from '../../../assets/images/chamsocda2.png';
import ChamSoc3 from '../../../assets/images/chamsocda3.png';

import XuHuong1 from '../../../assets/images/xuhuong1.png';
import XuHuong2 from '../../../assets/images/xuhuong2.png';
import XuHuong3 from '../../../assets/images/xuhuong3.png';

import BiQuyet1 from '../../../assets/images/biquyet1.png';
import BiQuyet2 from '../../../assets/images/biquyet2.png';
import BiQuyet3 from '../../../assets/images/biquyet3.png';

// Định nghĩa types
interface Article {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface MagazineData {
  'tin-tuc': Article[];
  'goc-review': Article[];
  'cach-cham-soc-da': Article[];
  'xu-huong-trang-diem': Article[];
  'bi-quyet-khoe-dep': Article[];
}

type TabId = keyof MagazineData;

// Dữ liệu mẫu cho các tab
export const magazineData: MagazineData = {
  'tin-tuc': [
    {
      id: 1,
      image: TinTuc1,
      title:
        'BEAUTY BOX AEON MALL TÂN PHÚ CELADON CHÍNH THỨC RA MẮT DIỆN MAO MỚI - ĐẸP CHẤT CHƠI',
      description:
        'Từ 29.08, Beauty Box Aeon Mall Tân Phú Celadon trở lại trong diện mạo hoàn toàn mới: Trendy – Hiện đại – Trẻ trung hơn bao giờ hết!',
    },
    {
      id: 2,
      image: TinTuc2,
      title: 'KHẨN CẤP: CẢNH GIÁC CHIÊU THỨC LỪA ĐẢO KHÁCH HÀNG!',
      description:
        'Giả danh shipper lừa chuyển khoản! Bạn có thể là nạn nhân tiếp theo!? Đừng bỏ qua bài viết này nhé!',
    },
    {
      id: 3,
      image: TinTuc3,
      title: 'AHC CHÍNH HÃNG TRỞ LẠI – DIỆN MAO MỚI, ĐỘC QUYỀN TẠI BEAUTY BOX!',
      description:
        'Các tín đồ skincare của Beauty Box ơi! Tin siêu vui dành cho hội yêu làm đẹp: AHC – thương hiệu đình đám đến từ Hàn Quốc đã chính thức quay trở lại hệ thống Beauty Box với diện...',
    },
  ],
  'goc-review': [
    {
      id: 1,
      image: GocRe1,
      title: 'Gợi Ý Hộp Quà Mỹ Phẩm: Tri Ân Đến Người Bạn Yêu Thương',
      description:
        'Ngày 20/10 là dịp tuyệt vời để bạn gửi lời tri ân và yêu thương đến những người phụ nữ quan trọng trong cuộc đời mình. Một món quà không chỉ đẹp mà còn hữu ích sẽ khiến họ cả...',
    },
    {
      id: 2,
      image: GocRe2,
      title:
        'Cách Chọn Quà Ý Nghĩa, Phù Hợp Và Siêu Xinh Cho Ngày Phụ Nữ Việt Nam',
      description:
        'Ngày 20/10 là dịp tuyệt vời để bạn gửi lời tri ân và yêu thương đến những người phụ nữ quan trọng trong cuộc đời mình. Một món quà không chỉ đẹp mà còn hữu ích sẽ khiến họ cả...',
    },
    {
      id: 3,
      image: GocRe3,
      title: 'Có Nên Sử Dụng Mỹ Phẩm Cận Date Gần Hết Hạn Sử Dụng?',
      description:
        'Mỹ phẩm cận date không có nghĩa là không thể sử dụng. Hôm nay, BEAUTY BOX sẽ giúp bạn hiểu rõ hơn để dùng sản phẩm một cách an toàn và tiết kiệm nhé!',
    },
  ],
  'cach-cham-soc-da': [
    {
      id: 1,
      image: ChamSoc1,
      title: '20 Ngày Chăm Da Rạng Rỡ Cập Tóc Đón 20/10',
      description:
        'Với 20 ngày kiên trì theo một chu trình chăm sóc da khoa học cùng những sản phẩm phù hợp, làn da có thể cải thiện rõ rệt, da mượt hơn, bề mặt mịn màng và tông thể gương mặt trông...',
    },
    {
      id: 2,
      image: ChamSoc2,
      title: 'Bí quyết dưỡng da từ Hạ sang Thu - Đẹp min màng không khó rạp',
      description:
        'Việc xây dựng một quy trình dưỡng da từ Hạ sang Thu khoa học và phù hợp với thời tiết là vô cùng cần thiết để giúp cho làn da luôn khỏe mạnh, mềm mịn và rạng rỡ.',
    },
    {
      id: 3,
      image: ChamSoc3,
      title: '"Bỏ túi" cách chọn sữa rửa mặt tốt nhất cho từng loại da',
      description:
        'Chọn sữa rửa mặt phù hợp sẽ mang lại hiệu quả bất ngờ cho làn da hơn bạn tưởng. Beauty Box sẽ bật mí cho bạn cách chọn sữa rửa mặt tương thích với mỗi loại da trong bài viết...',
    },
  ],
  'xu-huong-trang-diem': [
    {
      id: 1,
      image: XuHuong1,
      title: '3 Kiểu Makeup Xinh Như Hoa Cho Phái Đẹp Ngày 20/10',
      description:
        'Mỗi cô gái đều có một nét đẹp riêng: dịu dàng, rạng rỡ hay quyến rũ. Hãy cùng khám phá 3 layout makeup lấy cảm hứng từ vẻ đẹp tự nhiên, giúp bạn tỏa sáng như một đoá hoa...',
    },
    {
      id: 2,
      image: XuHuong2,
      title:
        'Back to school makeup 2025 - Tips trang điểm tự nhiên, chuẩn "Trend" cho các "nàng" học sinh, sinh viên',
      description:
        'Một lớp trang điểm tự nhiên, tươi tắn, phù hợp với môi trường học đường sẽ vừa giúp bạn rạng rỡ, vừa giữ được nét thanh lịch.',
    },
    {
      id: 3,
      image: XuHuong3,
      title: 'Mách bạn 10 bước trang điểm cơ bản cho người mới bắt đầu',
      description:
        'Khi mới bắt đầu học cách trang điểm thì bạn có biết nên chuẩn bị các dụng cụ trang điểm và tiến hành các bước trang điểm như thế nào không? Nếu bạn chưa hiểu rõ, hãy...',
    },
  ],
  'bi-quyet-khoe-dep': [
    {
      id: 1,
      image: BiQuyet1,
      title: 'Cách bổ sung Collagen hiệu quả',
      description:
        'Collagen là một loại protein quan trọng mà cơ thể cần để giữ cho làn da trẻ trung và khỏe mạnh. Để dùng nạp collagen cho cơ thể có rất nhiều phương thức khác nhau...',
    },
    {
      id: 2,
      image: BiQuyet2,
      title: '5 nguyên liệu xử lý tóc bết dính nhanh chóng',
      description:
        'Tóc bết dính khiến các cô nàng thiếu tự tin và có thể gây ra các bệnh lý da liễu. Hãy tham khảo nhanh 5 cách khắc phục tình trạng tóc bết từ Beauty Box để giữ cho mái tóc bóng...',
    },
    {
      id: 3,
      image: BiQuyet3,
      title: 'Cách trị nám da mặt bằng thiên nhiên an toàn, hiệu quả',
      description:
        'Bên cạnh sự can thiệp của y khoa, bạn có thể áp dụng các phương pháp trị nám da mặt bằng nguyên liệu thiên nhiên an toàn và cảm nhận được hiệu quả sau một thời gian sử...',
    },
  ],
};

export default function MagazineSection() {
  const [activeTab, setActiveTab] = useState<TabId>('tin-tuc');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'tin-tuc', label: 'Tin tức' },
    { id: 'goc-review', label: 'Góc review' },
    { id: 'cach-cham-soc-da', label: 'Cách chăm sóc da' },
    { id: 'xu-huong-trang-diem', label: 'Xu hướng trang điểm' },
    { id: 'bi-quyet-khoe-dep', label: 'Bí quyết khỏe đẹp' },
  ];

  const currentArticles = magazineData[activeTab];

  return (
    <div className="mt-16 mb-16">
      <h1 className="mb-8 text-center text-3xl font-bold tracking-wider uppercase">
        BEAUTYBOX MAGAZINE
      </h1>

      {/* Tabs Navigation */}
      <div className="mb-10 flex justify-center gap-8 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-base font-semibold transition-all ${
              activeTab === tab.id
                ? 'border-b-3 border-black text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={
              activeTab === tab.id
                ? { borderBottomWidth: '3px', borderBottomColor: '#000' }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-3 gap-6 px-4">
        {currentArticles.map((article: Article) => (
          <div
            key={article.id}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl"
          >
            <div className="relative overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-lg leading-tight font-bold text-gray-900 transition-colors group-hover:text-[#c0595c]">
                {article.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                {article.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-10 flex justify-center">
        <button className="rounded-full border-2 border-black px-8 py-3 font-medium text-black transition-all duration-300 hover:border-[#c0595c] hover:text-[#c0595c]">
          Tất cả bài viết
        </button>
      </div>
    </div>
  );
}
