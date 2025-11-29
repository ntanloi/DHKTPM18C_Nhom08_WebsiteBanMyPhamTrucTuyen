import type { CategoryResponse } from '../api/category';
import type { BrandResponse } from '../api/brand';

import type { ProductResponse, ProductDetailResponse } from '../api/product';
import type { ProductVariantResponse } from '../api/productVariant';
import type { VariantAttributeResponse } from '../api/variantAttribute';

import type { ReviewResponse } from '../api/review';
import type { ReviewImageResponse } from '../api/reviewImage';

import type {
  ProductImageResponse,
  ProductImageRequest,
} from '../api/productImage';

export const mockCategories: CategoryResponse[] = [
  {
    id: 1,
    name: 'Chăm Sóc Da',
    slug: 'cham-soc-da',
    parentCategoryId: null,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 2,
    name: 'Sữa Rửa Mặt',
    slug: 'sua-rua-mat',
    parentCategoryId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 3,
    name: 'Serum & Tinh Chất',
    slug: 'serum-tinh-chat',
    parentCategoryId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 4,
    name: 'Kem Dưỡng',
    slug: 'kem-duong',
    parentCategoryId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 5,
    name: 'Mặt Nạ',
    slug: 'mat-na',
    parentCategoryId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 6,
    name: 'Trang Điểm',
    slug: 'trang-diem',
    parentCategoryId: null,
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 7,
    name: 'Son Môi',
    slug: 'son-moi',
    parentCategoryId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 8,
    name: 'Phấn Mắt',
    slug: 'phan-mat',
    parentCategoryId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=300',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 9,
    name: 'Cushion & Kem Nền',
    slug: 'cushion-kem-nen',
    parentCategoryId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 10,
    name: 'Chăm Sóc Tóc',
    slug: 'cham-soc-toc',
    parentCategoryId: null,
    imageUrl:
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300',
    createdAt: '2024-01-03T08:00:00',
    updatedAt: '2024-01-03T08:00:00',
  },
  {
    id: 11,
    name: 'Dầu Gội',
    slug: 'dau-goi',
    parentCategoryId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300',
    createdAt: '2024-01-03T08:00:00',
    updatedAt: '2024-01-03T08:00:00',
  },
  {
    id: 12,
    name: 'Dầu Xả & Ủ Tóc',
    slug: 'dau-xa-u-toc',
    parentCategoryId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
    createdAt: '2024-01-03T08:00:00',
    updatedAt: '2024-01-03T08:00:00',
  },
  {
    id: 13,
    name: 'Nước Hoa',
    slug: 'nuoc-hoa',
    parentCategoryId: null,
    imageUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300',
    createdAt: '2024-01-04T08:00:00',
    updatedAt: '2024-01-04T08:00:00',
  },
  {
    id: 14,
    name: 'Chăm Sóc Cơ Thể',
    slug: 'cham-soc-co-the',
    parentCategoryId: null,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=300',
    createdAt: '2024-01-05T08:00:00',
    updatedAt: '2024-01-05T08:00:00',
  },
];

