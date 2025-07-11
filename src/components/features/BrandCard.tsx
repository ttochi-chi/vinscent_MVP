/**
 * BrandCard 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거
 * - Card 컴포넌트 활용으로 일관성 확보
 * - compound component 패턴 적용
 * - 불필요한 Next/Image 제거 (MVP 단순화)
 * 
 * 사용처: 브랜드 목록, 브랜드 선택
 * 근원지: MVP에 필요한 브랜드 표시 기능
 */

import React from 'react';
import Card from '../ui/Card';
import { Brand } from '@/types';

// ===== Props 타입 정의 =====
export interface BrandCardProps {
  /** 브랜드 데이터 */
  brand: Brand;
  /** 클릭 핸들러 */
  onClick?: (brand: Brand) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 이미지 크기 */
  imageSize?: number;
  /** 선택된 상태 */
  selected?: boolean;
  /** 간략 모드 */
  compact?: boolean;
}

/**
 * BrandCard 루트 컴포넌트
 * 
 * @example
 * // 기본 사용
 * <BrandCard 
 *   brand={brandData}
 *   onClick={handleBrandClick}
 * />
 * 
 * @example
 * // 선택 가능한 브랜드 목록
 * <BrandCard 
 *   brand={brandData}
 *   onClick={selectBrand}
 *   selected={selectedBrand?.id === brandData.id}
 * />
 */
