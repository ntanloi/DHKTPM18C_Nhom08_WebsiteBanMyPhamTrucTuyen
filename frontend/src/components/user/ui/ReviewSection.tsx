import { useState } from 'react';
import { X } from 'lucide-react';
import { Toast } from '../ui/Toast';
import type { ToastType } from '../ui/Toast';
const mockReviews = [
  {
    id: 1,
    userId: 1,
    productId: 1,
    content:
      'Cảm ơn bạn đã đánh giá sản phẩm của CLUB CLIO 5 sao! Chúng tôi rất vui vì bạn đã có trải nghiệm tốt với sản phẩm. Ý kiến của bạn chính là động lực giúp CLUB CLIO tiếp tục cố gắng và phục vụ khách hàng...',
    rating: 5,
    title: '',
    email: 'helennguyen_92@example.com',
    nickname: 'helennguyen_92',
    isRecommend: true,
    createdAt: '2025-12-04T17:00:00Z',
    updatedAt: '2025-12-04T17:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    productId: 1,
    content:
      'Bao bì:đẹp Mẹo:không biệt Lắm đẹp:không biệt Lời người xưa nói đều lừa gạt, nói là tên hai người có thể liên kết với nhau là rất có duyên phận, nhưng rõ ràng không hề có chút duyên phận. Ngồ hèm Bình An cũng chưa bao giờ bình an. Vô số ký ức đang luật qua trước mắt, như một cuốn phim chiếu lại, tôi làm người ngoài cuộc đứng nhìn cuộc đời mình.',
    rating: 5,
    title: '',
    email: 'nguynkhnhthanhthơ@example.com',
    nickname: 'nguynkhnhthanhthơ',
    isRecommend: true,
    createdAt: '2025-06-21T19:30:00Z',
    updatedAt: '2025-06-21T19:30:00Z',
  },
];

interface ReviewSectionProps {
  productId: number;
  productName: string;
  productImage?: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isRecommend, setIsRecommend] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
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

  const totalReviews = mockReviews.length;
  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: mockReviews.filter((r) => r.rating === star).length,
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
      setSelectedImages((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  };

  const handleSubmitReview = () => {
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

    console.log({
      productId,
      rating,
      isRecommend,
      nickname,
      email,
      title,
      content,
      images: selectedImages,
    });

    // Show success toast
    showToast('Cảm ơn bạn đã đánh giá!', 'success');

    setIsModalOpen(false);
    // Reset form
    setRating(0);
    setIsRecommend(null);
    setNickname('');
    setEmail('');
    setTitle('');
    setContent('');
    setSelectedImages([]);
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
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-8 w-8"
                  fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Right - Rating Distribution */}
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

          {/* Write Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 text-sm font-semibold underline hover:text-gray-600"
          >
            VIẾT ĐÁNH GIÁ
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
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

              {/* Review Content */}
              <div className="mb-3">
                <div className="mb-2 font-medium text-red-500">
                  Beauty Box Vietnam
                </div>
                <div className="text-sm leading-relaxed text-gray-700">
                  {review.content}{' '}
                  <button className="font-semibold hover:underline">
                    Xem thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
              >
                <X size={24} />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
              {/* Rating */}
              <div>
                <div className="mb-3 text-sm font-medium">
                  Đánh giá chung <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
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
                  />
                </label>
                {selectedImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative h-20 w-20">
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="h-full w-full rounded object-cover"
                        />
                        <button
                          onClick={() =>
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
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
                onClick={handleSubmitReview}
                className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 py-3 font-semibold text-white hover:shadow-lg"
              >
                GỬI CHO CHÚNG TÔI
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
