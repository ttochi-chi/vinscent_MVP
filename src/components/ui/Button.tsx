/**
 * Button 컴포넌트
 * 
 * 🔧 주요 기능:
 * - 다양한 크기 (xs, sm, md, lg, xl)
 * - 다양한 스타일 (primary, secondary, ghost, danger)
 * - 로딩 상태
 * - 아이콘 지원
 * - 전체 너비 옵션
 * 
 * 사용처: 모든 클릭 가능한 액션
 */

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

// 버튼 Props 타입 정의
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 크기 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 왼쪽 아이콘 */
  leftIcon?: LucideIcon;
  /** 오른쪽 아이콘 */
  rightIcon?: LucideIcon;
  /** 아이콘만 있는 버튼 */
  iconOnly?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 버튼 내용 */
  children?: React.ReactNode;
}

/**
 * Button 컴포넌트
 * 
 * @example
 * // 기본 버튼
 * <Button>클릭하세요</Button>
 * 
 * @example
 * // 아이콘과 함께
 * <Button leftIcon={Search} variant="secondary">
 *   검색
 * </Button>
 * 
 * @example
 * // 로딩 상태
 * <Button loading>저장 중...</Button>
 * 
 * @example
 * // 아이콘만 있는 버튼
 * <Button iconOnly leftIcon={X} variant="ghost" />
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'md',
      variant = 'primary',
      fullWidth = false,
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconOnly = false,
      className = '',
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // 클래스명 조합
    const buttonClasses = [
      'button',
      `button--size-${size}`,
      `button--variant-${variant}`,
      fullWidth && 'button--full',
      iconOnly && 'button--icon-only',
      loading && 'is-loading',
      disabled && 'is-disabled',
      className
    ].filter(Boolean).join(' ');

    // 아이콘 크기 매핑
    const iconSizeMap = {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 20,
      xl: 24
    };
    const iconSize = iconSizeMap[size];

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* 왼쪽 아이콘 */}
        {LeftIcon && !loading && (
          <LeftIcon 
            className="button__icon" 
            size={iconSize}
            aria-hidden="true"
          />
        )}
        
        {/* 텍스트 내용 */}
        {!iconOnly && children && (
          <span className="button__text">
            {children}
          </span>
        )}
        
        {/* 오른쪽 아이콘 */}
        {RightIcon && !loading && (
          <RightIcon 
            className="button__icon" 
            size={iconSize}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// 버튼 그룹 컴포넌트
interface ButtonGroupProps {
  /** 자식 버튼들 */
  children: React.ReactNode;
  /** 버튼 연결 여부 */
  attached?: boolean;
  /** 세로 방향 */
  vertical?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * ButtonGroup 컴포넌트
 * 
 * @example
 * <ButtonGroup attached>
 *   <Button>이전</Button>
 *   <Button>다음</Button>
 * </ButtonGroup>
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  attached = false,
  vertical = false,
  className = ''
}) => {
  const groupClasses = [
    'button-group',
    attached && 'button-group--attached',
    vertical && 'button-group--vertical',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {children}
    </div>
  );
};

// 컴포넌트 내보내기
export default Button;