export const mockBrands: BrandResponse[] = [
  {
    id: 1,
    name: 'Innisfree',
    slug: 'innisfree',
    logoUrl: 'https://via.placeholder.com/100x50/90EE90/000000?text=Innisfree',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 2,
    name: 'COSRX',
    slug: 'cosrx',
    logoUrl: 'https://via.placeholder.com/100x50/87CEEB/000000?text=COSRX',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 3,
    name: 'La Roche-Posay',
    slug: 'la-roche-posay',
    logoUrl: 'https://via.placeholder.com/100x50/FFB6C1/000000?text=La+Roche',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 4,
    name: 'Some By Mi',
    slug: 'some-by-mi',
    logoUrl: 'https://via.placeholder.com/100x50/98FB98/000000?text=Some+By+Mi',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 5,
    name: 'The Ordinary',
    slug: 'the-ordinary',
    logoUrl:
      'https://via.placeholder.com/100x50/DDA0DD/000000?text=The+Ordinary',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 6,
    name: 'Cerave',
    slug: 'cerave',
    logoUrl: 'https://via.placeholder.com/100x50/F0E68C/000000?text=Cerave',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 7,
    name: '3CE',
    slug: '3ce',
    logoUrl: 'https://via.placeholder.com/100x50/FFB6C1/000000?text=3CE',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 8,
    name: 'Romand',
    slug: 'romand',
    logoUrl: 'https://via.placeholder.com/100x50/FFA07A/000000?text=Romand',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 9,
    name: 'MAC',
    slug: 'mac',
    logoUrl: 'https://via.placeholder.com/100x50/000000/FFFFFF?text=MAC',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 10,
    name: 'Maybelline',
    slug: 'maybelline',
    logoUrl: 'https://via.placeholder.com/100x50/FF69B4/000000?text=Maybelline',
    createdAt: '2024-01-02T08:00:00',
    updatedAt: '2024-01-02T08:00:00',
  },
  {
    id: 11,
    name: 'Cocoon',
    slug: 'cocoon',
    logoUrl: 'https://via.placeholder.com/100x50/90EE90/000000?text=Cocoon',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
  {
    id: 12,
    name: 'Bioderma',
    slug: 'bioderma',
    logoUrl: 'https://via.placeholder.com/100x50/87CEEB/000000?text=Bioderma',
    createdAt: '2024-01-01T08:00:00',
    updatedAt: '2024-01-01T08:00:00',
  },
];

export const mockProductVariants: ProductVariantResponse[] = [
  {
    id: 1,
    productId: 1,
    name: 'Dung tích 150ml',
    sku: 'INN-GTC-150ML',
    price: 320000,
    salePrice: 280000,
    stockQuantity: 50,
  },
  {
    id: 2,
    productId: 2,
    name: 'Dung tích 100ml',
    sku: 'COSRX-AHA-100ML',
    price: 450000,
    salePrice: 399000,
    stockQuantity: 35,
  },
  {
    id: 3,
    productId: 3,
    name: 'Dung tích 50ml',
    sku: 'LRP-EFF-50ML',
    price: 580000,
    salePrice: null,
    stockQuantity: 20,
  },
  {
    id: 4,
    productId: 4,
    name: 'Dung tích 30ml',
    sku: 'SBM-MIR-30ML',
    price: 380000,
    salePrice: 320000,
    stockQuantity: 45,
  },
  {
    id: 5,
    productId: 5,
    name: 'Dung tích 30ml',
    sku: 'ORD-NIA-30ML',
    price: 250000,
    salePrice: null,
    stockQuantity: 60,
  },
  {
    id: 6,
    productId: 6,
    name: 'Dung tích 354ml',
    sku: 'CERA-HYD-354ML',
    price: 420000,
    salePrice: 380000,
    stockQuantity: 40,
  },
  {
    id: 7,
    productId: 7,
    name: 'Màu Đỏ Cam #908',
    sku: '3CE-VEL-908',
    price: 320000,
    salePrice: null,
    stockQuantity: 25,
  },
  {
    id: 8,
    productId: 8,
    name: 'Màu Hồng Đào #21',
    sku: 'ROM-JUI-21',
    price: 180000,
    salePrice: 150000,
    stockQuantity: 55,
  },
  {
    id: 9,
    productId: 9,
    name: 'Tone Tự Nhiên #21',
    sku: 'MAC-STU-21',
    price: 850000,
    salePrice: null,
    stockQuantity: 15,
  },
  {
    id: 10,
    productId: 10,
    name: 'Màu Đen #01',
    sku: 'MAY-FIT-01',
    price: 220000,
    salePrice: 190000,
    stockQuantity: 70,
  },
];

export const mockVariantAttributes: VariantAttributeResponse[] = [
  { id: 1, productVariantId: 1, name: 'Dung tích', value: '150ml' },
  { id: 2, productVariantId: 1, name: 'Hương', value: 'Trà Xanh' },

  { id: 3, productVariantId: 2, name: 'Dung tích', value: '100ml' },
  { id: 4, productVariantId: 2, name: 'Nồng độ AHA/BHA', value: '7%' },

  { id: 5, productVariantId: 3, name: 'Dung tích', value: '50ml' },
  { id: 6, productVariantId: 3, name: 'SPF', value: '50+' },

  { id: 7, productVariantId: 4, name: 'Dung tích', value: '30ml' },
  {
    id: 8,
    productVariantId: 4,
    name: 'Thành phần chính',
    value: 'AHA, BHA, PHA',
  },

  { id: 9, productVariantId: 5, name: 'Dung tích', value: '30ml' },
  { id: 10, productVariantId: 5, name: 'Nồng độ', value: '10%' },

  { id: 11, productVariantId: 6, name: 'Dung tích', value: '354ml' },
  { id: 12, productVariantId: 6, name: 'Độ pH', value: '5.5' },

  { id: 13, productVariantId: 7, name: 'Màu sắc', value: 'Đỏ Cam' },
  { id: 14, productVariantId: 7, name: 'Mã màu', value: '#908 Warm Breeze' },
  { id: 15, productVariantId: 7, name: 'Finish', value: 'Velvet Matte' },

  { id: 16, productVariantId: 8, name: 'Màu sắc', value: 'Hồng Đào' },
  { id: 17, productVariantId: 8, name: 'Mã màu', value: '#21 Jujube' },
  { id: 18, productVariantId: 8, name: 'Finish', value: 'Juicy Lasting' },

  { id: 19, productVariantId: 9, name: 'Tone', value: 'Tự Nhiên' },
  { id: 20, productVariantId: 9, name: 'Shade', value: '#21 Natural Beige' },
  { id: 21, productVariantId: 9, name: 'Coverage', value: 'Full Coverage' },

  { id: 22, productVariantId: 10, name: 'Màu sắc', value: 'Đen' },
  { id: 23, productVariantId: 10, name: 'Công dụng', value: 'Chống Lem' },
];

export const mockProducts: ProductResponse[] = [
  {
    id: 1,
    name: 'Sữa Rửa Mặt Trà Xanh Innisfree',
    slug: 'sua-rua-mat-tra-xanh-innisfree',
    description:
      'Sữa rửa mặt dịu nhẹ từ trà xanh Jeju, làm sạch sâu, kiềm dầu hiệu quả',
    categoryId: 2,
    brandId: 1,
    status: 'active',
    createdAt: '2024-01-10T08:00:00',
    updatedAt: '2024-01-10T08:00:00',
  },
  {
    id: 2,
    name: 'COSRX AHA/BHA Clarifying Treatment Toner',
    slug: 'cosrx-aha-bha-toner',
    description:
      'Toner làm sạch sâu lỗ chân lông với AHA/BHA, cải thiện kết cấu da',
    categoryId: 2,
    brandId: 2,
    status: 'active',
    createdAt: '2024-01-11T08:00:00',
    updatedAt: '2024-01-11T08:00:00',
  },
  {
    id: 3,
    name: 'La Roche-Posay Effaclar Duo+',
    slug: 'la-roche-posay-effaclar-duo',
    description: 'Kem dưỡng giúp giảm mụn, mờ thâm, kiểm soát dầu cho da mụn',
    categoryId: 4,
    brandId: 3,
    status: 'active',
    createdAt: '2024-01-12T08:00:00',
    updatedAt: '2024-01-12T08:00:00',
  },
  {
    id: 4,
    name: 'Some By Mi AHA BHA PHA 30 Days Miracle Serum',
    slug: 'some-by-mi-miracle-serum',
    description:
      'Serum cải thiện da mụn trong 30 ngày với AHA, BHA, PHA và Tea Tree',
    categoryId: 3,
    brandId: 4,
    status: 'active',
    createdAt: '2024-01-13T08:00:00',
    updatedAt: '2024-01-13T08:00:00',
  },
  {
    id: 5,
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    slug: 'the-ordinary-niacinamide',
    description:
      'Serum thu nhỏ lỗ chân lông, kiểm soát dầu với Niacinamide 10%',
    categoryId: 3,
    brandId: 5,
    status: 'active',
    createdAt: '2024-01-14T08:00:00',
    updatedAt: '2024-01-14T08:00:00',
  },
  {
    id: 6,
    name: 'Cerave Hydrating Facial Cleanser',
    slug: 'cerave-hydrating-cleanser',
    description: 'Sữa rửa mặt dưỡng ẩm với Ceramides và Hyaluronic Acid',
    categoryId: 2,
    brandId: 6,
    status: 'active',
    createdAt: '2024-01-15T08:00:00',
    updatedAt: '2024-01-15T08:00:00',
  },
  {
    id: 7,
    name: '3CE Velvet Lip Tint',
    slug: '3ce-velvet-lip-tint',
    description: 'Son tint lì mượt mịn, màu sắc chuẩn Hàn Quốc, lâu trôi',
    categoryId: 7,
    brandId: 7,
    status: 'active',
    createdAt: '2024-01-16T08:00:00',
    updatedAt: '2024-01-16T08:00:00',
  },
  {
    id: 8,
    name: 'Romand Juicy Lasting Tint',
    slug: 'romand-juicy-lasting-tint',
    description: 'Son tint bóng căng mọng, giữ màu lâu, không khô môi',
    categoryId: 7,
    brandId: 8,
    status: 'active',
    createdAt: '2024-01-17T08:00:00',
    updatedAt: '2024-01-17T08:00:00',
  },
  {
    id: 9,
    name: 'MAC Studio Fix Fluid Foundation',
    slug: 'mac-studio-fix-foundation',
    description: 'Kem nền che phủ hoàn hảo, kiềm dầu 24h, finish mịn lì',
    categoryId: 9,
    brandId: 9,
    status: 'active',
    createdAt: '2024-01-18T08:00:00',
    updatedAt: '2024-01-18T08:00:00',
  },
  {
    id: 10,
    name: 'Maybelline Hyper Easy Liquid Eyeliner',
    slug: 'maybelline-hyper-easy-eyeliner',
    description: 'Kẻ mắt nước siêu mảnh, dễ kẻ, không lem, màu đen tuyền',
    categoryId: 8,
    brandId: 10,
    status: 'active',
    createdAt: '2024-01-19T08:00:00',
    updatedAt: '2024-01-19T08:00:00',
  },
];

export const mockProductImages: ProductImageResponse[] = [
  // Product 1: Innisfree Green Tea Cleanser (4 images)
  {
    id: 1,
    productId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  },
  {
    id: 2,
    productId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
  },
  {
    id: 3,
    productId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800',
  },
  {
    id: 4,
    productId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
  },

  // Product 2: COSRX AHA/BHA Toner (3 images)
  {
    id: 5,
    productId: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
  },
  {
    id: 6,
    productId: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800',
  },
  {
    id: 7,
    productId: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800',
  },

  // Product 3: La Roche-Posay Effaclar (5 images)
  {
    id: 8,
    productId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  },
  {
    id: 9,
    productId: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
  },
  {
    id: 10,
    productId: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
  },
  {
    id: 11,
    productId: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
  },
  {
    id: 12,
    productId: 3,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800',
  },

  // Product 4: Some By Mi Serum (4 images)
  {
    id: 13,
    productId: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
  },
  {
    id: 14,
    productId: 4,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  },
  {
    id: 15,
    productId: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
  },
  {
    id: 16,
    productId: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800',
  },

  // Product 5: The Ordinary Niacinamide (3 images)
  {
    id: 17,
    productId: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=800',
  },
  {
    id: 18,
    productId: 5,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800',
  },
  {
    id: 19,
    productId: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
  },

  // Product 6: Cerave Cleanser (4 images)
  {
    id: 20,
    productId: 6,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  },
  {
    id: 21,
    productId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
  },
  {
    id: 22,
    productId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
  },
  {
    id: 23,
    productId: 6,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=800',
  },

  // Product 7: 3CE Velvet Lip Tint (5 images)
  {
    id: 24,
    productId: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
  },
  {
    id: 25,
    productId: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1631214524020-7e18db5b9123?w=800',
  },
  {
    id: 26,
    productId: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
  },
  {
    id: 27,
    productId: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1627933353347-5f4eea98f459?w=800',
  },
  {
    id: 28,
    productId: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1610888746476-4ea4b9c449a7?w=800',
  },

  // Product 8: Romand Juicy Tint (4 images)
  {
    id: 29,
    productId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
  },
  {
    id: 30,
    productId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1631214524020-7e18db5b9123?w=800',
  },
  {
    id: 31,
    productId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1610888746476-4ea4b9c449a7?w=800',
  },
  {
    id: 32,
    productId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800',
  },

  // Product 9: MAC Studio Fix (3 images)
  {
    id: 33,
    productId: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
  },
  {
    id: 34,
    productId: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
  },
  {
    id: 35,
    productId: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800',
  },

  // Product 10: Maybelline Eyeliner (4 images)
  {
    id: 36,
    productId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=800',
  },
  {
    id: 37,
    productId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
  },
  {
    id: 38,
    productId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800',
  },
  {
    id: 39,
    productId: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
  },
];

export const mockReviewImages: ReviewImageResponse[] = [
  // Review 1 images
  {
    id: 1,
    reviewId: 1,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
  },
  {
    id: 2,
    reviewId: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
  },

  // Review 2 images
  {
    id: 3,
    reviewId: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
  },

  // Review 4 images
  {
    id: 4,
    reviewId: 4,
    imageUrl: 'https://images.unsplash.com/photo-1556228852-80f85f7c39d1?w=400',
  },
  {
    id: 5,
    reviewId: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
  },
  {
    id: 6,
    reviewId: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1608242155250-64b9f1f9c194?w=400',
  },

  // Review 6 images
  {
    id: 7,
    reviewId: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  },

  // Review 8 images
  {
    id: 8,
    reviewId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
  },
  {
    id: 9,
    reviewId: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1631214524020-7e18db5b9123?w=400',
  },

  // Review 11 images
  {
    id: 10,
    reviewId: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1583241800698-8be492dbe2c7?w=400',
  },
  {
    id: 11,
    reviewId: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
  },
  {
    id: 12,
    reviewId: 11,
    imageUrl:
      'https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=400',
  },
];

export const mockReviews: ReviewResponse[] = [
  // Product 1: Innisfree Green Tea Cleanser
  {
    id: 1,
    userId: 1,
    productId: 1,
    rating: 5,
    title: 'Sản phẩm tuyệt vời cho da dầu!',
    content:
      'Tôi đã sử dụng sữa rửa mặt này được 2 tuần và thấy da mình khá hơn nhiều. Lỗ chân lông được thu nhỏ, da ít bóng dầu hơn. Mùi trà xanh rất dễ chịu, không gây kích ứng.',
    nickname: 'Nguyễn Thị Lan',
    email: 'lannguyen@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-20T10:30:00Z',
    updatedAt: '2024-11-20T10:30:00Z',
  },
  {
    id: 2,
    userId: 2,
    productId: 1,
    rating: 4,
    title: 'Tốt nhưng hơi khô',
    content:
      'Sản phẩm làm sạch tốt nhưng da tôi hơi khô sau khi rửa. Có thể do da tôi nhạy cảm. Nhưng nhìn chung vẫn ok, sẽ tiếp tục dùng thêm.',
    nickname: 'Trần Minh',
    email: 'minhtr@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-18T15:20:00Z',
    updatedAt: '2024-11-18T15:20:00Z',
  },
  {
    id: 3,
    userId: 3,
    productId: 1,
    rating: 5,
    title: 'Must-have cho da dầu mụn',
    content:
      'Cứu tinh của da dầu mụn! Dùng được 1 tuần thấy mụn ẩn giảm rõ rệt. Giá cả phải chăng, chất lượng tốt. Sẽ mua thêm chai to.',
    nickname: 'Lê Hương',
    email: 'huongle@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-15T09:10:00Z',
    updatedAt: '2024-11-15T09:10:00Z',
  },

  // Product 2: COSRX AHA/BHA Toner
  {
    id: 4,
    userId: 1,
    productId: 2,
    rating: 5,
    title: 'Toner thần thánh cho da mụn!',
    content:
      'Đây là toner tốt nhất tôi từng dùng. AHA/BHA giúp lột da chết nhẹ nhàng, da mịn màng hơn hẳn. Mụn cũng giảm đi nhiều sau 2 tuần sử dụng. Đáng tiền!',
    nickname: 'Nguyễn Thị Lan',
    email: 'lannguyen@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-22T11:00:00Z',
    updatedAt: '2024-11-22T11:00:00Z',
  },
  {
    id: 5,
    userId: 4,
    productId: 2,
    rating: 4,
    title: 'Hiệu quả nhưng cần kiên trì',
    content:
      'Sản phẩm tốt nhưng cần dùng đều đặn mới thấy kết quả. Tuần đầu da hơi bong tróc nhẹ (purging) nhưng sau đó da sáng và mịn hơn.',
    nickname: 'Phạm Thu',
    email: 'thupham@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-19T14:30:00Z',
    updatedAt: '2024-11-19T14:30:00Z',
  },

  // Product 3: La Roche-Posay Effaclar
  {
    id: 6,
    userId: 2,
    productId: 3,
    rating: 5,
    title: 'Kem trị mụn hiệu quả nhất!',
    content:
      'Sau 1 tháng dùng, mụn giảm 80%. Thâm mờ đi rất nhiều. Sản phẩm hơi đắt nhưng đáng tiền. Đã giới thiệu cho nhiều bạn bè.',
    nickname: 'Trần Minh',
    email: 'minhtr@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-21T16:45:00Z',
    updatedAt: '2024-11-21T16:45:00Z',
  },
  {
    id: 7,
    userId: 5,
    productId: 3,
    rating: 4,
    title: 'Tốt cho da mụn nhưng hơi đắt',
    content:
      'Hiệu quả rõ rệt sau 2 tuần. Da ít mụn hơn, bớt sưng viêm. Nhược điểm là giá khá cao so với túi tiền sinh viên như mình.',
    nickname: 'Vũ Anh',
    email: 'anhvu@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-17T10:20:00Z',
    updatedAt: '2024-11-17T10:20:00Z',
  },

  // Product 7: 3CE Velvet Lip Tint
  {
    id: 8,
    userId: 3,
    productId: 7,
    rating: 5,
    title: 'Màu đẹp, lì mịn, bền màu!',
    content:
      'Son này màu đẹp quá! Lì mịn, không khô môi. Giữ màu suốt cả ngày dù ăn uống. Đã mua thêm 3 màu khác rồi. Highly recommend!',
    nickname: 'Lê Hương',
    email: 'huongle@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-23T13:15:00Z',
    updatedAt: '2024-11-23T13:15:00Z',
  },
  {
    id: 9,
    userId: 6,
    productId: 7,
    rating: 5,
    title: 'Best son lì ever!',
    content:
      'Màu chuẩn Hàn, lì nhưng không khô. Bám màu cực tốt. Ăn cơm phải lau nhẹ thôi, vẫn còn màu. Must-have trong túi makeup!',
    nickname: 'Hoàng My',
    email: 'myhoang@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-20T08:30:00Z',
    updatedAt: '2024-11-20T08:30:00Z',
  },

  // Product 8: Romand Juicy Tint
  {
    id: 10,
    userId: 4,
    productId: 8,
    rating: 5,
    title: 'Son tint bóng đẹp nhất!',
    content:
      'Màu hồng đào này quá xinh! Bóng căng mọng, không dính, không khô môi. Mùi thơm nhẹ rất dễ chịu. Đã repurchase lần 3 rồi.',
    nickname: 'Phạm Thu',
    email: 'thupham@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-22T14:00:00Z',
    updatedAt: '2024-11-22T14:00:00Z',
  },

  // Product 10: Maybelline Eyeliner
  {
    id: 11,
    userId: 5,
    productId: 10,
    rating: 5,
    title: 'Kẻ mắt tốt nhất trong tầm giá!',
    content:
      'Đầu mảnh, dễ kẻ, không lem. Giữ màu cả ngày. Giá rẻ mà chất lượng tốt. Đã dùng hết 2 cây rồi. Sẽ tiếp tục mua.',
    nickname: 'Vũ Anh',
    email: 'anhvu@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-21T09:45:00Z',
    updatedAt: '2024-11-21T09:45:00Z',
  },
  {
    id: 12,
    userId: 6,
    productId: 10,
    rating: 4,
    title: 'Tốt cho người mới tập kẻ mắt',
    content:
      'Đầu cọ dễ cầm, kẻ mượt. Phù hợp cho người mới học makeup như mình. Có thể kẻ mỏng hoặc đậm tùy ý. Recommend!',
    nickname: 'Hoàng My',
    email: 'myhoang@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-18T11:20:00Z',
    updatedAt: '2024-11-18T11:20:00Z',
  },

  // More reviews for diversity
  {
    id: 13,
    userId: 7,
    productId: 1,
    rating: 3,
    title: 'Bình thường',
    content:
      'Sản phẩm ok nhưng không có gì đặc biệt. Làm sạch được nhưng cảm giác hơi khô da. Có thể sẽ thử sản phẩm khác.',
    nickname: 'Đặng Linh',
    email: 'linhdan@gmail.com',
    isRecommend: false,
    createdAt: '2024-11-16T13:30:00Z',
    updatedAt: '2024-11-16T13:30:00Z',
  },
  {
    id: 14,
    userId: 8,
    productId: 2,
    rating: 5,
    title: 'Holy grail product!',
    content:
      'Toner này là must-have trong routine skincare của mình. Da sáng, mịn, mụn giảm. Đã dùng được 5 chai rồi. Không thể thiếu!',
    nickname: 'Bùi Hà',
    email: 'habuii@gmail.com',
    isRecommend: true,
    createdAt: '2024-11-14T10:00:00Z',
    updatedAt: '2024-11-14T10:00:00Z',
  },
];

let categoryIdCounter = mockCategories.length + 1;
let brandIdCounter = mockBrands.length + 1;
let productIdCounter = mockProducts.length + 1;
let variantIdCounter = mockProductVariants.length + 1;
let attributeIdCounter = mockVariantAttributes.length + 1;
let reviewIdCounter = mockReviews.length + 1;
let reviewImageIdCounter = mockReviewImages.length + 1;

export const mockCategoryService = {
  getAllCategories: async (): Promise<CategoryResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockCategories];
  },

  getCategoryById: async (categoryId: number): Promise<CategoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const category = mockCategories.find((c) => c.id === categoryId);
    if (!category) throw new Error('Category not found');
    return { ...category };
  },

  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const category = mockCategories.find((c) => c.slug === slug);
    if (!category) throw new Error('Category not found');
    return { ...category };
  },

  getCategoriesByParentId: async (
    parentId: number,
  ): Promise<CategoryResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCategories.filter((c) => c.parentCategoryId === parentId);
  },

  createCategory: async (data: any): Promise<CategoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newCategory: CategoryResponse = {
      id: categoryIdCounter++,
      name: data.name,
      slug: data.slug,
      parentCategoryId: data.parentCategoryId || null,
      imageUrl: data.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return { ...newCategory };
  },

  updateCategory: async (
    categoryId: number,
    data: any,
  ): Promise<CategoryResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockCategories.findIndex((c) => c.id === categoryId);
    if (index === -1) throw new Error('Category not found');

    mockCategories[index] = {
      ...mockCategories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockCategories[index] };
  },

  deleteCategory: async (categoryId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockCategories.findIndex((c) => c.id === categoryId);
    if (index === -1) throw new Error('Category not found');
    mockCategories.splice(index, 1);
    return { message: 'Category deleted successfully' };
  },
};

