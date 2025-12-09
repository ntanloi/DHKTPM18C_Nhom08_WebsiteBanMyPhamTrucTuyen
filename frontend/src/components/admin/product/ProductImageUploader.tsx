import React, {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import { uploadImages } from '../../../api/upload';

interface ProductImageUploaderProps {
  productId: number;
  onUploadComplete: (uploadedUrls: string[]) => void;
  maxImages?: number;
  maxSizePerFileMB?: number;
  allowedTypes?: string[];
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  onUploadComplete,
  maxImages = 10,
  maxSizePerFileMB = 5,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizePerFileMB * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizePerFileMB}MB limit`;
    }
    return null;
  };

  const processFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const remainingSlots = maxImages - files.length;

    if (filesArray.length > remainingSlots) {
      setError(`You can only upload ${remainingSlots} more image(s)`);
      return;
    }

    const validFiles: FileWithPreview[] = [];
    let hasError = false;

    filesArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
        return;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({
        file,
        preview,
        id: `${Date.now()}-${Math.random()}`,
      });
    });

    if (!hasError) {
      setFiles((prev) => [...prev, ...validFiles]);
      setError(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const filesToUpload = files.map((f) => f.file);
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadImages(filesToUpload, 'products');
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.errors && result.errors.length > 0) {
        setError(`Some images failed to upload:\n${result.errors.join('\n')}`);
      }

      if (result.urls.length > 0) {
        onUploadComplete(result.urls);
        clearAll();
        alert(`Upload thành công ${result.success}/${result.total} ảnh!`);
      } else {
        setError('No images were uploaded successfully');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  React.useEffect(() => {
    const currentFiles = files;
    return () => {
      currentFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          isDragging
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-300 bg-gray-50 hover:border-pink-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              isDragging ? 'bg-pink-500' : 'bg-gray-200'
            }`}
          >
            <svg
              className={`h-8 w-8 ${isDragging ? 'text-white' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700">
              {isDragging ? 'Thả file vào đây' : 'Kéo và thả ảnh vào đây'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              hoặc{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-medium text-pink-600 hover:text-pink-700"
              >
                chọn từ máy tính
              </button>
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="space-y-1 text-xs text-gray-500">
            <p>Định dạng: JPG, PNG, WEBP</p>
            <p>Kích thước tối đa: {maxSizePerFileMB}MB mỗi file</p>
            <p>Tối đa: {maxImages} ảnh</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Đã chọn {files.length} ảnh
            </h3>
            <button
              onClick={clearAll}
              disabled={uploading}
              className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {files.map((fileWithPreview) => (
              <div
                key={fileWithPreview.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="aspect-square">
                  <img
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error(
                        'Failed to load preview:',
                        fileWithPreview.preview,
                      );
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                  />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40">
                  <button
                    onClick={() => removeFile(fileWithPreview.id)}
                    disabled={uploading}
                    className="pointer-events-auto absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600 disabled:bg-gray-400"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-black/60 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs">
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-gray-300">
                    {formatFileSize(fileWithPreview.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Đang upload...</span>
            <span className="font-medium text-pink-600">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-pink-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {files.length > 0 && !uploading && (
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            className="flex-1 rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
          >
            Upload {files.length} ảnh
          </button>
          <button
            onClick={clearAll}
            className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;
