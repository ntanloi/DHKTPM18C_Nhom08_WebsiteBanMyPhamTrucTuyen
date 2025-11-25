interface SearchDropdownProps {
  isVisible: boolean;
  searchValue: string;
}

const searchSuggestions = [
  'son peripera',
  'toner pad',
  'cushion clio',
  'lipcerin',
  'pad',
  'mặt nạ',
  'sữa rửa mặt',
];

export default function SearchDropdown({ isVisible }: SearchDropdownProps) {
  if (!isVisible) return null;

  return (
    <div className="animate-fadeIn absolute top-full right-0 left-0 z-50 mt-2 rounded-lg bg-white shadow-2xl">
      <div className="p-4">
        <h4 className="mb-3 text-xs font-semibold text-gray-500 uppercase">
          Tìm kiếm nhiều nhất
        </h4>
        <ul className="space-y-2">
          {searchSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="cursor-pointer rounded px-3 py-2 text-sm transition-colors hover:bg-pink-50"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
