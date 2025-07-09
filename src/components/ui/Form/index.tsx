/**
 * Form 컴포넌트 모음
 * 
 * 🔧 포함된 컴포넌트:
 * - Form: 폼 컨테이너
 * - FormGroup: 폼 필드 그룹
 * - Label: 레이블
 * - Input: 입력 필드
 * - Textarea: 여러 줄 입력
 * - Select: 선택 상자
 * - Checkbox: 체크박스
 * - Radio: 라디오 버튼
 * - FormHelp: 도움말 텍스트
 * - FormError: 에러 메시지
 * 
 * 사용처: 모든 폼 관련 UI
 */

import React, { 
  InputHTMLAttributes, 
  TextareaHTMLAttributes, 
  SelectHTMLAttributes,
  LabelHTMLAttributes,
  HTMLAttributes,
  forwardRef 
} from 'react';

// ===== Form Container =====
interface FormProps extends HTMLAttributes<HTMLFormElement> {
  /** 인라인 폼 여부 */
  inline?: boolean;
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
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

export const FormGroup: React.FC<FormGroupProps> = ({
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

export const Label: React.FC<LabelProps> = ({
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
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

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
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

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
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

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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

// ===== Radio Group =====
interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 그룹 이름 */
  name: string;
  /** 선택된 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 옵션 목록 */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  /** 추가 클래스명 */
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  className = '',
  ...props
}) => (
  <div className={`form-group ${className}`} {...props}>
    {options.map((option) => (
      <Radio
        key={option.value}
        name={name}
        value={option.value}
        label={option.label}
        checked={value === option.value}
        disabled={option.disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    ))}
  </div>
);

// ===== Input Group =====
interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`input-group ${className}`} {...props}>
    {children}
  </div>
);

// ===== Input Addon =====
interface InputAddonProps extends HTMLAttributes<HTMLSpanElement> {
  /** 위치 */
  position: 'start' | 'end';
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

export const InputAddon: React.FC<InputAddonProps> = ({
  position,
  className = '',
  children,
  ...props
}) => (
  <span 
    className={`input-group__addon input-group__addon--${position} ${className}`} 
    {...props}
  >
    {children}
  </span>
);

// ===== Form Help Text =====
interface FormHelpProps extends HTMLAttributes<HTMLParagraphElement> {
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

export const FormHelp: React.FC<FormHelpProps> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`form-help ${className}`} {...props}>
    {children}
  </p>
);

// ===== Form Error Message =====
interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  /** 추가 클래스명 */
  className?: string;
  children?: React.ReactNode;
}

export const FormError: React.FC<FormErrorProps> = ({
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

export const FormActions: React.FC<FormActionsProps> = ({
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