export const mockBrandService = {
  getAllBrands: async (): Promise<BrandResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockBrands];
  },

  getBrandById: async (brandId: number): Promise<BrandResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const brand = mockBrands.find((b) => b.id === brandId);
    if (!brand) throw new Error('Brand not found');
    return { ...brand };
  },

  getBrandBySlug: async (slug: string): Promise<BrandResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const brand = mockBrands.find((b) => b.slug === slug);
    if (!brand) throw new Error('Brand not found');
    return { ...brand };
  },

  createBrand: async (data: any): Promise<BrandResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newBrand: BrandResponse = {
      id: brandIdCounter++,
      name: data.name,
      slug: data.slug,
      logoUrl: data.logoUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockBrands.push(newBrand);
    return { ...newBrand };
  },

  updateBrand: async (brandId: number, data: any): Promise<BrandResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockBrands.findIndex((b) => b.id === brandId);
    if (index === -1) throw new Error('Brand not found');

    mockBrands[index] = {
      ...mockBrands[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockBrands[index] };
  },

  deleteBrand: async (brandId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockBrands.findIndex((b) => b.id === brandId);
    if (index === -1) throw new Error('Brand not found');
    mockBrands.splice(index, 1);
    return { message: 'Brand deleted successfully' };
  },
};

