import type { FavoriteListResponse } from '../api/favoriteList';

export const mockFavorites: FavoriteListResponse[] = [
  // User 1 favorites (3 products)
  { id: 1, userId: 1, productId: 1, createdAt: '2024-11-20T10:00:00Z' },
  { id: 2, userId: 1, productId: 2, createdAt: '2024-11-18T14:30:00Z' },
  { id: 3, userId: 1, productId: 7, createdAt: '2024-11-15T09:20:00Z' },

  // User 2 favorites (4 products)
  { id: 4, userId: 2, productId: 1, createdAt: '2024-11-22T11:15:00Z' },
  { id: 5, userId: 2, productId: 3, createdAt: '2024-11-19T16:45:00Z' },
  { id: 6, userId: 2, productId: 8, createdAt: '2024-11-17T13:20:00Z' },
  { id: 7, userId: 2, productId: 10, createdAt: '2024-11-14T10:30:00Z' },

  // User 3 favorites (5 products)
  { id: 8, userId: 3, productId: 7, createdAt: '2024-11-23T15:00:00Z' },
  { id: 9, userId: 3, productId: 8, createdAt: '2024-11-21T12:30:00Z' },
  { id: 10, userId: 3, productId: 1, createdAt: '2024-11-20T08:45:00Z' },
  { id: 11, userId: 3, productId: 4, createdAt: '2024-11-18T14:20:00Z' },
  { id: 12, userId: 3, productId: 5, createdAt: '2024-11-16T11:00:00Z' },

  // User 4 favorites (3 products)
  { id: 13, userId: 4, productId: 2, createdAt: '2024-11-22T09:30:00Z' },
  { id: 14, userId: 4, productId: 8, createdAt: '2024-11-20T16:15:00Z' },
  { id: 15, userId: 4, productId: 10, createdAt: '2024-11-19T13:45:00Z' },

  // User 5 favorites (2 products)
  { id: 16, userId: 5, productId: 3, createdAt: '2024-11-21T10:20:00Z' },
  { id: 17, userId: 5, productId: 10, createdAt: '2024-11-17T15:30:00Z' },

  // User 6 favorites (4 products)
  { id: 18, userId: 6, productId: 7, createdAt: '2024-11-23T11:00:00Z' },
  { id: 19, userId: 6, productId: 8, createdAt: '2024-11-20T14:30:00Z' },
  { id: 20, userId: 6, productId: 9, createdAt: '2024-11-18T09:15:00Z' },
  { id: 21, userId: 6, productId: 10, createdAt: '2024-11-15T16:45:00Z' },

  // User 7 favorites (2 products)
  { id: 22, userId: 7, productId: 1, createdAt: '2024-11-16T13:30:00Z' },
  { id: 23, userId: 7, productId: 6, createdAt: '2024-11-14T10:00:00Z' },

  // User 8 favorites (3 products)
  { id: 24, userId: 8, productId: 2, createdAt: '2024-11-22T15:20:00Z' },
  { id: 25, userId: 8, productId: 4, createdAt: '2024-11-19T11:45:00Z' },
  { id: 26, userId: 8, productId: 5, createdAt: '2024-11-17T09:30:00Z' },
];

// Helper: Get top favorited products
export const getTopFavoritedProducts = (
  limit = 5,
): Array<{ productId: number; count: number }> => {
  const productCounts = mockFavorites.reduce(
    (acc, fav) => {
      acc[fav.productId] = (acc[fav.productId] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return Object.entries(productCounts)
    .map(([productId, count]) => ({ productId: Number(productId), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Mock Service
let favoriteIdCounter = mockFavorites.length + 1;

export const mockFavoriteService = {
  getAllFavorites: async (): Promise<FavoriteListResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockFavorites];
  },

  getFavoriteById: async (
    favoriteId: number,
  ): Promise<FavoriteListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const favorite = mockFavorites.find((f) => f.id === favoriteId);
    if (!favorite) throw new Error('Favorite not found');
    return { ...favorite };
  },

  getFavoritesByUserId: async (
    userId: number,
  ): Promise<FavoriteListResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockFavorites.filter((f) => f.userId === userId);
  },

  getFavoritesByProductId: async (
    productId: number,
  ): Promise<FavoriteListResponse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockFavorites.filter((f) => f.productId === productId);
  },

  getFavoriteCountByProductId: async (productId: number): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockFavorites.filter((f) => f.productId === productId).length;
  },

  checkIsFavorited: async (
    userId: number,
    productId: number,
  ): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockFavorites.some(
      (f) => f.userId === userId && f.productId === productId,
    );
  },

  createFavorite: async (request: any): Promise<FavoriteListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Check if already favorited
    const existing = mockFavorites.find(
      (f) => f.userId === request.userId && f.productId === request.productId,
    );
    if (existing) {
      throw new Error('Product already favorited');
    }

    const newFavorite: FavoriteListResponse = {
      id: favoriteIdCounter++,
      userId: request.userId,
      productId: request.productId,
      createdAt: new Date().toISOString(),
    };
    mockFavorites.push(newFavorite);
    return { ...newFavorite };
  },

  deleteFavorite: async (favoriteId: number): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockFavorites.findIndex((f) => f.id === favoriteId);
    if (index === -1) throw new Error('Favorite not found');
    mockFavorites.splice(index, 1);
    return { message: 'Favorite deleted successfully' };
  },

  deleteFavoriteByUserAndProduct: async (
    userId: number,
    productId: number,
  ): Promise<{ message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockFavorites.findIndex(
      (f) => f.userId === userId && f.productId === productId,
    );
    if (index === -1) throw new Error('Favorite not found');
    mockFavorites.splice(index, 1);
    return { message: 'Favorite deleted successfully' };
  },

  getTopFavoritedProducts: async (limit = 5) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getTopFavoritedProducts(limit);
  },
};
