import type { User } from './User';
import type { Product } from './Product';
import type { ReviewImage } from './ReviewImage';

export interface Review {
  id: number;
  userId: number;
  productId: number;
  content: string;
  rating: number;
  title: string;
  email: string;
  nickname: string;
  isRecommend: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  product?: Product;
  reviewImages?: ReviewImage[];
}
