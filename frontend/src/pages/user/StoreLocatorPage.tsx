import { useEffect, useMemo, useRef, useState } from 'react';

type Store = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
};

const STORES: Store[] = [
  {
    id: 'bd-canary',
    name: 'BEAUTY BOX AEON BÌNH DƯƠNG',
    city: 'Bình Dương',
    district: 'Thuận An',
    address:
      'G6 - Tầng trệt TTTM Aeon Bình Dương Canary, Đại lộ Bình Dương, phường Bình Hoà, TP. Hồ Chí Minh, Phường Thuận Giao, Thành phố Thuận An',
    phone: '18006035',
    lat: 10.94998,
    lng: 106.71437,
  },
  {
    id: 'hcm-vo-van-ngan',
    name: 'BEAUTY BOX VÕ VĂN NGÂN',
    city: 'Hồ Chí Minh',
    district: 'Thủ Đức',
    address: 'Số 264 Võ Văn Ngân, Phường Bình Thọ, Thành Phố Thủ Đức',
    phone: '18006035',
    lat: 10.85075,
    lng: 106.75871,
  },
  {
    id: 'hcm-district1',
    name: 'BEAUTY BOX QUẬN 1',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    phone: '18006035',
    lat: 10.77322,
    lng: 106.70093,
  },
  {
    id: 'hcm-hai-ba-trung',
    name: 'BEAUTY BOX HAI BÀ TRƯNG',
    city: 'Hồ Chí Minh',
    district: 'Quận 3',
    address: '415 Hai Bà Trưng, Phường Võ Thị Sáu, Quận 3',
    phone: '18006035',
    lat: 10.7876,
    lng: 106.6905,
  },
  {
    id: 'hcm-premium-q8',
    name: 'BEAUTY BOX PREMIUM Q8',
    city: 'Hồ Chí Minh',
    district: 'Quận 8',
    address: 'TTTM CENTRAL PREMIUM, 854 Tạ Quang Bửu, Phường 5, Quận 8',
    phone: '18006035',
    lat: 10.7396,
    lng: 106.6672,
  },
  {
    id: 'hn-kim-ma',
    name: 'BEAUTY BOX KIM MÃ',
    city: 'Hà Nội',
    district: 'Ba Đình',
    address: '176 Kim Mã, Phường Kim Mã, Quận Ba Đình',
    phone: '18006035',
    lat: 21.0332,
    lng: 105.8140,
  },
  {
    id: 'hcm-nguyen-anh-thu',
    name: 'BEAUTY BOX NGUYỄN ẢNH THỦ',
    city: 'Hồ Chí Minh',
    district: 'Quận 12',
    address: '27M Nguyễn Ảnh Thủ, Phường Trung Mỹ Tây, Quận 12',
    phone: '18006035',
    lat: 10.8672,
    lng: 106.6246,
  },
  {
    id: 'hcm-emart-phan-van-tri',
    name: 'BEAUTY BOX EMART PHAN VĂN TRỊ',
    city: 'Hồ Chí Minh',
    district: 'Gò Vấp',
    address: '366 Phan Văn Trị, Phường 5, Quận Gò Vấp',
    phone: '18006035',
    lat: 10.8339,
    lng: 106.6800,
  },
  {
    id: 'hn-chua-boc',
    name: 'BEAUTY BOX CHÙA BỘC',
    city: 'Hà Nội',
    district: 'Đống Đa',
    address: '191 Chùa Bộc, Phường Trung Liệt, Quận Đống Đa',
    phone: '18006035',
    lat: 21.0090,
    lng: 105.8239,
  },
  {
    id: 'hcm-vincom-thao-dien',
    name: 'BEAUTY VINCOM THẢO ĐIỀN',
    city: 'Hồ Chí Minh',
    district: 'Thành Phố Thủ Đức',
    address: 'Vincom Thảo Điền, 161 Võ Nguyên Giáp, Phường Thảo Điền',
    phone: '18006035',
    lat: 10.8015,
    lng: 106.7396,
  },
  {
    id: 'hcm-vincom-dong-khoi',
    name: 'BEAUTY BOX VINCOM ĐỒNG KHỞI',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    address: 'B2-17 Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1',
    phone: '18006035',
    lat: 10.7785,
    lng: 106.7009,
  },
  {
    id: 'hcm-binh-thanh',
    name: 'BEAUTY BOX BÌNH THẠNH',
    city: 'Hồ Chí Minh',
    district: 'Bình Thạnh',
    address: '214 Xô Viết Nghệ Tĩnh, Phường 21, Quận Bình Thạnh',
    phone: '18006035',
    lat: 10.8048,
    lng: 106.7106,
  },
  {
    id: 'hcm-district7-scenic',
    name: 'BEAUTY BOX SCENIC VALLEY',
    city: 'Hồ Chí Minh',
    district: 'Quận 7',
    address: '105 Nguyễn Văn Linh, Phường Tân Phong, Quận 7',
    phone: '18006035',
    lat: 10.7295,
    lng: 106.7180,
  },
  {
    id: 'hcm-tan-phu',
    name: 'BEAUTY BOX TÂN PHÚ',
    city: 'Hồ Chí Minh',
    district: 'Tân Phú',
    address: '60 Lũy Bán Bích, Phường Tân Thới Hòa, Quận Tân Phú',
    phone: '18006035',
    lat: 10.7906,
    lng: 106.6344,
  },
  {
    id: 'hcm-tan-binh',
    name: 'BEAUTY BOX TÂN BÌNH',
    city: 'Hồ Chí Minh',
    district: 'Tân Bình',
    address: '2 Trường Chinh, Phường 15, Quận Tân Bình',
    phone: '18006035',
    lat: 10.8033,
    lng: 106.6526,
  },
  {
    id: 'dn-hai-chau',
    name: 'BEAUTY BOX ĐÀ NẴNG',
    city: 'Đà Nẵng',
    district: 'Hải Châu',
    address: '74 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
    phone: '18006035',
    lat: 16.0669,
    lng: 108.2230,
  },
  {
    id: 'ct-ninh-kieu',
    name: 'BEAUTY BOX CẦN THƠ',
    city: 'Cần Thơ',
    district: 'Ninh Kiều',
    address: '54 Mậu Thân, Phường An Hoà, Quận Ninh Kiều',
    phone: '18006035',
    lat: 10.0335,
    lng: 105.7706,
  },
  {
    id: 'hue-truong-tien',
    name: 'BEAUTY BOX HUẾ',
    city: 'Thừa Thiên Huế',
    district: 'TP Huế',
    address: '12 Trường Tiền, Thành phố Huế',
    phone: '18006035',
    lat: 16.4637,
    lng: 107.5909,
  },
];

