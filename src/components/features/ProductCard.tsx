/**
 * ProductCard 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거
 * - Card 컴포넌트 활용으로 일관성 확보
 * - compound component 패턴 적용
 * - 가격 포맷팅 유틸리티 포함
 * 
 * 사용처: 제품 목록, 제품 그리드, 검색 결과
 * 근원지: MVP에 필요한 제품 표시 기능
 */

import React from 'react';
import Card from '../ui/Card';
import { Product, ProductWithImages } from '@/types';

// ===== 가격 포맷팅 유틸리티 =====
const formatPrice = (price: number, currency: string = 'KRW'): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const calculateDiscount = (price: number, originalPrice: number): number => {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

// ===== Props 타입 정의 =====
export interface ProductCardProps {
  /** 제품 데이터 */
  product: Product | ProductWithImages;
  /** 클릭 핸들러 */
  onClick?: (product: Product | ProductWithImages) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 브랜드 표시 여부 */
  showBrand?: boolean;
  /** 가격 표시 여부 */
  showPrice?: boolean;
  /** 향 노트 표시 여부 */
  showNotes?: boolean;
  /** 레이아웃 타입 */
  layout?: 'vertical' | 'horizontal';
  /** 이미지 높이 */
  imageHeight?: number;
  /** 할인가 표시 */
  originalPrice?: number;
}

/**
 * ProductCard 루트 컴포넌트
 * 
 * @example
 * // 기본 사용
 * <ProductCard 
 *   product={productData}
 *   onClick={handleProductClick}
 * />
 * 
 * @example
 * // 향 노트 포함
 * <ProductCard 
 *   product={productData}
 *   showNotes={true}
 *   originalPrice={300000}
 * />
 */
const ProductCardRoot: React.FC<ProductCardProps> = ({
  product,
  onClick,
  loading = false,
  className = '',
  showBrand = true,
  showPrice = true,
  showNotes = false,
  layout = 'vertical',
  imageHeight = 200,
  originalPrice,
}) => {
  // 클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(product);
    }
  };

  // 할인율 계산
  const discount = originalPrice && originalPrice > product.price 
    ? calculateDiscount(product.price, originalPrice)
    : null;

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Card 
        type="product"
        horizontal={layout === 'horizontal'}
        className={`product-card ${className}`}
        loading
      >
        <div 
          className="skeleton skeleton-image"
          style={{ height: imageHeight }}
        />
        <Card.Content>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text skeleton-text--short" />
          <div className="skeleton skeleton-text" />
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card 
      type="product"
      clickable={!!onClick}
      onClick={handleClick}
      horizontal={layout === 'horizontal'}
      className={`product-card product-card--${layout} ${className}`}
      href={onClick ? '#' : undefined}
    >
      {/* 할인 배지 */}
      {discount && discount > 0 && (
        <Card.Badge>{discount}% OFF</Card.Badge>
      )}

      {/* 제품 이미지 */}
      <Card.Media 
        src={product.mainImageUrl || undefined}
        alt={product.title}
        style={{ height: imageHeight }}
      >
        {!product.mainImageUrl && (
          <div className="product-card__no-image">
            <span>🏷️</span>
            <span>이미지 없음</span>
          </div>
        )}
      </Card.Media>

      {/* 제품 정보 */}
      <Card.Content>
        {/* 제품명 */}
        <Card.Title>{product.title}</Card.Title>

        {/* 브랜드명 */}
        {showBrand && (
          <Card.Subtitle className="product-card__brand">
            브랜드 #{product.brandId}
          </Card.Subtitle>
        )}

        {/* 제품 설명 */}
        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        {/* 향 노트 */}
        {showNotes && (product.topNote || product.middleNote || product.baseNote) && (
          <div className="product-card__notes">
            {product.topNote && (
              <div className="product-card__note">
                <span className="product-card__note-label">탑</span>
                <span>{product.topNote}</span>
              </div>
            )}
            {product.middleNote && (
              <div className="product-card__note">
                <span className="product-card__note-label">미들</span>
                <span>{product.middleNote}</span>
              </div>
            )}
            {product.baseNote && (
              <div className="product-card__note">
                <span className="product-card__note-label">베이스</span>
                <span>{product.baseNote}</span>
              </div>
            )}
          </div>
        )}

        {/* 가격 */}
        {showPrice && (
          <Card.Price 
            price={product.price}
            originalPrice={originalPrice}
            discount={discount || undefined}
          />
        )}
      </Card.Content>
    </Card>
  );
};

// ===== 스켈레톤 컴포넌트 =====
interface ProductCardSkeletonProps {
  className?: string;
  layout?: 'vertical' | 'horizontal';
  imageHeight?: number;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ 
  className = '',
  layout = 'vertical',
  imageHeight = 200
}) => (
  <ProductCardRoot
    product={{ id: 0, title: '', price: 0, brandId: 0 } as Product}
    loading={true}
    className={className}
    layout={layout}
    imageHeight={imageHeight}
  />
);

// ===== 제품 카드 그리드 =====
interface ProductCardGridProps {
  products: (Product | ProductWithImages)[];
  onProductClick?: (product: Product | ProductWithImages) => void;
  loading?: boolean;
  loadingCount?: number;
  columns?: 2 | 3 | 4;
  showNotes?: boolean;
  className?: string;
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  products,
  onProductClick,
  loading = false,
  loadingCount = 6,
  columns = 3,
  showNotes = false,
  className = ''
}) => {
  if (loading) {
    return (
      <Card.Grid columns={columns} className={className}>
        {[...Array(loadingCount)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </Card.Grid>
    );
  }

  return (
    <Card.Grid columns={columns} className={className}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          showNotes={showNotes}
        />
      ))}
    </Card.Grid>
  );
};

