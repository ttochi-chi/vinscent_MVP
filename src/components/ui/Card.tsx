/**
 * Card 컴포넌트
 * 
 * 🔧 주요 기능:
 * - 다양한 크기 (sm, md, lg)
 * - 다양한 스타일 (elevated, outlined, filled)
 * - 클릭 가능한 카드
 * - 가로형 레이아웃
 * - 제품/매거진 특화 스타일
 * 
 * 사용처: 콘텐츠 그룹화, 제품 표시, 매거진 표시
 */

import React, { HTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

// Card Props 타입 정의
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 카드 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 카드 스타일 변형 */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** 클릭 가능 여부 */
  clickable?: boolean;
  /** 가로형 레이아웃 */
  horizontal?: boolean;
  /** 카드 타입 */
  type?: 'default' | 'product' | 'magazine';
  /** 선택된 상태 */
  selected?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 카드 내용 */
  children?: React.ReactNode;
}

/**
 * Card 컴포넌트
 * 
 * @example
 * // 기본 카드
 * <Card>
 *   <Card.Header>
 *     <Card.Title>제목</Card.Title>
 *   </Card.Header>
 *   <Card.Content>내용</Card.Content>
 * </Card>
 * 
 * @example
 * // 클릭 가능한 카드
 * <Card clickable onClick={handleClick}>
 *   <Card.Media src="/image.jpg" alt="이미지" />
 *   <Card.Content>내용</Card.Content>
 * </Card>
 */
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      size = 'md',
      variant = 'outlined',
      clickable = false,
      horizontal = false,
      type = 'default',
      selected = false,
      loading = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // 클래스명 조합
    const cardClasses = [
      'card',
      `card--size-${size}`,
      `card--variant-${variant}`,
      clickable && 'card--clickable',
      horizontal && 'card--horizontal',
      type !== 'default' && `card--${type}`,
      selected && 'is-selected',
      loading && 'is-loading',
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={cardClasses}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardRoot.displayName = 'Card';

// Card Header 컴포넌트
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

// Card Title 컴포넌트
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ 
  as: Component = 'h3', 
  children, 
  className = '', 
  ...props 
}) => (
  <Component className={`card__title ${className}`} {...props}>
    {children}
  </Component>
);

// Card Subtitle 컴포넌트
interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CardSubtitle: React.FC<CardSubtitleProps> = ({ children, className = '', ...props }) => (
  <p className={`card__subtitle ${className}`} {...props}>
    {children}
  </p>
);

// Card Media 컴포넌트
interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  position?: 'top' | 'bottom';
  children?: React.ReactNode;
}

const CardMedia: React.FC<CardMediaProps> = ({ 
  src, 
  alt = '', 
  position = 'top',
  children,
  className = '', 
  ...props 
}) => (
  <div 
    className={`card__media ${position === 'bottom' ? 'card__media--bottom' : ''} ${className}`} 
    {...props}
  >
    {src ? (
      <img src={src} alt={alt} />
    ) : (
      children
    )}
  </div>
);

// Card Content 컴포넌트
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '', ...props }) => (
  <div className={`card__content ${className}`} {...props}>
    {children}
  </div>
);

// Card Actions 컴포넌트
interface CardActionsProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
}

const CardActions: React.FC<CardActionsProps> = ({ 
  align = 'start', 
  children, 
  className = '', 
  ...props 
}) => (
  <div 
    className={`card__actions ${align !== 'start' ? `card__actions--${align}` : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Card Badge 컴포넌트
interface CardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const CardBadge: React.FC<CardBadgeProps> = ({ children, className = '', ...props }) => (
  <span className={`card__badge ${className}`} {...props}>
    {children}
  </span>
);

// Product Card 특화 컴포넌트들
interface ProductPriceProps extends HTMLAttributes<HTMLDivElement> {
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
}

const ProductPrice: React.FC<ProductPriceProps> = ({ 
  price, 
  originalPrice, 
  discount,
  currency = '원',
  className = '',
  ...props 
}) => (
  <div className={`card__price ${className}`} {...props}>
    {originalPrice && (
      <span className="card__price-original">
        {originalPrice.toLocaleString()}{currency}
      </span>
    )}
    <span>
      {price.toLocaleString()}{currency}
    </span>
    {discount && (
      <span className="card__discount">
        {discount}% OFF
      </span>
    )}
  </div>
);

// Magazine Card 특화 컴포넌트들
interface MagazineCategoryProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const MagazineCategory: React.FC<MagazineCategoryProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <span className={`card__category ${className}`} {...props}>
    {children}
  </span>
);

interface MagazineAuthorProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  avatar?: string;
  date?: string;
}

const MagazineAuthor: React.FC<MagazineAuthorProps> = ({ 
  name, 
  avatar, 
  date,
  className = '',
  ...props 
}) => (
  <div className={`card__author ${className}`} {...props}>
    {avatar && (
      <img src={avatar} alt={name} className="card__author-avatar" />
    )}
    <span>{name}</span>
    {date && <span> · {date}</span>}
  </div>
);

// Card Grid 컴포넌트
interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardGrid: React.FC<CardGridProps> = ({ children, className = '', ...props }) => (
  <div className={`card-grid ${className}`} {...props}>
    {children}
  </div>
);

// 특화 컴포넌트 내보내기
export {
  CardGrid,
  ProductPrice,
  MagazineCategory,
  MagazineAuthor
};

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Media: CardMedia,
  Content: CardContent,
  Actions: CardActions,
  Badge: CardBadge,
});

export default Card;