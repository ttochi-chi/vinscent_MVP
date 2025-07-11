/**
 * Form 컴포넌트 모음
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - utilities.tsx의 유용한 기능 통합
 * - react-hook-form 통합 지원
 * - compound component 패턴 강화
 * - Loading, Error, ImageUpload 컴포넌트 포함
 * 
 * 사용처: 모든 폼 관련 UI 및 유틸리티
 * 근원지: Form과 utilities 통합으로 중복 제거
 */

import React, { 
  InputHTMLAttributes, 
  TextareaHTMLAttributes, 
  SelectHTMLAttributes,
  LabelHTMLAttributes,
  HTMLAttributes,
  forwardRef,
  useState,
  useRef
} from 'react';

// ===== Form Container =====
interface FormProps extends HTMLAttributes<HTMLFormElement> {
  /** 인라인 폼 여부 */
  inline?: boolean;
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const FormRoot: React.FC<FormProps> = ({
  inline = false,
  className = '',
  children,
  ...props
}) => (
  <form 
    className={`form ${inline ? 'form--inline' : ''} ${className}`} 
    {...props}
  >
    {children}
  </form>
);

// ===== Form Group =====
interface FormGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 가로 레이아웃 */
  horizontal?: boolean;
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({
  horizontal = false,
  className = '',
  children,
  ...props
}) => (
  <div 
    className={`form-group ${horizontal ? 'form-group--horizontal' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// ===== Label =====
interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** 필수 필드 표시 */
  required?: boolean;
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({
  required = false,
  className = '',
  children,
  ...props
}) => (
  <label 
    className={`form-label ${required ? 'form-label--required' : ''} ${className}`} 
    {...props}
  >
    {children}
  </label>
);

// ===== Input =====
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 크기 */
  fieldSize?: 'sm' | 'md' | 'lg';
  /** 입력 필드 스타일 */
  variant?: 'outlined' | 'filled';
  /** 에러 상태 */
  error?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      fieldSize = 'md',
      variant = 'outlined',
      error = false,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      'input',
      `input--size-${fieldSize}`,
      `input--variant-${variant}`,
      error && 'is-error',
      props.disabled && 'is-disabled',
      props.readOnly && 'is-readonly',
      className
    ].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        className={inputClasses}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

// ===== Textarea =====
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 크기 */
  fieldSize?: 'sm' | 'md' | 'lg';
  /** 스타일 변형 */
  variant?: 'outlined' | 'filled';
  /** 에러 상태 */
  error?: boolean;
  /** 크기 조절 비활성화 */
  noResize?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      fieldSize = 'md',
      variant = 'outlined',
      error = false,
      noResize = false,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const textareaClasses = [
      'textarea',
      `input--size-${fieldSize}`,
      `input--variant-${variant}`,
      noResize && 'textarea--no-resize',
      error && 'is-error',
      props.disabled && 'is-disabled',
      props.readOnly && 'is-readonly',
      className
    ].filter(Boolean).join(' ');

    return (
      <textarea
        ref={ref}
        className={textareaClasses}
        aria-invalid={error}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

// ===== Select =====
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** 크기 */
  fieldSize?: 'sm' | 'md' | 'lg';
  /** 스타일 변형 */
  variant?: 'outlined' | 'filled';
  /** 에러 상태 */
  error?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      fieldSize = 'md',
      variant = 'outlined',
      error = false,
      fullWidth = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const selectClasses = [
      'select',
      `input--size-${fieldSize}`,
      `input--variant-${variant}`,
      error && 'is-error',
      props.disabled && 'is-disabled',
      className
    ].filter(Boolean).join(' ');

    return (
      <select
        ref={ref}
        className={selectClasses}
        aria-invalid={error}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

// ===== Checkbox =====
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 레이블 텍스트 */
  label?: string;
  /** 추가 클래스명 */
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      className = '',
      ...props
    },
    ref
  ) => (
    <label className={`checkbox ${props.disabled ? 'is-disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="checkbox__input"
        {...props}
      />
      <span className="checkbox__box" />
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  )
);

Checkbox.displayName = 'Checkbox';

// ===== Radio =====
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 레이블 텍스트 */
  label?: string;
  /** 추가 클래스명 */
  className?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      className = '',
      ...props
    },
    ref
  ) => (
    <label className={`radio ${props.disabled ? 'is-disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="radio"
        className="radio__input"
        {...props}
      />
      <span className="radio__box" />
      {label && <span className="radio__label">{label}</span>}
    </label>
  )
);

Radio.displayName = 'Radio';

// ===== Form Help & Error =====
interface FormHelpProps extends HTMLAttributes<HTMLParagraphElement> {
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const FormHelp: React.FC<FormHelpProps> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`form-help ${className}`} {...props}>
    {children}
  </p>
);

interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const FormError: React.FC<FormErrorProps> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`form-error ${className}`} role="alert" {...props}>
    {children}
  </p>
);

// ===== Form Actions =====
interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** 정렬 */
  align?: 'start' | 'end' | 'center' | 'between';
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

const FormActions: React.FC<FormActionsProps> = ({
  align = 'start',
  className = '',
  children,
  ...props
}) => (
  <div 
    className={`form-actions ${align !== 'start' ? `form-actions--${align}` : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// ===== Loading Component (from utilities) =====
interface LoadingProps {
  /** 로딩 타입 */
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  /** 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 로딩 메시지 */
  message?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  message,
  className = '',
}) => {
  const loadingClasses = [
    'loading',
    `loading--variant-${variant}`,
    `loading--size-${size}`,
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

// ===== Image Upload Component =====
interface ImageUploadProps {
  /** 현재 이미지 URL 배열 */
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

const ImageUpload: React.FC<ImageUploadProps> = ({
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
      // MVP용 간단한 처리 (실제로는 API 호출)
      // 여기서는 Object URL 생성으로 시뮬레이션
      const urls = filesToUpload.map(file => URL.createObjectURL(file));
      
      if (single) {
        onChange(urls);
      } else {
        onChange([...value, ...urls]);
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
              <div className="image-upload__icon">📷</div>
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
                ✕
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

// ===== Compound Component 구성 =====
const Form = Object.assign(FormRoot, {
  Group: FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Help: FormHelp,
  Error: FormError,
  Actions: FormActions,
  // 유틸리티 컴포넌트
  Loading,
  ImageUpload,
});

export default Form;

// Named exports for convenience
// export {
//   FormGroup,
//   Label,
//   Input,
//   Textarea,
//   Select,
//   Checkbox,
//   Radio,
//   FormHelp,
//   FormError,
//   FormActions,
//   Loading,
//   ImageUpload,
//   useModal
// } from '../Modal'; // Modal의 useModal hook re-export

// ===== React Hook Form 통합 예시 =====
export const FormExamples = {
  // 기본 폼
  basic: () => (
    <Form onSubmit={(e) => { e.preventDefault(); console.log('제출됨'); }}>
      <Form.Group>
        <Form.Label htmlFor="name" required>이름</Form.Label>
        <Form.Input id="name" name="name" required />
      </Form.Group>
      
      <Form.Group>
        <Form.Label htmlFor="email">이메일</Form.Label>
        <Form.Input id="email" name="email" type="email" />
        <Form.Help>이메일 형식으로 입력해주세요.</Form.Help>
      </Form.Group>
      
      <Form.Actions align="end">
        <button type="button" className="button button--variant-ghost">
          취소
        </button>
        <button type="submit" className="button">
          저장
        </button>
      </Form.Actions>
    </Form>
  ),

  // 이미지 업로드 폼
  imageForm: () => {
    const [images, setImages] = useState<string[]>([]);
    
    return (
      <Form>
        <Form.Group>
          <Form.ImageUpload
            label="제품 이미지"
            value={images}
            onChange={setImages}
            maxImages={3}
          />
        </Form.Group>
        
        <Form.Actions align="end">
          <button type="submit" className="button">
            업로드
          </button>
        </Form.Actions>
      </Form>
    );
  },

  // 로딩 상태
  loadingForm: () => (
    <Form>
      <Form.Loading variant="spinner" size="lg" message="데이터를 불러오는 중..." />
    </Form>
  ),

  // 에러 처리
  errorForm: () => (
    <Form>
      <Form.Group>
        <Form.Label htmlFor="username">사용자명</Form.Label>
        <Form.Input id="username" name="username" error />
        <Form.Error>이미 사용 중인 사용자명입니다.</Form.Error>
      </Form.Group>
    </Form>
  )
};