import { useState } from 'react';
import AllBrandSlide from '../../components/user/ui/AllBrandSlide';

// Định nghĩa kiểu dữ liệu
type Brand = {
  name: string;
  url: string;
};

type BrandsByLetter = {
  [key: string]: Brand[];
};

export default function BrandPage() {
  const [selectedLetter, setSelectedLetter] = useState('A');

  // Danh sách alphabet
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  // Dữ liệu brands theo từng chữ cái
  const brandsByLetter: BrandsByLetter = {
    A: [
      { name: 'AHC', url: '#' },
      { name: 'AVENE', url: '#' },
      { name: 'AMUSE', url: '#' },
      { name: 'AESTURA', url: '#' },
      { name: 'ANESSA', url: '#' },
      { name: 'SOME BY MI', url: '#' },
      { name: 'MERZY', url: '#' },
      { name: 'INNISFREE', url: '#' },
    ],
    B: [
      { name: 'BIODERMA', url: '#' },
      { name: 'BEAUTY OF JOSEON', url: '#' },
      { name: 'BEPLAIN', url: '#' },
      { name: 'BEYOND', url: '#' },
      { name: 'BIFESTA', url: '#' },
      { name: 'BLACK MONSTER', url: '#' },
      { name: 'BLACKROUGE', url: '#' },
      { name: 'BY WISHTREND', url: '#' },
    ],
    C: [
      { name: 'CLIO', url: '#' },
      { name: 'CNP', url: '#' },
      { name: 'COCOON', url: '#' },
      { name: 'COSRX', url: '#' },
      { name: 'CELIMAX', url: '#' },
      { name: 'CERAVE', url: '#' },
      { name: 'CETAPHIL', url: '#' },
      { name: 'CHER', url: '#' },
    ],
    D: [
      { name: 'DEAR DAHLIA', url: '#' },
      { name: 'DEAR KLAIRS', url: '#' },
      { name: 'DERMALOGICA', url: '#' },
      { name: 'DHC', url: '#' },
      { name: 'DECORTÉ', url: '#' },
      { name: 'DINTO', url: '#' },
      { name: 'DR.JART+', url: '#' },
      { name: 'DRUNK ELEPHANT', url: '#' },
    ],
    E: [
      { name: 'ELIZAVECCA', url: '#' },
      { name: 'ELIXIR', url: '#' },
      { name: 'ERBORIAN', url: '#' },
      { name: 'ESPOIR', url: '#' },
      { name: 'ETUDE', url: '#' },
      { name: 'EUCERIN', url: '#' },
      { name: 'EVIAN', url: '#' },
      { name: 'EVOLUDERM COSMETIC', url: '#' },
    ],
    F: [
      { name: 'FILA', url: '#' },
      { name: 'FRESHIAN', url: '#' },
      { name: 'FUSION', url: '#' },
      { name: 'FILLMED', url: '#' },
      { name: 'FOREO', url: '#' },
      { name: 'TSUBAKI', url: '#' },
      { name: 'TOCKLABO', url: '#' },
    ],
    G: [
      { name: 'GLINT', url: '#' },
      { name: 'GOODAL', url: '#' },
      { name: 'GUERLAIN', url: '#' },
      { name: 'GLOWRX', url: '#' },
      { name: 'OLAY BY', url: '#' },
      { name: 'GO.NATU', url: '#' },
      { name: 'SWEET TREAT', url: '#' },
      { name: 'VENZEN', url: '#' },
    ],
    H: [
      { name: 'HADA LABO', url: '#' },
      { name: 'HARUHARU', url: '#' },
      { name: 'HERA', url: '#' },
      { name: 'HOLIKAHOLIKA', url: '#' },
      { name: 'HEIMISH', url: '#' },
      { name: 'HELLO SKIN', url: '#' },
      { name: 'HEROES OF SECRETS', url: '#' },
      { name: 'VACOSI', url: '#' },
    ],
    I: [
      { name: "I'M FROM", url: '#' },
      { name: 'ISOI', url: '#' },
      { name: 'INNISFREE', url: '#' },
      { name: 'ISNTREE', url: '#' },
      { name: 'ILOOM RA', url: '#' },
      { name: 'INN', url: '#' },
    ],
    J: [
      { name: 'JUNG', url: '#' },
      { name: 'JUNG SAEMMOOL', url: '#' },
      { name: 'JOLSE', url: '#' },
      { name: 'JAMINKYUNG', url: '#' },
      { name: 'JOOCYEE', url: '#' },
      { name: 'JUST', url: '#' },
    ],
    K: [
      { name: 'KLAVUU', url: '#' },
      { name: 'KLAIRS', url: '#' },
      { name: 'SOME BY MI', url: '#' },
      { name: 'KOSE', url: '#' },
      { name: 'KUMANO-YU', url: '#' },
      { name: 'KUNDAL', url: '#' },
      { name: 'LE TIFF', url: '#' },
      { name: 'LAURA MERCIER', url: '#' },
    ],
    L: [
      { name: "L'OREAL PARIS", url: '#' },
      { name: 'LA ROCHE-POSAY', url: '#' },
      { name: 'LANEIGE', url: '#' },
      { name: 'LAROCHE', url: '#' },
      { name: 'LA MER', url: '#' },
      { name: 'LE LABO FRAGRANCE', url: '#' },
      { name: 'LE PETIT', url: '#' },
      { name: 'LIFEBUOY', url: '#' },
    ],
    M: [
      { name: 'MAC', url: '#' },
      { name: 'MAKE P:REM', url: '#' },
      { name: 'MERZY', url: '#' },
      { name: 'MISE EN SCÈNE', url: '#' },
      { name: 'MURAD', url: '#' },
      { name: 'MAMONDE', url: '#' },
      { name: 'MISSHA', url: '#' },
      { name: 'MOONSHOT', url: '#' },
    ],
    N: [
      { name: 'NARS', url: '#' },
      { name: 'NATURIE', url: '#' },
      { name: 'NATURE REPUBLIC', url: '#' },
      { name: 'NACIFIC', url: '#' },
      { name: 'NEOGEN', url: '#' },
      { name: 'NEUTROGENA', url: '#' },
      { name: 'NEXTON', url: '#' },
    ],
    O: [
      { name: 'OBAGI', url: '#' },
      { name: 'OHUI', url: '#' },
      { name: 'ONGREDIENTS', url: '#' },
      { name: 'OFELIA', url: '#' },
      { name: 'ORDIARY', url: '#' },
      { name: 'ORGANIC SHOP', url: '#' },
      { name: 'ORIGINS', url: '#' },
      { name: 'ORIKI', url: '#' },
    ],
    P: [
      { name: "PAULA'S CHOICE", url: '#' },
      { name: 'PAYOT', url: '#' },
      { name: 'PERIPERA', url: '#' },
      { name: 'PIXI', url: '#' },
      { name: 'POLA', url: '#' },
      { name: "PON'S", url: '#' },
      { name: 'ROMAND', url: '#' },
      { name: 'PYUNKANG YUL', url: '#' },
    ],
    Q: [
      { name: 'QUE', url: '#' },
      { name: 'QIRINESS', url: '#' },
    ],
    R: [
      { name: "ROUND A'ROUND", url: '#' },
      { name: 'REAL TECHNIQUES', url: '#' },
      { name: 'RETINOL', url: '#' },
      { name: 'ROHTO', url: '#' },
      { name: 'REVLON', url: '#' },
      { name: 'RICE FORCE', url: '#' },
      { name: 'ROMAND', url: '#' },
      { name: 'ROSETTE', url: '#' },
    ],
    S: [
      { name: 'SENKA', url: '#' },
      { name: 'SHISEIDO', url: '#' },
      { name: 'SKINFOOD', url: '#' },
      { name: 'SOME BY MI', url: '#' },
      { name: 'SOONJUNG', url: '#' },
      { name: 'ST.IVES', url: '#' },
      { name: 'SULWHASOO', url: '#' },
      { name: 'SU:M37', url: '#' },
    ],
    T: [
      { name: 'THE FACE SHOP', url: '#' },
      { name: 'THE ORDINARY', url: '#' },
      { name: 'THE WHOO', url: '#' },
      { name: 'TIRTIR', url: '#' },
      { name: 'TORRIDEN', url: '#' },
      { name: 'TSUBAKI', url: '#' },
      { name: 'TSUYA', url: '#' },
      { name: 'TOCKLABO', url: '#' },
    ],
    U: [
      { name: 'UNPA', url: '#' },
      { name: 'URBAN DECAY', url: '#' },
      { name: 'UNO', url: '#' },
    ],
    V: [
      { name: 'VACOSI', url: '#' },
      { name: 'VERITE', url: '#' },
      { name: 'VICHY', url: '#' },
      { name: 'VITAL BEAUTIE', url: '#' },
      { name: 'VIETCO', url: '#' },
    ],
    W: [
      { name: 'WHAMISA', url: '#' },
      { name: 'WHOO', url: '#' },
      { name: 'WISHFUL', url: '#' },
      { name: 'WINE PHILOSOPHY', url: '#' },
    ],
    Y: [
      { name: 'YAMADA', url: '#' },
      { name: 'YVES ROCHER', url: '#' },
    ],
    Z: [{ name: 'ZA', url: '#' }],
    '#': [
      { name: '3CE', url: '#' },
      { name: '107', url: '#' },
      { name: 'REFRESHING', url: '#' },
      { name: 'CEX', url: '#' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Container giống HomePage */}
      <div className="container mx-auto px-4 py-6">
        {/* Title */}

        {/* Brand Slide */}
        <AllBrandSlide />
        <h1 className="mt-8 mb-8 text-center text-2xl font-bold tracking-wide uppercase">
          TẤT CẢ THƯƠNG HIỆU
        </h1>

        {/* Alphabet Navigation */}
        <div className="mt-10 flex flex-wrap justify-center gap-2 pb-6">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                selectedLetter === letter
                  ? 'bg-black text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Brand List */}
        <div className="mt-10 mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl font-bold text-white shadow-lg">
              {selectedLetter}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {brandsByLetter[selectedLetter]?.map(
              (brand: Brand, index: number) => (
                <a
                  key={index}
                  href={brand.url}
                  className="py-2 text-sm text-gray-700 transition hover:text-[#c0595c] hover:underline"
                >
                  {brand.name}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