export const mockProductService = {
  getAllProducts: async (): Promise<ProductResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockProducts];
  },

  getProductById: async (productId: number): Promise<ProductDetailResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');

    const variant = mockProductVariants.find((v) => v.productId === productId);
    const category = mockCategories.find((c) => c.id === product.categoryId);
    const brand = mockBrands.find((b) => b.id === product.brandId);

    return {
      ...product,
      category,
      brand,
      productVariant: variant,
    };
  },

  getProductBySlug: async (slug: string): Promise<ProductDetailResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) throw new Error('Product not found');

    const variant = mockProductVariants.find((v) => v.productId === product.id);
    const category = mockCategories.find((c) => c.id === product.categoryId);
    const brand = mockBrands.find((b) => b.id === product.brandId);

    return {
      ...product,
      category,
      brand,
      productVariant: variant,
    };
  },

  getProductsByCategoryId: async (
    categoryId: number,
  ): Promise<ProductResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProducts.filter((p) => p.categoryId === categoryId);
  },

  getProductsByBrandId: async (brandId: number): Promise<ProductResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProducts.filter((p) => p.brandId === brandId);
  },

  getProductsByStatus: async (status: string): Promise<ProductResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProducts.filter((p) => p.status === status);
  },

  createProduct: async (data: any): Promise<ProductResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newProduct: ProductResponse = {
      id: productIdCounter++,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      categoryId: data.categoryId,
      brandId: data.brandId,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);

    // Create variant if provided
    if (data.variant) {
      const newVariant: ProductVariantResponse = {
        id: variantIdCounter++,
        productId: newProduct.id,
        name: data.variant.name || 'Default',
        sku: data.variant.sku,
        price: data.variant.price,
        salePrice: data.variant.salePrice || null,
        stockQuantity: data.variant.stockQuantity,
      };
      mockProductVariants.push(newVariant);

      // Create variant attributes if provided
      if (data.variant.attributes && Array.isArray(data.variant.attributes)) {
        data.variant.attributes.forEach((attr: any) => {
          if (attr.name && attr.value) {
            mockVariantAttributes.push({
              id: attributeIdCounter++,
              productVariantId: newVariant.id,
              name: attr.name,
              value: attr.value,
            });
          }
        });
      }
    }

    return { ...newProduct };
  },

  updateProduct: async (
    productId: number,
    data: any,
  ): Promise<ProductResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockProducts.findIndex((p) => p.id === productId);
    if (index === -1) throw new Error('Product not found');

    mockProducts[index] = {
      ...mockProducts[index],
      name: data.name,
      slug: data.slug,
      description: data.description,
      categoryId: data.categoryId,
      brandId: data.brandId,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };

    // Update variant if provided
    if (data.variant) {
      const variantIndex = mockProductVariants.findIndex(
        (v) => v.productId === productId,
      );
      if (variantIndex !== -1) {
        mockProductVariants[variantIndex] = {
          ...mockProductVariants[variantIndex],
          name: data.variant.name,
          sku: data.variant.sku,
          price: data.variant.price,
          salePrice: data.variant.salePrice || null,
          stockQuantity: data.variant.stockQuantity,
        };

        // Update attributes
        const variantId = mockProductVariants[variantIndex].id;

        // Remove old attributes
        const oldAttrIndices = mockVariantAttributes
          .map((attr, idx) => (attr.productVariantId === variantId ? idx : -1))
          .filter((idx) => idx !== -1)
          .reverse();
        oldAttrIndices.forEach((idx) => mockVariantAttributes.splice(idx, 1));

        // Add new attributes
        if (data.variant.attributes && Array.isArray(data.variant.attributes)) {
          data.variant.attributes.forEach((attr: any) => {
            if (attr.name && attr.value) {
              mockVariantAttributes.push({
                id: attributeIdCounter++,
                productVariantId: variantId,
                name: attr.name,
                value: attr.value,
              });
            }
          });
        }
      }
    }

    return { ...mockProducts[index] };
  },

  deleteProduct: async (productId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockProducts.findIndex((p) => p.id === productId);
    if (index === -1) throw new Error('Product not found');

    // Delete associated variant
    const variantIndex = mockProductVariants.findIndex(
      (v) => v.productId === productId,
    );
    if (variantIndex !== -1) {
      const variantId = mockProductVariants[variantIndex].id;

      // Delete associated attributes
      const attrIndices = mockVariantAttributes
        .map((attr, idx) => (attr.productVariantId === variantId ? idx : -1))
        .filter((idx) => idx !== -1)
        .reverse();
      attrIndices.forEach((idx) => mockVariantAttributes.splice(idx, 1));

      mockProductVariants.splice(variantIndex, 1);
    }

    mockProducts.splice(index, 1);
    return { message: 'Product deleted successfully' };
  },

  getVariantAttributesByVariantId: async (
    variantId: number,
  ): Promise<VariantAttributeResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockVariantAttributes.filter(
      (attr) => attr.productVariantId === variantId,
    );
  },
};

