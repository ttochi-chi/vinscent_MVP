import React from 'react';
import Card from '../ui/Card';
import { Brand } from '@/types';

// ===== Props 타입 정의 =====
export interface BrandCardProps {
  brand: Brand;
  onClick?: (brand: Brand) => void;
  loading?: boolean;
  className?: string;
  imageSize?: number;
  selected?: boolean;
  compact?: boolean;
}

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

