import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  iconOnly?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconOnly = false,
      className = '',
      children,
      disabled,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const getButtonClasses = () => {
      const baseClasses = 'btn-base';
      const variantClasses = `btn-${variant}`;
      const sizeClasses = `btn-${size}`;
      const stateClasses = [
        loading && 'btn--loading',
        (disabled || loading) && 'btn--disabled',
        fullWidth && 'btn-full',
      ]
        .filter(Boolean)
        .join(' ');

      return `${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${className}`.trim();
    };

    const getIconSize = () => {
      switch (size) {
        case 'sm':
          return 14;
        case 'lg':
          return 20;
        default:
          return 16;
      }
    };

    // 클릭 핸들러
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) { // 🔧 수정: 로딩 상태 체크 추가
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // 키보드 핸들러
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && (loading || disabled)) {
        e.preventDefault();
      }
    };

    // 접근성 속성
    const ariaProps = {
      'aria-disabled': loading || disabled,
      'aria-busy': loading,
      'aria-label': iconOnly 
        ? (props['aria-label'] || String(children)) 
        : props['aria-label'],
    };

    return (
      <button
        ref={ref}
        type={type}
        className={getButtonClasses()}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...ariaProps}
        {...props}
      >
        <span className="btn-content flex items-center">
          {/* 왼쪽 아이콘 */}
          {LeftIcon && !loading && !iconOnly && (
            <LeftIcon
              size={getIconSize()}
              aria-hidden="true"
              className="flex-shrink-0"
            />
          )}

          {/* 텍스트 내용 */}
          {!iconOnly && children}

          {/* 오른쪽 아이콘 (일반 버튼) */}
          {RightIcon && !loading && !iconOnly && (
            <RightIcon
              size={getIconSize()}
              aria-hidden="true"
              className="flex-shrink-0"
            />
          )}

          {/* 아이콘 전용 버튼 */}
          {iconOnly && RightIcon && !loading && (
            <RightIcon 
              size={getIconSize()} 
              aria-hidden="true"
            />
          )}
        </span>

        {loading && (
          <span className="sr-only">로딩 중...</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;