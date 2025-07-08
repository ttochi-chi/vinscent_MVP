import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, RefreshCw, X, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

// ==================== LOADING COMPONENTS ====================

export interface LoadingProps {
  /** 로딩 타입 */
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 메시지 */
  message?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  className = '',
}) => {
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };
    return sizeMap[size];
  };

  const renderSpinner = () => (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${getSizeClasses()}`} role="status">
      <span className="sr-only">로딩 중...</span>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-current rounded-full animate-pulse ${size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'}`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="text-gray-500 mb-2">
        {variant === 'spinner' && renderSpinner()}
        {variant === 'dots' && renderDots()}
        {variant === 'skeleton' && (
          <div className={`skeleton ${getSizeClasses()}`} />
        )}
        {variant === 'pulse' && (
          <div className={`bg-gray-200 rounded animate-pulse ${getSizeClasses()}`} />
        )}
      </div>
      {message && (
        <p className="text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

// 🔧 페이지 로딩 컴포넌트
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = '페이지를 불러오는 중...' 
}) => (
  <div className="min-h-96 flex items-center justify-center">
    <Loading variant="spinner" size="lg" message={message} />
  </div>
);

// 🔧 카드 스켈레톤 컴포넌트들
export const CardSkeleton: React.FC<{ type?: 'brand' | 'product' | 'magazine' }> = ({ 
  type = 'brand' 
}) => (
  <div className="card-base p-4">
    {type === 'brand' && (
      <>
        <div className="skeleton-avatar mx-auto mb-3" />
        <div className="skeleton-text w-20 mx-auto" />
      </>
    )}
    {type === 'product' && (
      <>
        <div className="skeleton-image mb-3" />
        <div className="skeleton-text w-3/4 mb-2" />
        <div className="skeleton-text w-1/2" />
      </>
    )}
    {type === 'magazine' && (
      <>
        <div className="skeleton-image mb-3" style={{ height: 240 }} />
        <div className="skeleton-text w-full mb-2" />
        <div className="skeleton-text w-3/4 mb-2" />
        <div className="skeleton-text w-1/2" />
      </>
    )}
  </div>
);

// ==================== ERROR COMPONENTS ====================

export interface ErrorProps {
  /** 에러 메시지 */
  message?: string;
  /** 에러 타입 */
  variant?: 'error' | 'warning' | 'info';
  /** 재시도 버튼 표시 */
  showRetry?: boolean;
  /** 재시도 핸들러 */
  onRetry?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorProps> = ({
  message = '오류가 발생했습니다.',
  variant = 'error',
  showRetry = false,
  onRetry,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getVariantClasses()} ${className}`}>
      <div className="flex items-center">
        <span className="text-xl mr-3">{getIcon()}</span>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        {showRetry && onRetry && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={RefreshCw}
            onClick={onRetry}
            className="ml-4"
          >
            재시도
          </Button>
        )}
      </div>
    </div>
  );
};

// 🔧 페이지 에러 컴포넌트
export const PageError: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = '페이지 로드 실패',
  message = '페이지를 불러오는 중 오류가 발생했습니다.',
  onRetry,
}) => (
  <div className="min-h-96 flex items-center justify-center">
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">😵</div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} leftIcon={RefreshCw}>
          다시 시도
        </Button>
      )}
    </div>
  </div>
);

// ==================== IMAGE UPLOAD COMPONENT ====================

export interface ImageUploadProps {
  /** 업로드된 이미지 URL들 */
  value?: string[];
  /** 이미지 변경 핸들러 */
  onChange?: (urls: string[]) => void;
  /** 최대 이미지 개수 */
  maxImages?: number;
  /** 단일 이미지 모드 */
  single?: boolean;
  /** 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 허용 파일 형식 */
  accept?: string;
  /** 최대 파일 크기 (MB) */
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxImages = 5,
  single = false,
  label = '이미지 업로드',
  error,
  disabled = false,
  accept = 'image/*',
  maxSizeMB = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || !onChange) return;

    const fileArray = Array.from(files);
    const maxFiles = single ? 1 : maxImages - value.length;
    const filesToUpload = fileArray.slice(0, maxFiles);

    // 파일 크기 검증
    const oversizedFiles = filesToUpload.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    setUploading(true);
    
    try {
      // 실제로는 Cloudinary API 호출
      const uploadPromises = filesToUpload.map(async (file) => {
        // 임시 로컬 URL 생성 (실제로는 Cloudinary 업로드)
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (single) {
        onChange(uploadedUrls);
      } else {
        onChange([...value, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !dragOver) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragOver) {
      setDragOver(false);
    }
  };

  const removeImage = (index: number) => {
    if (onChange) {
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);
    }
  };

  const canUpload = !disabled && (single ? value.length === 0 : value.length < maxImages);

  return (
    <div className="space-y-3">
      {/* 라벨 */}
      {label && (
        <label className="input-label">
          {label}
          {!single && ` (최대 ${maxImages}개)`}
        </label>
      )}

      {/* 업로드 영역 */}
      {canUpload && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={!single && maxImages > 1}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          
          {uploading ? (
            <Loading variant="spinner" message="업로드 중..." />
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-600">
                클릭하거나 파일을 드래그하여 업로드
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF 파일 (최대 {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`업로드된 이미지 ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                rightIcon={X}
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="이미지 삭제"
              />
            </div>
          ))}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="input-error-message">{error}</p>
      )}
    </div>
  );
};

// ==================== 사용 예시 ====================

export const UtilityExamples = {
  // 로딩 상태들
  loadingStates: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Loading variant="spinner" size="sm" message="작은 스피너" />
        <Loading variant="spinner" size="md" message="중간 스피너" />
        <Loading variant="spinner" size="lg" message="큰 스피너" />
        <Loading variant="dots" size="md" message="도트 로딩" />
      </div>
      
      <PageLoading message="데이터를 불러오는 중..." />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardSkeleton type="brand" />
        <CardSkeleton type="product" />
        <CardSkeleton type="magazine" />
      </div>
    </div>
  ),

  // 에러 상태들
  errorStates: () => (
    <div className="space-y-4">
      <ErrorDisplay 
        message="데이터를 불러올 수 없습니다." 
        showRetry 
        onRetry={() => console.log('재시도')}
      />
      <ErrorDisplay 
        variant="warning"
        message="일부 기능이 제한될 수 있습니다." 
      />
      <ErrorDisplay 
        variant="info"
        message="새로운 업데이트가 있습니다." 
      />
      
      <PageError 
        onRetry={() => console.log('페이지 재시도')}
      />
    </div>
  ),

  // 이미지 업로드
  imageUpload: () => {
    const [images, setImages] = React.useState<string[]>([]);
    const [singleImage, setSingleImage] = React.useState<string[]>([]);
    
    return (
      <div className="space-y-6">
        <ImageUpload
          label="제품 이미지 (다중)"
          value={images}
          onChange={setImages}
          maxImages={3}
        />
        
        <ImageUpload
          label="프로필 이미지 (단일)"
          value={singleImage}
          onChange={setSingleImage}
          single={true}
        />
      </div>
    );
  },
};