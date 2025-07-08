import React from 'react';
import { Card } from '../ui/Card';
import { Brand } from '@/types';
import Image from 'next/image';

// TypeScript 인터페이스 정의
export interface BrandCardProps {
  brand: Brand;
  onClick?: (brand: Brand) => void;
  loading?: boolean;
  className?: string;
  imageSize?: number;
}

// BrandCard 컴포넌트 구현
export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onClick,
  loading = false,
  className = '',
  imageSize = 80,
}) => {
  //  클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(brand);
    }
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Card className={`brand-card ${className}`} noHover>
        <div 
          className="skeleton-avatar mx-auto mb-3"
          style={{ width: imageSize, height: imageSize }}
        />
        <div className="skeleton-text w-20 mx-auto" />
      </Card>
    );
  }

  return (
    <Card 
      clickable={!!onClick}
      onClick={handleClick}
      className={`brand-card ${className}`}
      aria-label={`${brand.title} 브랜드 카드`}
    >
      {/* 브랜드 로고/이미지 */}
      <div 
        className="brand-card__image"
        style={{ width: imageSize, height: imageSize }}
      >
        {brand.profileImageUrl ? (
          <Image
            src={brand.profileImageUrl}
            alt={`${brand.title} 로고`}
            width={imageSize}
            height={imageSize}
            className="brand-card__image"
            style={{ width: imageSize, height: imageSize }}
            loading="lazy"
            onError={(e) => {
              // 이미지 로드 실패 시 폴백
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-brand.png'; // 기본 이미지로 교체
            }}
          />
        ) : (
          <div 
            className="brand-card__image bg-gray-200 flex items-center justify-center"
            style={{ width: imageSize, height: imageSize }}
          >
            <span className="text-gray-400 text-xs font-medium">
              {brand.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* 브랜드 이름 */}
      <h3 className="brand-card__title">
        {brand.title}
      </h3>

      {/* 브랜드 설명 */}
      {brand.description && (
        <p className="text-xs text-gray-500 mt-1 text-center line-clamp-2">
          {brand.description}
        </p>
      )}
    </Card>
  );
};

// 스켈레톤 로딩 컴포넌트
export const BrandCardSkeleton: React.FC<{ className?: string; imageSize?: number }> = ({ 
  className = '', 
  imageSize = 80 
}) => (
  <BrandCard
    brand={{ id: 0, title: '', description: '' } as Brand}
    loading={true}
    className={className}
    imageSize={imageSize}
  />
);

// 사용 예시 및 패턴 가이드
export const BrandCardExamples = {
  // 기본 사용법
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
  
  // 그리드 레이아웃
  grid: () => {
    const brands: Brand[] = [
      { id: 1, title: 'Tom Ford', description: '럭셔리 향수', profileImageUrl: '/images/brands/tom-ford.jpg' },
      { id: 2, title: 'Chanel', description: '프렌치 엘레강스', profileImageUrl: '/images/brands/chanel.jpg' },
      { id: 3, title: 'Dior', description: '모던 클래식', profileImageUrl: '/images/brands/dior.jpg' },
      { id: 4, title: 'Hermès', description: '아르티잔 크래프트', profileImageUrl: '' }, // 이미지 없는 경우
    ] as Brand[];

    return (
      <div className="cards-grid cards-grid--brands">
        {brands.map((brand) => (
          <BrandCard 
            key={brand.id}
            brand={brand}
            onClick={(brand) => console.log('브랜드 선택:', brand.title)}
          />
        ))}
      </div>
    );
  },
  
  // 로딩 상태
  loading: () => (
    <div className="cards-grid cards-grid--brands">
      {[...Array(6)].map((_, index) => (
        <BrandCardSkeleton key={index} />
      ))}
    </div>
  ),
  
  // 다양한 크기
  sizes: () => {
    const brand: Brand = {
      id: 1,
      title: 'Maison Margiela',
      description: 'REPLICA 컬렉션',
      profileImageUrl: '/images/brands/margiela.jpg',
    } as Brand;

    return (
      <div className="flex gap-4 items-center">
        <BrandCard brand={brand} imageSize={60} />
        <BrandCard brand={brand} imageSize={80} />
        <BrandCard brand={brand} imageSize={100} />
      </div>
    );
  },
  
  // 실제 사용 시나리오 (브랜드 선택)
  brandSelector: () => {
    const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
    
    const brands: Brand[] = [
      { id: 1, title: 'Creed', description: '영국 왕실 御用' },
      { id: 2, title: 'Byredo', description: '스웨덴 니치 향수' },
      { id: 3, title: 'Le Labo', description: '핸드메이드 향수' },
    ] as Brand[];

    return (
      <div>
        <h3 className="text-lg font-medium mb-4">브랜드를 선택하세요:</h3>
        <div className="cards-grid cards-grid--brands mb-4">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onClick={setSelectedBrand}
              className={selectedBrand?.id === brand.id ? 'ring-2 ring-blue-500' : ''}
            />
          ))}
        </div>
        {selectedBrand && (
          <p className="text-sm text-gray-600">
            선택된 브랜드: <strong>{selectedBrand.title}</strong>
          </p>
        )}
      </div>
    );
  },
  
  // 어드민 페이지용 (관리 기능)
  adminMode: () => {
    const brand: Brand = {
      id: 1,
      title: 'Amouage',
      description: '오만 왕실의 니치 향수 브랜드',
      profileImageUrl: '/images/brands/amouage.jpg',
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date(),
    } as Brand;

    return (
      <div className="relative">
        <BrandCard 
          brand={brand}
          onClick={(brand) => console.log('브랜드 상세:', brand)}
        />
        
        {/* 어드민 액션 버튼들 */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button 
            className="btn-base btn-ghost btn-sm p-1"
            onClick={(e) => {
              e.stopPropagation();
              console.log('브랜드 수정');
            }}
            aria-label="브랜드 수정"
          >
            ✏️
          </button>
          <button 
            className="btn-base btn-ghost btn-sm p-1"
            onClick={(e) => {
              e.stopPropagation();
              console.log('브랜드 삭제');
            }}
            aria-label="브랜드 삭제"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  },
};

export default BrandCard;