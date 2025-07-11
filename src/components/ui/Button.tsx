/**
 * Button 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거
 * - 링크 버튼 지원 추가 (as="a")
 * - compound component 패턴 적용
 * - BEM 네이밍 일관성 유지
 * 
 * 사용처: 모든 클릭 가능한 액션
 * 근원지: MVP에 필요한 최소 기능으로 구성
 */

import React, { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

// ===== 타입 정의 =====
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonElement = HTMLButtonElement | HTMLAnchorElement;

// 공통 Props
interface BaseButtonProps {
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 아이콘만 있는 버튼 */
  iconOnly?: boolean;
  /** 추가 클래스명 */
  className?: string;
  isDisabled?: boolean;
  /** 버튼 내용 */
  children?: React.ReactNode;
}

// Button Props
interface ButtonProps extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** 렌더링할 요소 타입 */
  as?: 'button';
}

// Link Button Props
interface LinkButtonProps extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  /** 렌더링할 요소 타입 */
  as: 'a';
  /** 링크 주소 */
  href: string;
}

type ButtonPropsWithAs = ButtonProps | LinkButtonProps;

/**
 * Button 루트 컴포넌트
 * 
 * @example
 * // 기본 버튼
 * <Button>클릭하세요</Button>
 * 
 * @example
 * // 링크 버튼
 * <Button as="a" href="/products">
 *   제품 보기
 * </Button>
 * 
 * @example
 * // 로딩 상태
 * <Button loading>저장 중...</Button>
 * 
 * @example
 * // 아이콘 버튼 (텍스트로 대체)
 * <Button iconOnly variant="ghost" aria-label="메뉴">
 *   ☰
 * </Button>
 */
const ButtonRoot = forwardRef<ButtonElement, ButtonPropsWithAs>(
  (props, ref) => {
    const {
      as: Component = 'button',
      size = 'md',
      variant = 'primary',
      fullWidth = false,
      loading = false,
      iconOnly = false,
      className = '',
      disabled,
      children,
      ...restProps
    } = props;

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

    // 공통 props
    const commonProps = {
      className: buttonClasses,
      'aria-busy': loading || undefined,
    };

    // Button 렌더링
    if (Component === 'button') {
      const { ...buttonProps } = restProps as ButtonProps;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled || loading}
          {...commonProps}
          {...buttonProps}
        >
          {children}
        </button>
      );
    }

    // Link Button 렌더링
    const { type, ...linkProps } = restProps as LinkButtonProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-disabled={disabled || loading}
        {...commonProps}
        {...linkProps}
      >
        {children}
      </a>
    );
  }
);

ButtonRoot.displayName = 'Button';

// ===== Button Group 컴포넌트 =====
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 버튼 연결 여부 */
  attached?: boolean;
  /** 세로 방향 */
  vertical?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 자식 요소 */
  children?: React.ReactNode;
}

/**
 * ButtonGroup 컴포넌트
 * 
 * @example
 * <Button.Group attached>
 *   <Button>이전</Button>
 *   <Button>다음</Button>
 * </Button.Group>
 */
const ButtonGroup: React.FC<ButtonGroupProps> = ({
  attached = false,
  vertical = false,
  className = '',
  children,
  ...props
}) => {
  const groupClasses = [
    'button-group',
    attached && 'button-group--attached',
    vertical && 'button-group--vertical',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses} {...props}>
      {children}
    </div>
  );
};

// ===== Compound Component 구성 =====
const Button = Object.assign(ButtonRoot, {
  Group: ButtonGroup,
});

export default Button;

// ===== 사용 예시 =====
export const ButtonExamples = {
  // 기본 사용법
  basic: () => (
    <div className="space-y-2">
      <Button>기본 버튼</Button>
      <Button variant="secondary">보조 버튼</Button>
      <Button variant="ghost">고스트 버튼</Button>
      <Button variant="danger">삭제</Button>
    </div>
  ),

  // 크기 변형
  sizes: () => (
    <div className="space-x-2">
      <Button size="xs">초소형</Button>
      <Button size="sm">소형</Button>
      <Button size="md">중형</Button>
      <Button size="lg">대형</Button>
      <Button size="xl">초대형</Button>
    </div>
  ),

  // 링크 버튼
  links: () => (
    <div className="space-x-2">
      <Button as="a" href="/products">
        제품 보기
      </Button>
      <Button as="a" href="/magazines" variant="secondary">
        매거진 읽기
      </Button>
    </div>
  ),

  // 로딩 상태
  loading: () => (
    <div className="space-x-2">
      <Button loading>저장 중...</Button>
      <Button loading variant="secondary">처리 중...</Button>
    </div>
  ),

  // 아이콘 버튼 (이모지 사용)
  iconButtons: () => (
    <div className="space-x-2">
      <Button iconOnly size="sm" aria-label="수정">✏️</Button>
      <Button iconOnly size="sm" variant="danger" aria-label="삭제">🗑️</Button>
      <Button iconOnly variant="ghost" aria-label="메뉴">☰</Button>
    </div>
  ),

  // 버튼 그룹
  groups: () => (
    <div className="space-y-4">
      <Button.Group attached>
        <Button variant="secondary">이전</Button>
        <Button variant="secondary">다음</Button>
      </Button.Group>
      
      <Button.Group attached vertical>
        <Button size="sm">위로</Button>
        <Button size="sm">아래로</Button>
      </Button.Group>
    </div>
  ),

  // 전체 너비
  fullWidth: () => (
    <div className="max-w-md">
      <Button fullWidth>전체 너비 버튼</Button>
    </div>
  ),

  // 폼 액션
  formActions: () => (
    <div className="flex gap-3 justify-end">
      <Button variant="ghost">취소</Button>
      <Button type="submit">저장</Button>
    </div>
  )
};