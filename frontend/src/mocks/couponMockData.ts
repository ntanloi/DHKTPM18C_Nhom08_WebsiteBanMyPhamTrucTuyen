import type { CouponResponse } from '../api/coupon';

export const mockCoupons: CouponResponse[] = [
  {
    id: 1,
    code: 'SUMMER2025',
    description: 'Giảm 20% cho đơn hàng mua mỹ phẩm mùa hè',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 500000,
    maxUsageValue: 100000,
    validFrom: '2025-06-01T00:00:00',
    validTo: '2025-08-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-01T10:00:00',
    updatedAt: '2025-01-01T10:00:00',
  },
  {
    id: 2,
    code: 'NEWMEMBER50K',
    description: 'Mã giảm 50,000đ cho khách hàng mới',
    isActive: true,
    discountType: 'FIXED',
    discountValue: 50000,
    minOrderValue: 300000,
    maxUsageValue: 50000,
    validFrom: '2025-01-01T00:00:00',
    validTo: '2025-12-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-01T08:00:00',
    updatedAt: '2025-01-01T08:00:00',
  },
  {
    id: 3,
    code: 'BEAUTY100K',
    description: 'Giảm 100,000đ cho đơn hàng từ 1 triệu',
    isActive: true,
    discountType: 'FIXED',
    discountValue: 100000,
    minOrderValue: 1000000,
    maxUsageValue: 100000,
    validFrom: '2025-01-15T00:00:00',
    validTo: '2025-03-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-15T09:00:00',
    updatedAt: '2025-01-15T09:00:00',
  },
  {
    id: 4,
    code: 'FLASH15',
    description: 'Flash Sale - Giảm 15% cho tất cả sản phẩm',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 200000,
    maxUsageValue: 150000,
    validFrom: '2025-01-20T00:00:00',
    validTo: '2025-01-25T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-18T10:00:00',
    updatedAt: '2025-01-18T10:00:00',
  },
  {
    id: 5,
    code: 'SKINCARE30',
    description: 'Giảm 30% cho các sản phẩm chăm sóc da',
    isActive: false,
    discountType: 'PERCENTAGE',
    discountValue: 30,
    minOrderValue: 400000,
    maxUsageValue: 200000,
    validFrom: '2024-12-01T00:00:00',
    validTo: '2024-12-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2024-11-25T10:00:00',
    updatedAt: '2025-01-02T14:30:00',
  },
  {
    id: 6,
    code: 'FREESHIP30K',
    description: 'Miễn phí vận chuyển cho đơn từ 300,000đ',
    isActive: true,
    discountType: 'FIXED',
    discountValue: 30000,
    minOrderValue: 300000,
    maxUsageValue: 30000,
    validFrom: '2025-01-01T00:00:00',
    validTo: '2025-12-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-01T10:00:00',
    updatedAt: '2025-01-01T10:00:00',
  },
  {
    id: 7,
    code: 'VIP25',
    description: 'Ưu đãi VIP - Giảm 25% cho thành viên thân thiết',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 25,
    minOrderValue: 800000,
    maxUsageValue: 300000,
    validFrom: '2025-02-01T00:00:00',
    validTo: '2025-02-28T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-25T11:00:00',
    updatedAt: '2025-01-25T11:00:00',
  },
  {
    id: 8,
    code: 'WEEKEND200K',
    description: 'Giảm 200,000đ cho đơn hàng cuối tuần',
    isActive: true,
    discountType: 'FIXED',
    discountValue: 200000,
    minOrderValue: 1500000,
    maxUsageValue: 200000,
    validFrom: '2025-01-24T00:00:00',
    validTo: '2025-01-26T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-20T10:00:00',
    updatedAt: '2025-01-20T10:00:00',
  },
  {
    id: 9,
    code: 'MAKEUP50K',
    description: 'Giảm 50,000đ cho sản phẩm trang điểm',
    isActive: false,
    discountType: 'FIXED',
    discountValue: 50000,
    minOrderValue: 350000,
    maxUsageValue: 50000,
    validFrom: '2024-11-01T00:00:00',
    validTo: '2024-11-30T23:59:59',
    createdByUserId: 1,
    createdAt: '2024-10-28T10:00:00',
    updatedAt: '2024-12-01T09:00:00',
  },
  {
    id: 10,
    code: 'LOVESALE10',
    description: 'Sale Tình Yêu - Giảm 10% toàn bộ đơn hàng',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 250000,
    maxUsageValue: 80000,
    validFrom: '2025-02-10T00:00:00',
    validTo: '2025-02-14T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-02-01T10:00:00',
    updatedAt: '2025-02-01T10:00:00',
  },
  {
    id: 11,
    code: 'NEWYEAR2025',
    description: 'Chào năm mới - Giảm 2025K cho đơn từ 2 triệu',
    isActive: false,
    discountType: 'FIXED',
    discountValue: 2025000,
    minOrderValue: 2000000,
    maxUsageValue: 2025000,
    validFrom: '2024-12-31T00:00:00',
    validTo: '2025-01-05T23:59:59',
    createdByUserId: 1,
    createdAt: '2024-12-25T10:00:00',
    updatedAt: '2025-01-06T08:00:00',
  },
  {
    id: 12,
    code: 'FIRSTBUY100K',
    description: 'Giảm 100,000đ cho đơn hàng đầu tiên',
    isActive: true,
    discountType: 'FIXED',
    discountValue: 100000,
    minOrderValue: 500000,
    maxUsageValue: 100000,
    validFrom: '2025-01-01T00:00:00',
    validTo: '2025-12-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-01T10:00:00',
    updatedAt: '2025-01-01T10:00:00',
  },
  {
    id: 13,
    code: 'BLACKFRIDAY50',
    description: 'Black Friday - Giảm 50% tất cả sản phẩm',
    isActive: false,
    discountType: 'PERCENTAGE',
    discountValue: 50,
    minOrderValue: 600000,
    maxUsageValue: 500000,
    validFrom: '2024-11-25T00:00:00',
    validTo: '2024-11-30T23:59:59',
    createdByUserId: 1,
    createdAt: '2024-11-20T10:00:00',
    updatedAt: '2024-12-01T09:00:00',
  },
  {
    id: 14,
    code: 'PAYDAY15',
    description: 'Ngày lương vui vẻ - Giảm 15% toàn bộ đơn',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 400000,
    maxUsageValue: 120000,
    validFrom: '2025-01-28T00:00:00',
    validTo: '2025-01-31T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-01-25T10:00:00',
    updatedAt: '2025-01-25T10:00:00',
  },
  {
    id: 15,
    code: 'WOMENSDAY35',
    description: 'Ngày Quốc Tế Phụ Nữ - Giảm 35%',
    isActive: true,
    discountType: 'PERCENTAGE',
    discountValue: 35,
    minOrderValue: 700000,
    maxUsageValue: 250000,
    validFrom: '2025-03-05T00:00:00',
    validTo: '2025-03-10T23:59:59',
    createdByUserId: 1,
    createdAt: '2025-03-01T10:00:00',
    updatedAt: '2025-03-01T10:00:00',
  },
];

