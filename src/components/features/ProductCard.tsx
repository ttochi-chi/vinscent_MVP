import React from 'react';
import Card from '../ui/Card';
import { Product, ProductWithImages } from '@/types';
import Image from 'next/image';

// TypeScript 인터페이스 정의
export interface ProductCardProps {
  product: Product | ProductWithImages;
  onClick?: (product: Product | ProductWithImages) => void;
  loading?: boolean;
  className?: string;
  showBrand?: boolean;
  showPrice?: boolean;
  showNotes?: boolean;
}

// 가격 포맷팅 함수
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};

// ProductCard 컴포넌트 구현
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  loading = false,
  className = '',
  showBrand = true,
  showPrice = true,
  showNotes = false,
}) => {
  // 클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(product);
    }
  };

  //  로딩 스켈레톤
  if (loading) {
    return (
      <Card className={`product-card ${className}`}>
        <div className="skeleton-image" />
        <div className="product-card__loading-content">
          <div className="skeleton-text" />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      clickable={!!onClick}
      onClick={handleClick}
      className={`product-card ${className}`}
      aria-label={`${product.title} 제품 카드`}
    >
      {/* 제품 이미지 */}
      <div className="product-card__image">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.title}
            width={250}
            height={200}
            className="product-card__image"
            loading="lazy"
            onError={(e) => {
              // 이미지 로드 실패 시 폴백
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-product.png';
            }}
          />
        ) : (
          <div className="product-card__image">
            <span className="">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 제품 정보 */}
      <div className="product-card__info">
        {/* 제품명 */}
        <h3 className="product-card__title">
          {product.title}
        </h3>

        {/* 브랜드명 */}
        {showBrand && (
          <p className="product-card__brand">
            브랜드 ID: {product.brandId} {/* 실제로는 브랜드명을 가져와야 함 */}
          </p>
        )}

        {/* 가격 */}
        {showPrice && (
          <p className="product-card__price">
            {formatPrice(product.price)}
          </p>
        )}

        {/* 제품 설명 */}
        {product.description && (
          <p className="product-card__description">
            {product.description}
          </p>
        )}

        {/* 향 노트 (선택적) */}
        {showNotes && (product.topNote || product.middleNote || product.baseNote) && (
          <div className="product-card__notes">
            {product.topNote && (
              <p className="product-card__note">
                <span className="">탑:</span> {product.topNote}
              </p>
            )}
            {product.middleNote && (
              <p className="product-card__note">
                <span className="">미들:</span> {product.middleNote}
              </p>
            )}
            {product.baseNote && (
              <p className="product-card__note">
                <span className="">베이스:</span> {product.baseNote}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// 스켈레톤 로딩 컴포넌트
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = '' 
}) => (
  <ProductCard
    product={{ id: 0, title: '', price: 0, brandId: 0 } as Product}
    loading={true}
    className={className}
  />
);

// 사용 예시 및 패턴 가이드
export const ProductCardExamples = {
  // 기본 사용법
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
  
  // 그리드 레이아웃
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
        mainImageUrl: '',
        brandId: 3,
      },
    ] as Product[];

    return (
      <div className="cards-grid cards-grid--products">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onClick={(product) => console.log('제품 선택:', product.title)}
          />
        ))}
      </div>
    );
  },
  
  // 로딩 상태
  loading: () => (
    <div className="cards-grid cards-grid--products">
      {[...Array(6)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  ),
  
  // 컴팩트 모드 (브랜드명/가격 숨김)
  compact: () => {
    const product: Product = {
      id: 1,
      title: 'Oud Wood',
      description: '오리엔탈 우디 향수',
      price: 380000,
      brandId: 1,
    } as Product;

    return (
      <ProductCard 
        product={product}
        showBrand={false}
        showPrice={false}
        className=""
      />
    );
  },
  
  // 상세 정보 모드
  detailed: () => {
    const product: Product = {
      id: 1,
      title: 'Portrait of a Lady',
      description: '장미와 패출리의 완벽한 조화',
      price: 380000,
      mainImageUrl: '/images/products/portrait.jpg',
      brandId: 1,
      topNote: '장미, 라즈베리, 블랙커런트',
      middleNote: '로즈, 시나몬, 클로브',
      baseNote: '패출리, 샌달우드, 머스크',
    } as Product;

    return (
      <ProductCard 
        product={product}
        onClick={(product) => console.log('제품 상세:', product)}
        showNotes={true}
        className=""
      />
    );
  },
  
  // 검색 결과용
  searchResult: () => {
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
          className="input"
        />
        
        <div className="cards-grid cards-grid--products">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(product) => console.log('제품 선택:', product.title)}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && searchTerm && (
          <p className="product-card__no-results">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        )}
      </div>
    );
  },
  
  // 어드민 페이지용
  adminMode: () => {
    const product: Product = {
      id: 1,
      title: 'Byredo Gypsy Water',
      description: '보헤미안 라이프스타일을 담은 향수',
      price: 320000,
      mainImageUrl: '/images/products/gypsy-water.jpg',
      brandId: 2,
    } as Product;

    return (
      <div className="relative">
        <ProductCard 
          product={product}
          onClick={(product) => console.log('제품 수정 페이지로 이동')}
        />
        
        {/* 어드민 액션 버튼들 */}
        <div className="product-card__admin-actions">
          <button 
            className="button button--variant-ghost button--size-sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('제품 수정');
            }}
            aria-label="제품 수정"
          >
            ✏️
          </button>
          <button 
            className="button button--variant-ghost button--size-sm"
            onClick={(e) => {
              e.stopPropagation();
              console.log('제품 삭제');
            }}
            aria-label="제품 삭제"
          >
            🗑️
          </button>
        </div>
        
        {/* 재고 상태 표시 */}
        <div className="product-card__status">
          <span className="">
            재고 있음
          </span>
        </div>
      </div>
    );
  },
};

export default ProductCard;