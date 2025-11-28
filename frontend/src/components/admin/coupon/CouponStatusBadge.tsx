import React from 'react';

interface CouponStatusBadgeProps {
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

const CouponStatusBadge: React.FC<CouponStatusBadgeProps> = ({
  isActive,
  validFrom,
  validTo,
}) => {
  const now = new Date();
  const startDate = new Date(validFrom);
  const endDate = new Date(validTo);

  let status: 'active' | 'inactive' | 'expired' | 'upcoming';
  let label: string;
  let colorClasses: string;

  if (!isActive) {
    status = 'inactive';
    label = 'Đã vô hiệu hóa';
    colorClasses = 'bg-red-100 text-red-800';
  } else if (endDate < now) {
    status = 'expired';
    label = 'Hết hạn';
    colorClasses = 'bg-gray-100 text-gray-800';
  } else if (startDate > now) {
    status = 'upcoming';
    label = 'Sắp có hiệu lực';
    colorClasses = 'bg-blue-100 text-blue-800';
  } else {
    status = 'active';
    label = 'Đang hoạt động';
    colorClasses = 'bg-green-100 text-green-800';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${colorClasses}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === 'active'
            ? 'bg-green-600'
            : status === 'upcoming'
              ? 'bg-blue-600'
              : status === 'expired'
                ? 'bg-gray-600'
                : 'bg-red-600'
        }`}
      />
      {label}
    </span>
  );
};

export default CouponStatusBadge;