export default function StoreLocatorPage() {
  const [city, setCity] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [selected, setSelected] = useState<Store | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => Array.from(new Set(STORES.map((s) => s.city))), []);
  const districts = useMemo(
    () => Array.from(new Set(STORES.filter((s) => (city ? s.city === city : true)).map((s) => s.district))),
    [city]
  );

  const filtered = useMemo(() => {
    return STORES.filter((s) => (city ? s.city === city : true)).filter((s) => (district ? s.district === district : true));
  }, [city, district]);

  useEffect(() => {
    if (!selected || !filtered.find((s) => s.id === selected.id)) {
      setSelected(filtered[0] ?? null);
    }
  }, [filtered, selected]);

  // Ưu tiên cuộn danh sách (cả cuộn lên/xuống) cho tới khi chạm đầu/cuối
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      const el = listRef.current;
      if (!el) return;
      const delta = e.deltaY;
      const atTop = el.scrollTop <= 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
      if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
        e.preventDefault();
        el.scrollTop += delta;
      }
    };
    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, []);

  const mapSrc = selected
    ? `https://www.google.com/maps?q=${selected.lat},${selected.lng}&hl=vi&z=14&output=embed`
    : `https://www.google.com/maps?q=Vietnam&hl=vi&z=5&output=embed`;

  return (
    <div className="container mx-auto px-4 py-6">
      <p className="mb-2 opacity-70">Trang chủ &gt; Cửa hàng</p>
      <h1 className="mb-2 text-3xl font-extrabold">TÌM CỬA HÀNG</h1>
      <p className="mb-4 opacity-70">{filtered.length} cửa hàng</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: filters + list */}
        <div className="min-h-[70vh]">
          <div className="mb-4 flex gap-3">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setDistrict('');
              }}
              className="w-1/2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900"
            >
              <option value="">Tỉnh/Thành phố</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-1/2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900"
            >
              <option value="">Quận/huyện</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable two-column grid of cards */}
          <div ref={listRef} className="hide-scrollbar max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`cursor-pointer rounded-xl border border-gray-300 bg-white p-4 text-gray-900 transition hover:border-pink-400 ${
                    selected?.id === s.id ? 'ring-1 ring-pink-400' : ''
                  }`}
                >
                  <p className="text-sm text-gray-700">{s.city}</p>
                  <h3 className="font-semibold text-gray-900">{s.name}</h3>
                  <p className="mt-1 text-sm text-gray-800">{s.address}</p>
                  <a className="mt-2 inline-block text-gray-900 underline" href={`tel:${s.phone}`}>
                    {s.phone}
                  </a>
                  <div className="mt-2 text-sm text-gray-700">Đang mở cửa 09:00 - 22:00</div>
                  <div className="mt-2 text-sm">
                    <a
                      className="mr-4 underline text-gray-900"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + ' ' + s.address)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Xem bản đồ
                    </a>
                    <a className="mr-4 underline text-gray-900" href="#">Xem showroom</a>
                    <a className="underline text-gray-900" href="#">Giờ mở cửa</a>
                  </div>
                  <div className="mt-2 text-sm">
                    <a className="underline text-gray-900" href="#">Chi tiết</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: map */}
        <div className="min-h-[70vh] overflow-hidden rounded-xl border border-gray-300 bg-gray-50">
          <iframe title="map" src={mapSrc} className="h-full w-full min-h-[60vh]" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