/**
 * Get coupon by ID
 */
export const getCouponById = (id: number): CouponResponse | undefined => {
  return mockCoupons.find((coupon) => coupon.id === id);
};

/**
 * Get coupon by code
 */
export const getCouponByCode = (code: string): CouponResponse | undefined => {
  return mockCoupons.find(
    (coupon) => coupon.code.toLowerCase() === code.toLowerCase(),
  );
};

/**
 * Get all active coupons (isActive = true và chưa hết hạn)
 */
export const getActiveCoupons = (): CouponResponse[] => {
  const now = new Date();
  return mockCoupons.filter((coupon) => {
    const validTo = coupon.validTo ? new Date(coupon.validTo) : new Date();
    return coupon.isActive && validTo >= now;
  });
};

/**
 * Get inactive coupons (isActive = false)
 */
export const getInactiveCoupons = (): CouponResponse[] => {
  return mockCoupons.filter((coupon) => !coupon.isActive);
};

/**
 * Get expired coupons (validTo < now)
 */
export const getExpiredCoupons = (): CouponResponse[] => {
  const now = new Date();
  return mockCoupons.filter((coupon) => {
    const validTo = coupon.validTo ? new Date(coupon.validTo) : new Date();
    return validTo < now;
  });
};

/**
 * Get upcoming coupons (validFrom > now)
 */
export const getUpcomingCoupons = (): CouponResponse[] => {
  const now = new Date();
  return mockCoupons.filter((coupon) => {
    const validFrom = coupon.validFrom ? new Date(coupon.validFrom) : new Date();
    return validFrom > now;
  });
};

/**
 * Get coupons by discount type
 */
export const getCouponsByType = (
  type: 'PERCENTAGE' | 'FIXED',
): CouponResponse[] => {
  return mockCoupons.filter((coupon) => coupon.discountType === type);
};

/**
 * Mock service for API calls
 */
export const mockCouponService = {
  getAllCoupons: async (): Promise<CouponResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockCoupons];
  },

  getActiveCoupons: async (): Promise<CouponResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getActiveCoupons();
  },

  getCouponById: async (couponId: number): Promise<CouponResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const coupon = getCouponById(couponId);
    if (!coupon) throw new Error('Coupon not found');
    return { ...coupon };
  },

  getCouponByCode: async (code: string): Promise<CouponResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const coupon = getCouponByCode(code);
    if (!coupon) throw new Error('Coupon not found');
    return { ...coupon };
  },

  createCoupon: async (data: any): Promise<CouponResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCoupon: CouponResponse = {
      id: Math.max(...mockCoupons.map((c) => c.id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCoupons.push(newCoupon);
    return { ...newCoupon };
  },

  updateCoupon: async (
    couponId: number,
    data: any,
  ): Promise<CouponResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockCoupons.findIndex((c) => c.id === couponId);
    if (index === -1) throw new Error('Coupon not found');

    mockCoupons[index] = {
      ...mockCoupons[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockCoupons[index] };
  },

  deactivateCoupon: async (couponId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const coupon = mockCoupons.find((c) => c.id === couponId);
    if (!coupon) throw new Error('Coupon not found');
    coupon.isActive = false;
    coupon.updatedAt = new Date().toISOString();
    return { message: 'Coupon deactivated successfully' };
  },

  deleteCoupon: async (couponId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockCoupons.findIndex((c) => c.id === couponId);
    if (index === -1) throw new Error('Coupon not found');
    mockCoupons.splice(index, 1);
    return { message: 'Coupon deleted successfully' };
  },
};
