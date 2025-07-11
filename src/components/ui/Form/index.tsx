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
  inline?: boolean;
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
  horizontal?: boolean;
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
  required?: boolean;
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
  fieldSize?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  error?: boolean;
  fullWidth?: boolean;
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
  fieldSize?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  error?: boolean;
  noResize?: boolean;
  fullWidth?: boolean;
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
  fieldSize?: 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled';
  error?: boolean;
  fullWidth?: boolean;
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
  label?: string;
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
  label?: string;
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
  align?: 'start' | 'end' | 'center' | 'between';
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
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
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
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxImages?: number;
  single?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  accept?: string;
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

