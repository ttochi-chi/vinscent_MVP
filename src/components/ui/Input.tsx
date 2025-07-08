import React, { forwardRef, useId } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-invalid' | 'aria-describedby'> {
  label?: string;
  hideLabel?: boolean;
  helperText?: string;
  errorMessage?: string;
  error?: boolean;
  search?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  className?: string;
  containerClassName?: string;
  required?: boolean;
}

// 🔧 Input 컴포넌트 구현
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hideLabel = false,
      helperText,
      errorMessage,
      error = false,
      search = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      containerClassName = '',
      required = false,
      disabled = false,
      type = 'text',
      id: providedId,
      placeholder,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성 (접근성)
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // 실제 에러 상태 판단
    const hasError = error || !!errorMessage;

    // CSS 클래스 조합 로직
    const getInputClasses = () => {
      const baseClasses = ['input-base'];
      
      if (search) baseClasses.push('input-search');
      if (hasError) baseClasses.push('input--error');
      if (disabled) baseClasses.push('input--disabled');
      if (LeftIcon && !search) baseClasses.push('pl-10');
      if (RightIcon) baseClasses.push('pr-10');
      if (className) baseClasses.push(className);
      
      return baseClasses.join(' ');
    };

    // ARIA 속성 설정
    const getAriaDescribedBy = () => {
      const describedByIds = [];
      
      if (helperText) describedByIds.push(helperId);
      if (hasError && errorMessage) describedByIds.push(errorId);
      
      return describedByIds.length > 0 ? describedByIds.join(' ') : undefined;
    };

    // 플레이스홀더 처리 (라벨이 있으면 플레이스홀더 자동 설정)
    const effectivePlaceholder = placeholder || (label && !hideLabel ? '' : label);

    return (
      <div className={`input-group ${containerClassName}`}>
        {/* 🔧 라벨 */}
        {label && (
          <label 
            htmlFor={inputId}
            className={`input-label ${hideLabel ? 'sr-only' : ''}`}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-label="필수">*</span>
            )}
          </label>
        )}
        
        {/* 입력창 컨테이너 */}
        <div className="relative">
          {/* 왼쪽 아이콘 */}
          {LeftIcon && !search && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <LeftIcon 
                size={16} 
                className={`${hasError ? 'text-red-500' : 'text-gray-500'}`}
                aria-hidden="true"
              />
            </div>
          )}
          
          {/* 입력창 */}
          <input
            ref={ref}
            type={type}
            id={inputId}
            className={getInputClasses()}
            placeholder={effectivePlaceholder}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={getAriaDescribedBy()}
            {...props}
          />
          
          {/* 오른쪽 아이콘 */}
          {RightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <RightIcon 
                size={16} 
                className={`${hasError ? 'text-red-500' : 'text-gray-500'}`}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        
        {/* 도움말 텍스트 */}
        {helperText && !hasError && (
          <div 
            id={helperId}
            className="input-helper"
            role="note"
          >
            {helperText}
          </div>
        )}
        
        {/* 에러 메시지 */}
        {hasError && errorMessage && (
          <div 
            id={errorId}
            className="input-error-message"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;