export const mockProductImageService = {
  getAllProductImages: async (): Promise<ProductImageResponse[]> => {
    return mockProductImages;
  },

  getProductImageById: async (
    imageId: number,
  ): Promise<ProductImageResponse> => {
    const image = mockProductImages.find((img) => img.id === imageId);
    if (!image) {
      throw new Error('Product image not found');
    }
    return image;
  },

  getProductImagesByProductId: async (
    productId: number,
  ): Promise<ProductImageResponse[]> => {
    return mockProductImages.filter((img) => img.productId === productId);
  },

  createProductImage: async (
    request: ProductImageRequest,
  ): Promise<ProductImageResponse> => {
    const newImage: ProductImageResponse = {
      id: mockProductImages.length + 1,
      ...request,
    };
    mockProductImages.push(newImage);
    return newImage;
  },

  updateProductImage: async (
    imageId: number,
    request: ProductImageRequest,
  ): Promise<ProductImageResponse> => {
    const index = mockProductImages.findIndex((img) => img.id === imageId);
    if (index === -1) {
      throw new Error('Product image not found');
    }
    mockProductImages[index] = { ...mockProductImages[index], ...request };
    return mockProductImages[index];
  },

  deleteProductImage: async (imageId: number): Promise<{ message: string }> => {
    const index = mockProductImages.findIndex((img) => img.id === imageId);
    if (index === -1) {
      throw new Error('Product image not found');
    }
    mockProductImages.splice(index, 1);
    return { message: 'Product image deleted successfully' };
  },
};

