import { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import { Toast } from '../ui/Toast';
import type { ToastType } from '../ui/Toast';
import { AuthContext } from '../../../context/auth-context';
import {
  getReviewsByProductId,
  createReview,
  type ReviewResponse,
} from '../../../api/review';
import { createReviewImage } from '../../../api/reviewImage';

interface ReviewSectionProps {
  productId: number;
  productName: string;
  productImage?: string;
}

export default function ReviewSection({
  productId,
  productName,
}: ReviewSectionProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('ReviewSection must be used within AuthProvider');
  }
  const { user } = authContext;

  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRecommend, setIsRecommend] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    rating: '',
    nickname: '',
    email: '',
    title: '',
  });

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  // Load reviews on mount
  useEffect(() => {
    loadReviews();
  }, [productId]);

  // Pre-fill user info when modal opens
  useEffect(() => {
    if (isModalOpen && user) {
      setNickname(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [isModalOpen, user]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await getReviewsByProductId(productId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
      showToast('Không thể tải đánh giá', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedImages, ...files].slice(0, 5); // Max 5 images
      
      // Create preview URLs for new files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      
      setSelectedImages(newFiles);
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  // Convert file to base64 data URL
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitReview = async () => {
    // Check if user is logged in
    if (!user) {
      showToast('Vui lòng đăng nhập để viết đánh giá', 'warning');
      setIsModalOpen(false);
      return;
    }

    // Validate form
    const newErrors = {
      rating: '',
      nickname: '',
      email: '',
      title: '',
    };

    if (!rating) {
      newErrors.rating = 'Vui lòng chọn đánh giá sao';
    }
    if (!nickname.trim()) {
      newErrors.nickname = 'Input nickname validate Msg required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    }
    if (!title.trim()) {
      newErrors.title = 'Tóm tắt là bắt buộc';
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create review
      const reviewRequest = {
        userId: user.userId,
        productId,
        content: content || '',
        rating,
        title,
        email,
        nickname,
        isRecommend: isRecommend ?? true,
      };

      const newReview = await createReview(reviewRequest);

      // Upload images if any
      if (selectedImages.length > 0) {
        for (const file of selectedImages) {
          try {
            // Convert image to base64
            const base64Image = await convertFileToBase64(file);

            // Save image to database
            await createReviewImage({
              reviewId: newReview.id,
              imageUrl: base64Image,
            });
          } catch (error) {
            console.error('Error saving image:', error);
            // Continue with other images even if one fails
          }
        }
      }

      // Reload reviews
      await loadReviews();

      showToast('Cảm ơn bạn đã đánh giá!', 'success');
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showToast(
        error.response?.data?.error ||
          'Không thể gửi đánh giá. Vui lòng thử lại',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // Cleanup preview URLs
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setRating(0);
    setIsRecommend(null);
    setNickname(user?.fullName || '');
    setEmail(user?.email || '');
    setTitle('');
    setContent('');
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setErrors({
      rating: '',
      nickname: '',
      email: '',
      title: '',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleWriteReview = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để viết đánh giá', 'warning');
      return;
    }
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      )}

      <div className="mx-auto max-w-6xl p-6">
        {/* Rating Summary */}
        <div className="mb-8 flex items-start gap-12">
          {/* Left - Overall Rating */}
          <div className="flex-shrink-0">
            <h2 className="mb-4 text-2xl font-bold">{totalReviews} đánh giá</h2>
            {totalReviews > 0 && (
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-8 w-8"
                    fill={
                      i < Math.floor(averageRating) ? 'currentColor' : 'none'
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            )}
          </div>

          {/* Right - Rating Distribution */}
          {totalReviews > 0 && (
            <div className="flex-1">
              {ratingDistribution.map(({ star, count }) => (
                <div key={star} className="mb-2 flex items-center gap-3">
                  <span className="w-4 text-sm font-medium">{star}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${(count / totalReviews) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-sm text-gray-600">
                    ({count})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Write Review Button */}
          <button
            onClick={handleWriteReview}
            className="flex-shrink-0 text-sm font-semibold underline hover:text-gray-600"
          >
            VIẾT ĐÁNH GIÁ
          </button>
        </div>

        {/* Reviews List */}
        {totalReviews === 0 ? (
          <div className="py-12 text-center text-gray-500">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh
            giá!
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                {/* Review Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="mb-1 font-semibold">{review.nickname}</div>
                    <div className="mb-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4"
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                {/* Review Title */}
                {review.title && (
                  <div className="mb-2 font-medium">{review.title}</div>
                )}

                {/* Review Content */}
                <div className="mb-3">
                  <div className="text-sm leading-relaxed text-gray-700">
                    {review.content}
                  </div>
                </div>

                {/* Review Images */}
                {review.reviewImages && review.reviewImages.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {review.reviewImages.map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt="Review"
                        className="h-20 w-20 rounded object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Recommend Badge */}
                {review.isRecommend && (
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Đề xuất sản phẩm này
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Viết đánh giá</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
              {/* Product Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-sm font-medium text-gray-700">
                  Đánh giá cho:{' '}
                  <span className="text-black">{productName}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="mb-3 text-sm font-medium">
                  Đánh giá chung <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                      disabled={isSubmitting}
                    >
                      <svg
                        className="h-10 w-10"
                        fill={
                          star <= (hoverRating || rating) ? '#FFD700' : 'none'
                        }
                        stroke="#FFD700"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.rating}
                  </div>
                )}
              </div>

              {/* Recommend */}
              <div>
                <div className="mb-3 text-sm font-medium">
                  Bạn có muốn đề xuất sản phẩm này không?
                </div>
                <div className="flex gap-4">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="recommend"
                      checked={isRecommend === true}
                      onChange={() => setIsRecommend(true)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm">Có</span>
                  </label>
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="radio"
                      name="recommend"
                      checked={isRecommend === false}
                      onChange={() => setIsRecommend(false)}
                      className="mr-2"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm">Không</span>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Biệt danh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="v.d. JackJack"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                    disabled={isSubmitting}
                  />
                  {errors.nickname && (
                    <div className="mt-1 text-xs text-red-500">
                      {errors.nickname}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="v.d. abc@gmail.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <div className="mt-1 text-xs text-red-500">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tóm tắt đánh giá <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tóm tắt đánh giá của bạn"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                  disabled={isSubmitting}
                />
                {errors.title ? (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.title}
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-gray-500">
                    Tóm tắt một thử trong 1 câu. Ví dụ: Tôi cực kì ưng ý
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Hình ảnh
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                {selectedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative h-20 w-20">
                        <img
                          src={imagePreviewUrls[index]}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full rounded object-cover"
                          onError={(e) => {
                            console.error('Error loading image preview:', file.name);
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Revoke the URL for the removed image
                            URL.revokeObjectURL(imagePreviewUrls[index]);
                            
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            setImagePreviewUrls((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          disabled={isSubmitting}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Đánh giá chi tiết
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết đánh giá chi tiết"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-gray-500"
                  disabled={isSubmitting}
                />
                <div className="mt-1 text-xs text-gray-500">
                  Bạn có thể nói thêm về sản phẩm ở đưới đây, ví dụ như đỏ hoàn
                  thiện, sự thoải mái
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 py-3 font-semibold text-white hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'ĐANG GỬI...' : 'GỬI CHO CHÚNG TÔI'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
