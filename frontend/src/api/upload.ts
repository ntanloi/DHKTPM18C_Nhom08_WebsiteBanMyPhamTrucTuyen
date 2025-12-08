import api from '../lib/api';

/**
 * Upload single image to Cloudinary
 * @param file - File to upload
 * @param folder - Folder in Cloudinary (default: "products")
 * @returns URL of uploaded image
 */
export const uploadImage = async (
  file: File,
  folder: string = 'products',
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await api.post<{ url: string; message: string }>(
    '/upload/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data.url;
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of files to upload
 * @param folder - Folder in Cloudinary (default: "products")
 * @returns Response with URLs and errors
 */
export const uploadImages = async (
  files: File[],
  folder: string = 'products',
): Promise<{
  urls: string[];
  success: number;
  total: number;
  errors?: string[];
}> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('folder', folder);

  const response = await api.post<{
    urls: string[];
    success: number;
    total: number;
    errors?: string[];
  }>('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Delete image from Cloudinary
 * @param imageUrl - URL of image to delete
 * @returns Success status
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  const response = await api.delete<{ success: boolean; message: string }>(
    '/upload/image',
    {
      params: { url: imageUrl },
    },
  );

  return response.data.success;
};
