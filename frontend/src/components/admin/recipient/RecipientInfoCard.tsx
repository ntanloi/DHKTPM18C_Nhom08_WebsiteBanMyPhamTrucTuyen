import React from 'react';
import { formatDate } from '../../../utils/orderStatusUtils';

interface RecipientInformation {
  id: number;
  recipientPhone: string;
  shippingRecipientAddress: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientEmail: string;
  isAnotherReceiver: boolean;
  createdAt: string;
}

interface RecipientInfoCardProps {
  recipient: RecipientInformation;
}

const RecipientInfoCard: React.FC<RecipientInfoCardProps> = ({ recipient }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          Thông Tin Người Nhận
        </h3>
        {recipient.isAnotherReceiver && (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
            Người nhận khác
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-pink-100">
            <svg
              className="h-5 w-5 text-pink-600"
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
          </div>
          <div>
            <p className="text-xs text-gray-500">Họ và tên</p>
            <p className="text-sm font-medium text-gray-900">
              {recipient.recipientFirstName} {recipient.recipientLastName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
            <svg
              className="h-5 w-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <a
              href={`mailto:${recipient.recipientEmail}`}
              className="text-sm font-medium text-gray-900 hover:text-pink-600"
            >
              {recipient.recipientEmail}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Số điện thoại</p>
            <a
              href={`tel:${recipient.recipientPhone}`}
              className="text-sm font-medium text-gray-900 hover:text-pink-600"
            >
              {recipient.recipientPhone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">Địa chỉ giao hàng</p>
            <p className="text-sm text-gray-900">
              {recipient.shippingRecipientAddress}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <p className="text-xs text-gray-500">
            Thông tin tạo lúc: {formatDate(recipient.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipientInfoCard;
