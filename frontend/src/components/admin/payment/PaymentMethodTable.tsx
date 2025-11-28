import React from 'react';
import type { PaymentMethod } from '../../../types/PaymentMethod';
import { formatDateTime } from '../../../utils/orderStatusUtils';

interface PaymentMethodTableProps {
  methods: PaymentMethod[];
  onEdit: (id: number) => void;
  onToggleActive: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const PaymentMethodTable: React.FC<PaymentMethodTableProps> = ({
  methods,
  onEdit,
  onToggleActive,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách...</p>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="rounded-lg bg-white p-12 text-center shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <p className="mt-4 text-gray-600">Chưa có phương thức thanh toán nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Phương thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Mã
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Cập nhật
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {methods.map((method) => (
              <tr
                key={method.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {method.name}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="rounded bg-gray-100 px-3 py-1 font-mono text-xs font-medium text-gray-700">
                    {method.code}
                  </span>
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(method.id, method.isActive)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      method.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        method.isActive ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    ></span>
                    {method.isActive ? 'Hoạt động' : 'Tắt'}
                  </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-900">
                    {formatDateTime(method.createdAt)}
                  </p>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-500">
                    {formatDateTime(method.updatedAt)}
                  </p>
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(method.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Chỉnh sửa"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => onDelete(method.id)}
                      disabled={method.isActive}
                      className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                      title={
                        method.isActive
                          ? 'Không thể xóa phương thức đang hoạt động'
                          : 'Xóa'
                      }
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentMethodTable;
