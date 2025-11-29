import React from 'react';
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  getShipmentStatusLabel,
  getShipmentStatusColor,
  getReturnStatusLabel,
  getReturnStatusColor,
} from '../../../utils/orderStatusUtils';

interface OrderStatusBadgeProps {
  status: string;
  type?: 'order' | 'payment' | 'shipment' | 'return';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  type = 'order',
  size = 'md',
  showIcon = false,
}) => {
  const getLabel = () => {
    switch (type) {
      case 'payment':
        return getPaymentStatusLabel(status);
      case 'shipment':
        return getShipmentStatusLabel(status);
      case 'return':
        return getReturnStatusLabel(status);
      default:
        return getOrderStatusLabel(status);
    }
  };

  const getColor = () => {
    switch (type) {
      case 'payment':
        return getPaymentStatusColor(status);
      case 'shipment':
        return getShipmentStatusColor(status);
      case 'return':
        return getReturnStatusColor(status);
      default:
        return getOrderStatusColor(status);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const getIcon = () => {
    if (!showIcon) return null;

    const iconClass = 'mr-1 inline-block h-3 w-3';

    if (type === 'order') {
      switch (status) {
        case 'PENDING':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'CONFIRMED':
        case 'PROCESSING':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'SHIPPED':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          );
        case 'DELIVERED':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'CANCELLED':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          );
      }
    }

    return null;
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getColor()} ${sizeClasses[size]}`}
    >
      {getIcon()}
      {getLabel()}
    </span>
  );
};

export default OrderStatusBadge;
