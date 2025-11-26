import { ChevronRight } from 'lucide-react';

interface UniversalDropdownProps {
  isVisible: boolean;
  data: any;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function UniversalDropdown({
  isVisible,
  data,
  onMouseEnter,
  onMouseLeave,
}: UniversalDropdownProps) {
  if (!isVisible || !data) return null;

  return (
    <>
      {/* Vùng cầu nối vô hình để không bị mất dropdown khi di chuyển chuột */}
      <div
        className="fixed right-0 left-0 z-50 h-4"
        style={{ top: 'calc(var(--header-height) + 26.85px + 50px - 16px)' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {/* Dropdown chính */}
      <div
        className="animate-fadeIn fixed right-0 left-0 z-50 bg-white shadow-2xl"
        style={{ top: 'calc(var(--header-height) + 26.85px + 50px)' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="container mx-auto px-20 py-8">
          <div className="flex gap-8">
            {/* Cột bên trái - Menu */}
            <div className="flex gap-12">
              {data.columns && data.columns.length > 0 ? (
                <>
                  {/* Có title chính */}
                  {data.title && (
                    <div className="w-80 shrink-0">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-xl font-bold">{data.title}</h3>
                        <ChevronRight className="text-gray-400" size={20} />
                      </div>
                      <ul className="space-y-4">
                        {data.columns[0].items.map(
                          (item: string, idx: number) => (
                            <li
                              key={idx}
                              className="cursor-pointer text-sm transition-colors hover:text-pink-500"
                            >
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Multi-column layout */}
                  {data.type === 'multi-column' && data.columns.length > 1 && (
                    <div className="flex gap-12">
                      {data.columns.map((column: any, colIdx: number) => (
                        <div key={colIdx} className="min-w-[200px]">
                          {column.title && (
                            <h4 className="mb-4 text-sm font-bold uppercase">
                              {column.title}
                            </h4>
                          )}
                          <ul className="space-y-3">
                            {column.items.map((item: string, idx: number) => (
                              <li
                                key={idx}
                                className="cursor-pointer text-sm transition-colors hover:text-pink-500"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Single column với title */}
                  {data.type === 'multi-column' &&
                    data.columns.length === 1 &&
                    !data.title && (
                      <div className="min-w-[200px]">
                        {data.columns[0].title && (
                          <h4 className="mb-4 text-sm font-bold uppercase">
                            {data.columns[0].title}
                          </h4>
                        )}
                        <ul className="space-y-3">
                          {data.columns[0].items.map(
                            (item: string, idx: number) => (
                              <li
                                key={idx}
                                className="cursor-pointer text-sm transition-colors hover:text-pink-500"
                              >
                                {item}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </>
              ) : data.items ? (
                // Simple list
                <div className="w-80 shrink-0">
                  <ul className="space-y-4">
                    {data.items.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="cursor-pointer text-sm transition-colors hover:text-pink-500"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Banners bên phải */}
            {data.banners && data.banners.length > 0 && (
              <div
                className={`grid flex-1 gap-4 ${
                  data.banners.length === 1
                    ? 'grid-cols-1'
                    : data.banners.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                }`}
              >
                {data.banners.map((banner: any, idx: number) => (
                  <div
                    key={idx}
                    className={`${banner.bg || 'bg-gray-200'} flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg p-6 shadow-lg transition-transform hover:scale-105`}
                  >
                    <span className="mb-2 text-center text-xl font-bold text-white drop-shadow-lg">
                      {banner.title}
                    </span>
                    {banner.subtitle && (
                      <span className="text-center text-sm text-white drop-shadow">
                        {banner.subtitle}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
