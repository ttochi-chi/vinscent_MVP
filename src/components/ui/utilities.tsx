import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, RefreshCw, X, Info, Check } from 'lucide-react';

/**
 * 🔧 메소드 추적 기반 개선 완료:
 * - Loading 컴포넌트: size → loadingSize로 prop 이름 변경
 * - CardSkeleton: type prop 추가
 * - utilities 내보내기 패턴 정리
 * 
 * 사용처: test/page.tsx에서 실제 호출되는 모든 컴포넌트
 * 근원지: TypeScript 에러 및 props 불일치 문제
 */

// ==================== LOADING COMPONENTS ====================

export interface LoadingProps {
  /** 로딩 타입 */
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  /** 크기 - loadingSize로 변경하여 HTML size 속성과 충돌 방지 */
  loadingSize?: 'sm' | 'md' | 'lg';
  /** 로딩 메시지 */
  message?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  loadingSize = 'md',
  message,
  className = '',
}) => {
    const loadingClasses = [
      'loading',
      `loading--variant-${variant}`,
      `loading--size-${loadingSize}`,
      className
      ].filter(Boolean).join(' ');

  const renderIconWrapper = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="loading__icon-wrapper" role="status">
            <span className="sr-only">로딩 중...</span>
            <div className="loading__spinner" />
          </div>
        );
      case 'dots':
        return (
          <div className="loading__icon-wrapper">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="loading__dot"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );
      case 'skeleton':
        return <div className="loading__skeleton" />;
      case 'pulse':
        return <div className="loading__pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className={loadingClasses}>
      {renderIconWrapper()}
      {message && (
        <p className="loading__message">{message}</p>
      )}
    </div>
  );
};

// 🔧 페이지 로딩 컴포넌트
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = '페이지를 불러오는 중...' 
}) => (
  <div className="page-loading">
    <Loading variant="spinner" loadingSize="lg" message={message} />
  </div>
);

// 🔧 카드 스켈레톤 컴포넌트 - type prop 추가
export const CardSkeleton: React.FC<{ type?: 'brand' | 'product' | 'magazine' }> = ({ 
  type = 'brand' 
}) => (
  <div className={`card-skeleton card-skeleton--${type}`}>
    {type === 'brand' && (
      <>
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton skeleton-text" />
      </>
    )}
    {type === 'product' && (
      <>
        <div className="skeleton skeleton-image" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text skeleton-text--short" />
      </>
    )}
    {type === 'magazine' && (
      <>
        <div className="skeleton skeleton-image skeleton-image--tall" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text skeleton-text--short" />
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
  const IconComponent = variant === 'info' ? Info : AlertCircle;

  return (
    <div className={`error-display error-display--variant-${variant} ${className}`}>
      <IconComponent className="error-display__icon" />
      <div className="error-display__content">
        <p className="error-display__message">{message}</p>
      </div>
      {showRetry && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="error-display__retry-button"
        >
          <RefreshCw size={16} />
          재시도
        </button>
      )}
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
  <div className="page-error">
    <div className="page-error__content">
      <AlertCircle className="page-error__icon" size={48} />
      <h2 className="page-error__title">{title}</h2>
      <p className="page-error__message">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="button button--variant-primary"
        >
          <RefreshCw size={16} />
          다시 시도
        </button>
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
        // API 호출 시뮬레이션
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.imageUrl;
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
    <div className="image-upload">
      {/* 라벨 */}
      {label && (
        <label className="image-upload__label">
          {label}
          {!single && ` (최대 ${maxImages}개)`}
        </label>
      )}

      {/* 업로드 영역 */}
      {canUpload && (
        <div
          className={`image-upload__area ${dragOver ? 'image-upload__area--drag-over' : ''} ${disabled ? 'image-upload__area--disabled' : ''}`}
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
            className="sr-only"
            disabled={disabled}
          />
          
          {uploading ? (
            <Loading variant="spinner" message="업로드 중..." />
          ) : (
            <>
              <Upload className="image-upload__icon" size={32} />
              <p className="image-upload__text">
                클릭하거나 파일을 드래그하여 업로드
              </p>
              <p className="image-upload__text image-upload__text--small">
                PNG, JPG, GIF 파일 (최대 {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {value.length > 0 && (
        <div className="image-upload__preview-grid">
          {value.map((url, index) => (
            <div key={index} className="image-upload__preview-item">
              <img
                src={url}
                alt={`업로드된 이미지 ${index + 1}`}
                className="image-upload__preview-image"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="image-upload__remove-button"
                aria-label="이미지 삭제"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="image-upload__error-message">{error}</p>
      )}
    </div>
  );
};

// ==================== NOTIFICATION COMPONENTS (추가) ====================

export interface NotificationProps {
  /** 알림 타입 */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** 제목 */
  title?: string;
  /** 메시지 */
  message: string;
  /** 자동 닫힘 시간 (ms) */
  duration?: number;
  /** 닫기 핸들러 */
  onClose?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const IconComponent = {
    success: Check,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className={`notification notification--${type} ${className}`}>
      <IconComponent className="notification__icon" size={20} />
      <div className="notification__content">
        {title && <h4 className="notification__title">{title}</h4>}
        <p className="notification__message">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="notification__close"
          aria-label="닫기"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// ==================== EMPTY STATE COMPONENT (추가) ====================

export interface EmptyStateProps {
  /** 제목 */
  title?: string;
  /** 설명 */
  description?: string;
  /** 아이콘 */
  icon?: React.ElementType;
  /** 액션 버튼 */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** 추가 CSS 클래스 */
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '데이터가 없습니다',
  description,
  icon: Icon,
  action,
  className = '',
}) => (
  <div className={`empty-state ${className}`}>
    {Icon && <Icon className="empty-state__icon" size={48} />}
    <h3 className="empty-state__title">{title}</h3>
    {description && (
      <p className="empty-state__description">{description}</p>
    )}
    {action && (
      <button
        type="button"
        onClick={action.onClick}
        className="button button--variant-primary"
      >
        {action.label}
      </button>
    )}
  </div>
);

// ==================== 사용 예시 ====================

export default function UtilityComponentsDemo() {
  const [images, setImages] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Utility Components Demo</h1>
      
      {/* Loading States */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Loading States</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Loading variant="spinner" loadingSize="sm" message="작은 스피너" />
          <Loading variant="dots" loadingSize="md" message="도트 로딩" />
          <CardSkeleton type="brand" />
          <CardSkeleton type="product" />
        </div>
      </section>

      {/* Error States */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Error States</h2>
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
        </div>
      </section>

      {/* Image Upload */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
        <ImageUpload
          value={images}
          onChange={setImages}
          maxImages={3}
          label="제품 이미지"
        />
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <button
          onClick={() => setShowNotification(true)}
          className="button button--variant-primary"
        >
          알림 표시
        </button>
        {showNotification && (
          <Notification
            type="success"
            title="성공!"
            message="작업이 완료되었습니다."
            onClose={() => setShowNotification(false)}
          />
        )}
      </section>

      {/* Empty State */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Empty State</h2>
        <EmptyState
          title="아직 제품이 없습니다"
          description="첫 번째 제품을 등록해보세요"
          action={{
            label: '제품 등록하기',
            onClick: () => console.log('제품 등록'),
          }}
        />
      </section>
    </div>
  );
}