export const mockReviewService = {
  getAllReviews: async (): Promise<ReviewResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockReviews];
  },

  getReviewById: async (reviewId: number): Promise<ReviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const review = mockReviews.find((r) => r.id === reviewId);
    if (!review) throw new Error('Review not found');
    return { ...review };
  },

  getReviewsByProductId: async (
    productId: number,
  ): Promise<ReviewResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockReviews.filter((r) => r.productId === productId);
  },

  getReviewsByUserId: async (userId: number): Promise<ReviewResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockReviews.filter((r) => r.userId === userId);
  },

  createReview: async (request: any): Promise<ReviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newReview: ReviewResponse = {
      id: reviewIdCounter++,
      ...request,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockReviews.push(newReview);
    return { ...newReview };
  },

  updateReview: async (
    reviewId: number,
    request: any,
  ): Promise<ReviewResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = mockReviews.findIndex((r) => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');

    mockReviews[index] = {
      ...mockReviews[index],
      ...request,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockReviews[index] };
  },

  deleteReview: async (reviewId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockReviews.findIndex((r) => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');

    // Delete associated images
    const imageIndices = mockReviewImages
      .map((img, idx) => (img.reviewId === reviewId ? idx : -1))
      .filter((idx) => idx !== -1)
      .reverse();
    imageIndices.forEach((idx) => mockReviewImages.splice(idx, 1));

    mockReviews.splice(index, 1);
    return { message: 'Review deleted successfully' };
  },
};

export const mockReviewImageService = {
  getReviewImagesByReviewId: async (
    reviewId: number,
  ): Promise<ReviewImageResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockReviewImages.filter((img) => img.reviewId === reviewId);
  },

  createReviewImage: async (request: any): Promise<ReviewImageResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newImage: ReviewImageResponse = {
      id: reviewImageIdCounter++,
      ...request,
    };
    mockReviewImages.push(newImage);
    return { ...newImage };
  },

  deleteReviewImage: async (imageId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockReviewImages.findIndex((img) => img.id === imageId);
    if (index === -1) throw new Error('Review image not found');
    mockReviewImages.splice(index, 1);
    return { message: 'Review image deleted successfully' };
  },
};