// ===== 제품 리스트 =====
interface ProductListProps {
  products: (Product | ProductWithImages)[];
  onProductClick?: (product: Product | ProductWithImages) => void;
  loading?: boolean;
  showNotes?: boolean;
  className?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductClick,
  loading = false,
  showNotes = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`product-list ${className}`}>
        {[...Array(3)].map((_, index) => (
          <ProductCardSkeleton 
            key={index} 
            layout="horizontal"
            imageHeight={120}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`product-list ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          layout="horizontal"
          imageHeight={120}
          showNotes={showNotes}
        />
      ))}
    </div>
  );
};

// ===== Compound Component 구성 =====
const ProductCard = Object.assign(ProductCardRoot, {
  Skeleton: ProductCardSkeleton,
  Grid: ProductCardGrid,
  List: ProductList,
});

export default ProductCard;

// ===== 사용 예시 =====
export const ProductCardExamples = {
  // 기본 사용
  basic: () => {
    const sampleProduct: Product = {
      id: 1,
      title: 'Black Orchid',
      description: '신비롭고 관능적인 플로럴 우디 향수',
      price: 250000,
      mainImageUrl: '/images/products/black-orchid.jpg',
      brandId: 1,
      topNote: '트러플, 일랑일랑, 블랙커런트',
      middleNote: '오키드, 스파이시 노트',
      baseNote: '패출리, 바닐라, 인센스',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    return (
      <ProductCard 
        product={sampleProduct}
        onClick={(product) => console.log('제품 클릭:', product.title)}
        showNotes={true}
      />
    );
  },

  // 제품 그리드
  grid: () => {
    const products: Product[] = [
      {
        id: 1,
        title: 'Aventus',
        description: '남성용 시그니처 향수',
        price: 420000,
        mainImageUrl: '/images/products/aventus.jpg',
        brandId: 1,
      },
      {
        id: 2,
        title: 'Santal 33',
        description: '유니섹스 샌달우드 향수',
        price: 380000,
        mainImageUrl: '/images/products/santal33.jpg',
        brandId: 2,
      },
      {
        id: 3,
        title: 'Baccarat Rouge 540',
        description: '럭셔리 플로럴 우디 향수',
        price: 450000,
        brandId: 3,
      },
    ] as Product[];

    return (
      <ProductCard.Grid
        products={products}
        onProductClick={(product) => console.log('제품 선택:', product.title)}
        columns={3}
      />
    );
  },

  // 할인 상품
  withDiscount: () => {
    const product: Product = {
      id: 1,
      title: 'Tom Ford Oud Wood',
      description: '오리엔탈 우디의 대표작',
      price: 280000,
      mainImageUrl: '/images/products/oud-wood.jpg',
      brandId: 1,
    } as Product;

    return (
      <ProductCard
        product={product}
        originalPrice={380000}
        onClick={(product) => console.log('할인 제품:', product.title)}
      />
    );
  },

  // 가로 리스트
  list: () => {
    const products: Product[] = [
      {
        id: 1,
        title: 'Portrait of a Lady',
        description: '장미와 패출리의 완벽한 조화',
        price: 380000,
        brandId: 1,
        topNote: '장미, 라즈베리',
        middleNote: '로즈, 시나몬',
        baseNote: '패출리, 샌달우드',
      },
      {
        id: 2,
        title: 'Molecule 01',
        description: '단일 분자 향수의 혁신',
        price: 180000,
        brandId: 2,
      },
    ] as Product[];

    return (
      <ProductCard.List
        products={products}
        onProductClick={(product) => console.log('제품 상세:', product.title)}
        showNotes={true}
      />
    );
  },

  // 로딩 상태
  loading: () => (
    <ProductCard.Grid
      products={[]}
      loading
      loadingCount={6}
      columns={3}
    />
  ),

  // 컴팩트 모드
  compact: () => {
    const products: Product[] = [
      { id: 1, title: 'Oud Wood', price: 380000, brandId: 1 },
      { id: 2, title: 'Aventus', price: 420000, brandId: 2 },
      { id: 3, title: 'Santal 33', price: 380000, brandId: 3 },
      { id: 4, title: 'Byredo Gypsy Water', price: 280000, brandId: 4 },
    ] as Product[];

    return (
      <ProductCard.Grid
        products={products}
        onProductClick={(product) => console.log('제품:', product.title)}
        columns={4}
        showNotes={false}
      />
    );
  },

  // 검색 결과
  searchResults: () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const products: Product[] = [
      { id: 1, title: 'Tom Ford Oud Wood', price: 380000, brandId: 1 },
      { id: 2, title: 'Creed Aventus', price: 420000, brandId: 2 },
      { id: 3, title: 'Maison Margiela REPLICA', price: 180000, brandId: 3 },
    ] as Product[];

    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <input 
          type="text"
          placeholder="제품 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input mb-4"
        />
        
        {filteredProducts.length > 0 ? (
          <ProductCard.Grid
            products={filteredProducts}
            onProductClick={(product) => console.log('제품 선택:', product.title)}
            columns={3}
          />
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
          </div>
        )}
      </div>
    );
  }
};