const BrandCardRoot: React.FC<BrandCardProps> = ({
  brand,
  onClick,
  loading = false,
  className = '',
  imageSize = 80,
  selected = false,
  compact = false,
}) => {
  // 클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(brand);
    }
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Card 
        type="default"
        className={`brand-card ${className}`}
        loading
      >
        <div className="brand-card__content">
          <div 
            className="skeleton skeleton-avatar"
            style={{ width: imageSize, height: imageSize }}
          />
          <div className="skeleton skeleton-text" />
          {!compact && <div className="skeleton skeleton-text skeleton-text--short" />}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      clickable={!!onClick}
      onClick={handleClick}
      selected={selected}
      className={`brand-card ${compact ? 'brand-card--compact' : ''} ${className}`}
      aria-label={`${brand.title} 브랜드`}
    >
      <div className="brand-card__content">
        {/* 브랜드 로고/이미지 */}
        <div 
          className="brand-card__image-wrapper"
          style={{ width: imageSize, height: imageSize }}
        >
          {brand.profileImageUrl ? (
            <img
              src={brand.profileImageUrl}
              alt={`${brand.title} 로고`}
              className="brand-card__image"
              onError={(e) => {
                // 이미지 로드 실패 시 폴백
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('brand-card__image-fallback');
                  parent.innerHTML = `<span>${brand.title.charAt(0).toUpperCase()}</span>`;
                }
              }}
            />
          ) : (
            <div className="brand-card__image-fallback">
              <span>{brand.title.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* 브랜드 정보 */}
        <div className="brand-card__info">
          <h3 className="brand-card__title">
            {brand.title}
          </h3>

          {/* 브랜드 설명 (compact 모드가 아닐 때만) */}
          {!compact && brand.description && (
            <p className="brand-card__description">
              {brand.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// ===== 스켈레톤 컴포넌트 =====
interface BrandCardSkeletonProps {
  className?: string;
  imageSize?: number;
  compact?: boolean;
}

const BrandCardSkeleton: React.FC<BrandCardSkeletonProps> = ({ 
  className = '', 
  imageSize = 80,
  compact = false
}) => (
  <BrandCardRoot
    brand={{ id: 0, title: '', description: '' } as Brand}
    loading={true}
    className={className}
    imageSize={imageSize}
    compact={compact}
  />
);

// ===== 브랜드 카드 그리드 =====
interface BrandCardGridProps {
  brands: Brand[];
  onBrandClick?: (brand: Brand) => void;
  selectedBrandId?: number;
  loading?: boolean;
  loadingCount?: number;
  columns?: 2 | 3 | 4;
  compact?: boolean;
  className?: string;
}

const BrandCardGrid: React.FC<BrandCardGridProps> = ({
  brands,
  onBrandClick,
  selectedBrandId,
  loading = false,
  loadingCount = 6,
  columns = 3,
  compact = false,
  className = ''
}) => {
  if (loading) {
    return (
      <Card.Grid columns={columns} className={className}>
        {[...Array(loadingCount)].map((_, index) => (
          <BrandCardSkeleton key={index} compact={compact} />
        ))}
      </Card.Grid>
    );
  }

  return (
    <Card.Grid columns={columns} className={className}>
      {brands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          onClick={onBrandClick}
          selected={selectedBrandId === brand.id}
          compact={compact}
        />
      ))}
    </Card.Grid>
  );
};

// ===== Compound Component 구성 =====
const BrandCard = Object.assign(BrandCardRoot, {
  Skeleton: BrandCardSkeleton,
  Grid: BrandCardGrid,
});

export default BrandCard;

// ===== 사용 예시 =====
export const BrandCardExamples = {
  // 기본 사용
  basic: () => {
    const sampleBrand: Brand = {
      id: 1,
      title: 'Tom Ford',
      description: '럭셔리 프리미엄 향수 브랜드',
      profileImageUrl: '/images/brands/tom-ford.jpg',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    return (
      <BrandCard 
        brand={sampleBrand}
        onClick={(brand) => console.log('브랜드 클릭:', brand.title)}
      />
    );
  },

  // 브랜드 그리드
  grid: () => {
    const brands: Brand[] = [
      { id: 1, title: 'Tom Ford', description: '럭셔리 향수' },
      { id: 2, title: 'Chanel', description: '프렌치 엘레강스' },
      { id: 3, title: 'Dior', description: '모던 클래식' },
      { id: 4, title: 'Hermès', description: '아르티잔 크래프트' },
    ] as Brand[];

    return (
      <BrandCard.Grid
        brands={brands}
        onBrandClick={(brand) => console.log('브랜드 선택:', brand.title)}
        columns={4}
      />
    );
  },

  // 컴팩트 모드
  compact: () => {
    const brands: Brand[] = [
      { id: 1, title: 'Creed' },
      { id: 2, title: 'Byredo' },
      { id: 3, title: 'Le Labo' },
      { id: 4, title: 'Diptyque' },
    ] as Brand[];

    return (
      <BrandCard.Grid
        brands={brands}
        onBrandClick={(brand) => console.log('브랜드:', brand.title)}
        columns={4}
        compact
      />
    );
  },

  // 선택 가능한 브랜드 목록
  selectable: () => {
    const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
    
    const brands: Brand[] = [
      { id: 1, title: 'Creed', description: '영국 왕실 御用' },
      { id: 2, title: 'Byredo', description: '스웨덴 니치 향수' },
      { id: 3, title: 'Le Labo', description: '핸드메이드 향수' },
    ] as Brand[];

    return (
      <div>
        <h3 className="text-lg font-medium mb-4">브랜드를 선택하세요:</h3>
        <BrandCard.Grid
          brands={brands}
          onBrandClick={setSelectedBrand}
          selectedBrandId={selectedBrand?.id}
          columns={3}
        />
        {selectedBrand && (
          <p className="mt-4 text-sm text-gray-600">
            선택된 브랜드: <strong>{selectedBrand.title}</strong>
          </p>
        )}
      </div>
    );
  },

  // 로딩 상태
  loading: () => (
    <BrandCard.Grid
      brands={[]}
      loading
      loadingCount={8}
      columns={4}
    />
  ),

  // 다양한 크기
  sizes: () => {
    const brand: Brand = {
      id: 1,
      title: 'Maison Margiela',
      description: 'REPLICA 컬렉션',
    } as Brand;

    return (
      <div className="space-y-4">
        <BrandCard brand={brand} imageSize={60} />
        <BrandCard brand={brand} imageSize={80} />
        <BrandCard brand={brand} imageSize={100} />
      </div>
    );
  }
};