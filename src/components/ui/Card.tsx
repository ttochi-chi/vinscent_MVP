/**
 * Card 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거
 * - 링크 카드 지원 추가
 * - compound component 패턴 적용
 * - 제품/매거진 특화 서브 컴포넌트 포함
 * 
 * 사용처: 콘텐츠 그룹화, 제품 표시, 매거진 표시
 * 근원지: MVP에 필요한 카드 레이아웃 통합
 */

import React, { HTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

// ===== 타입 정의 =====
type CardSize = 'sm' | 'md' | 'lg';
type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardType = 'default' | 'product' | 'magazine';
type CardElement = HTMLDivElement | HTMLAnchorElement;

// 공통 Props
interface BaseCardProps {
  /** 카드 크기 */
  size?: CardSize;
  /** 카드 스타일 변형 */
  variant?: CardVariant;
  /** 카드 타입 */
  type?: CardType;
  /** 클릭 가능 여부 */
  clickable?: boolean;
  /** 가로형 레이아웃 */
  horizontal?: boolean;
  /** 선택된 상태 */
  selected?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 카드 내용 */
  children?: React.ReactNode;
}

// Div Card Props
interface DivCardProps extends BaseCardProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** 렌더링할 요소 타입 */
  as?: 'div';
}

// Link Card Props
interface LinkCardProps extends BaseCardProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'type'> {
  /** 렌더링할 요소 타입 */
  as: 'a';
  /** 링크 주소 */
  href: string;
}

type CardPropsWithAs = DivCardProps | LinkCardProps;

/**
 * Card 루트 컴포넌트
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
 * // 링크 카드
 * <Card as="a" href="/products/1" clickable>
 *   <Card.Media src="/image.jpg" alt="이미지" />
 *   <Card.Content>내용</Card.Content>
 * </Card>
 */
const CardRoot = forwardRef<CardElement, CardPropsWithAs>(
  (props, ref) => {
    const {
      as: Component = 'div',
      size = 'md',
      variant = 'outlined',
      type = 'default',
      clickable = false,
      horizontal = false,
      selected = false,
      loading = false,
      className = '',
      children,
      ...restProps
    } = props;

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

    // 공통 props
    const commonProps = {
      className: cardClasses,
      role: clickable ? 'button' : undefined,
      tabIndex: clickable ? 0 : undefined,
    };

    // Div Card 렌더링
    if (Component === 'div') {
      const { ...divProps } = restProps as DivCardProps;
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          {...commonProps}
          {...divProps}
        >
          {children}
        </div>
      );
    }

    // Link Card 렌더링
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...commonProps}
        {...(restProps as LinkCardProps)}
      >
        {children}
      </a>
    );
  }
);

CardRoot.displayName = 'Card';

// ===== Card Header =====
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

// ===== Card Title =====
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

// ===== Card Subtitle =====
interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CardSubtitle: React.FC<CardSubtitleProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <p className={`card__subtitle ${className}`} {...props}>
    {children}
  </p>
);

// ===== Card Media =====
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
      <img src={src} alt={alt} loading="lazy" />
    ) : (
      children
    )}
  </div>
);

// ===== Card Content =====
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`card__content ${className}`} {...props}>
    {children}
  </div>
);

// ===== Card Actions =====
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

// ===== Card Badge =====
interface CardBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const CardBadge: React.FC<CardBadgeProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <span className={`card__badge ${className}`} {...props}>
    {children}
  </span>
);

// ===== Product Card 특화 컴포넌트 =====
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

// ===== Magazine Card 특화 컴포넌트 =====
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

// ===== Card Grid =====
interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  children?: React.ReactNode;
}

const CardGrid: React.FC<CardGridProps> = ({ 
  columns,
  children, 
  className = '', 
  style,
  ...props 
}) => (
  <div 
    className={`card-grid ${className}`} 
    style={{
      ...style,
      '--card-columns': columns
    } as React.CSSProperties}
    {...props}
  >
    {children}
  </div>
);

// ===== Compound Component 구성 =====
const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Media: CardMedia,
  Content: CardContent,
  Actions: CardActions,
  Badge: CardBadge,
  // 특화 컴포넌트
  Price: ProductPrice,
  Author: MagazineAuthor,
  Grid: CardGrid,
});

export default Card;

// ===== 사용 예시 =====
export const CardExamples = {
  // 기본 카드
  basic: () => (
    <Card>
      <Card.Header>
        <Card.Title>카드 제목</Card.Title>
        <Card.Subtitle>카드 부제목</Card.Subtitle>
      </Card.Header>
      <Card.Content>
        카드 내용이 들어갑니다. 다양한 정보를 표시할 수 있습니다.
      </Card.Content>
    </Card>
  ),

  // 이미지 카드
  withMedia: () => (
    <Card>
      <Card.Media src="/images/sample.jpg" alt="샘플 이미지" />
      <Card.Content>
        <Card.Title>이미지가 있는 카드</Card.Title>
        <p>이미지와 함께 내용을 표시합니다.</p>
      </Card.Content>
    </Card>
  ),

  // 클릭 가능한 링크 카드
  clickable: () => (
    <Card as="a" href="/products/1" clickable>
      <Card.Media src="/images/product.jpg" alt="제품" />
      <Card.Content>
        <Card.Title>클릭 가능한 카드</Card.Title>
        <p>전체 카드가 링크로 작동합니다.</p>
      </Card.Content>
    </Card>
  ),

  // 제품 카드
  product: () => (
    <Card type="product">
      <Card.Badge>SALE</Card.Badge>
      <Card.Media src="/images/perfume.jpg" alt="향수" />
      <Card.Content>
        <Card.Title>Black Orchid</Card.Title>
        <Card.Subtitle>Tom Ford</Card.Subtitle>
        <Card.Price price={180000} originalPrice={250000} discount={28} />
      </Card.Content>
    </Card>
  ),

  // 매거진 카드
  magazine: () => (
    <Card type="magazine" as="a" href="/magazines/1" clickable>
      <Card.Media src="/images/magazine.jpg" alt="매거진" />
      <Card.Content>
        <Card.Title>2024 향수 트렌드</Card.Title>
        <p>올해 주목해야 할 향수 트렌드를 소개합니다.</p>
        <Card.Author 
          name="홍길동" 
          avatar="/images/avatar.jpg"
          date="2024.12.20"
        />
      </Card.Content>
    </Card>
  ),

  // 가로형 카드
  horizontal: () => (
    <Card horizontal>
      <Card.Media src="/images/brand.jpg" alt="브랜드" />
      <Card.Content>
        <Card.Title>가로형 레이아웃</Card.Title>
        <p>이미지와 콘텐츠가 나란히 배치됩니다.</p>
        <Card.Actions align="end">
          <button className="button button--size-sm">자세히 보기</button>
        </Card.Actions>
      </Card.Content>
    </Card>
  ),

  // 카드 그리드
  grid: () => (
    <Card.Grid columns={3}>
      <Card>
        <Card.Content>카드 1</Card.Content>
      </Card>
      <Card>
        <Card.Content>카드 2</Card.Content>
      </Card>
      <Card>
        <Card.Content>카드 3</Card.Content>
      </Card>
    </Card.Grid>
  ),

  // 로딩 상태
  loading: () => (
    <Card loading>
      <div className="skeleton skeleton-image" />
      <Card.Content>
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text skeleton-text--short" />
      </Card.Content>
    </Card>
  )
};