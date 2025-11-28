
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
  RETURN_STATUS_LABELS,
  RETURN_STATUS_COLORS,
  VALID_STATUS_TRANSITIONS,
} from '../contants/orderConstants';

/**
 * Get label for order status
 */
export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status] || status;
};

/**
 * Get color class for order status
 */
export const getOrderStatusColor = (status: string): string => {
  return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get label for payment status
 */
export const getPaymentStatusLabel = (status: string): string => {
  return PAYMENT_STATUS_LABELS[status] || status;
};

/**
 * Get color class for payment status
 */
export const getPaymentStatusColor = (status: string): string => {
  return PAYMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get label for shipment status
 */
export const getShipmentStatusLabel = (status: string): string => {
  return SHIPMENT_STATUS_LABELS[status] || status;
};

/**
 * Get color class for shipment status
 */
export const getShipmentStatusColor = (status: string): string => {
  return SHIPMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get label for return status
 */
export const getReturnStatusLabel = (status: string): string => {
  return RETURN_STATUS_LABELS[status] || status;
};

/**
 * Get color class for return status
 */
export const getReturnStatusColor = (status: string): string => {
  return RETURN_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Check if status transition is valid
 */
export const isValidStatusTransition = (
  currentStatus: string,
  newStatus: string,
): boolean => {
  const validTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  return validTransitions.includes(newStatus);
};

/**
 * Get valid next statuses for current status
 */
export const getValidNextStatuses = (currentStatus: string): string[] => {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
};

/**
 * Format currency (VND)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('vi-VN');
};

/**
 * Format datetime
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('vi-VN');
};

/**
 * Format date range
 */
export const formatDateRange = (from: string, to: string): string => {
  return `${formatDate(from)} - ${formatDate(to)}`;
};

/**
 * Get relative time (e.g., "2 giờ trước")
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(date);
};

/**
 * Calculate order completion percentage
 */
export const getOrderProgressPercentage = (status: string): number => {
  const progressMap: Record<string, number> = {
    PENDING: 0,
    CONFIRMED: 20,
    PROCESSING: 40,
    SHIPPED: 70,
    DELIVERED: 100,
    CANCELLED: 0,
  };
  return progressMap[status] || 0;
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (status: string): boolean => {
  return ['PENDING', 'CONFIRMED', 'PROCESSING'].includes(status);
};

/**
 * Check if order can be edited
 */
export const canEditOrder = (status: string): boolean => {
  return status === 'PENDING';
};

/**
 * Get tracking URL by provider
 */
export const getTrackingUrl = (
  provider: string,
  trackingCode: string,
): string => {
  const urls: Record<string, string> = {
    GHN: `https://donhang.ghn.vn/?order_code=${trackingCode}`,
    GHTK: `https://khachhang.giaohangtietkiem.vn/web/guest/tra-cuu?code=${trackingCode}`,
    VNPOST: `https://www.vnpost.vn/vi-vn/dinh-vi/buu-pham?key=${trackingCode}`,
    JT: `https://www.jtexpress.vn/trajectoryQuery?track=${trackingCode}`,
    VIETTEL: `https://viettelpost.com.vn/thong-tin-don-hang?peopleTracking=${trackingCode}`,
    NINJA: `https://www.ninjavan.co/vi-vn/tracking?id=${trackingCode}`,
  };
  return urls[provider] || '#';
};

/**
 * Calculate total from order items
 */
export const calculateOrderTotal = (
  subtotal: number,
  shippingFee: number,
  discountAmount: number,
): number => {
  return subtotal + shippingFee - discountAmount;
};

/**
 * Generate order ID display format
 */
export const formatOrderId = (id: number): string => {
  return `#ORD-${String(id).padStart(6, '0')}`;
};

/**
 * Parse search query
 */
export const parseSearchQuery = (query: string): string => {
  return query.trim().toLowerCase();
};

/**
 * Check if order matches search query
 */
export const matchesSearchQuery = (order: any, query: string): boolean => {
  if (!query) return true;

  const searchLower = parseSearchQuery(query);
  const orderId = order.id.toString();
  const userName = (order.user?.fullName || '').toLowerCase();
  const userEmail = (order.user?.email || '').toLowerCase();
  const userPhone = (order.user?.phoneNumber || '').toLowerCase();

  return (
    orderId.includes(searchLower) ||
    userName.includes(searchLower) ||
    userEmail.includes(searchLower) ||
    userPhone.includes(searchLower)
  );
};
