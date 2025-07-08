import React from 'react';
import { Card } from '../ui/Card';
import { Magazine, MagazineWithImages } from '@/types';
import Image from 'next/image';

// TypeScript 인터페이스 정의
export interface MagazineCardProps {
  magazine: Magazine | MagazineWithImages;
  onClick?: (magazine: Magazine | MagazineWithImages) => void;
  loading?: boolean;
  className?: string;
  showBrand?: boolean;
  showDate?: boolean;
  previewLength?: number;
  imageHeight?: number;
}

// 날짜 포맷팅 함수
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// 상대 시간 포맷팅 함수
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  
  return formatDate(date);
};

// MagazineCard 컴포넌트 구현
export const MagazineCard: React.FC<MagazineCardProps> = ({
  magazine,
  onClick,
  loading = false,
  className = '',
  showBrand = true,
  showDate = true,
  previewLength = 100,
  imageHeight = 240,
}) => {
  // 클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(magazine);
    }
  };

  // 첫 번째 이미지 가져오기
  const getFirstImage = () => {
    if ('images' in magazine && magazine.images && magazine.images.length > 0) {
      return magazine.images[0].imageUrl;
    }
    return null;
  };

  // 콘텐츠 미리보기 생성
  const getContentPreview = () => {
    if (!magazine.content) return '';
    if (magazine.content.length <= previewLength) return magazine.content;
    return magazine.content.substring(0, previewLength) + '...';
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Card className={`magazine-card ${className}`} noHover>
        <div 
          className="skeleton-image"
          style={{ height: imageHeight }}
        />
        <div className="p-4 space-y-3">
          <div className="skeleton-text w-3/4 h-5" />
          <div className="skeleton-text w-full" />
          <div className="skeleton-text w-2/3" />
          <div className="skeleton-text w-1/3" />
        </div>
      </Card>
    );
  }

  const firstImageUrl = getFirstImage();

  return (
    <Card 
      clickable={!!onClick}
      onClick={handleClick}
      className={`magazine-card ${className}`}
      aria-label={`${magazine.title} 매거진 카드`}
    >
      {/* 매거진 커버 이미지 */}
      <div 
        className="magazine-card__image"
        style={{ height: imageHeight }}
      >
        {firstImageUrl ? (
          <Image
            src={firstImageUrl}
            alt={magazine.title}
            width={300}
            height={imageHeight}
            className="magazine-card__image"
            style={{ height: imageHeight }}
            loading="lazy"
            onError={(e) => {
              // 이미지 로드 실패 시 폴백
              const target = e.target as HTMLImageElement;
              target.src = '/images/default-magazine.png';
            }}
          />
        ) : (
          <div 
            className="magazine-card__image bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
            style={{ height: imageHeight }}
          >
            <div className="text-center">
              <span className="text-gray-400 text-sm mt-1">매거진</span>
            </div>
          </div>
        )}
        
        {/* 이미지 개수 표시 (여러 이미지가 있는 경우) */}
        {'images' in magazine && magazine.images && magazine.images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
             {magazine.images.length}
          </div>
        )}
      </div>

      {/* 매거진 정보 */}
      <div className="p-4 space-y-3">
        {/* 매거진 제목 */}
        <h3 className="magazine-card__title text-lg font-semibold text-gray-900 line-clamp-2">
          {magazine.title}
        </h3>

        {/* 콘텐츠 미리보기 */}
        {magazine.content && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {getContentPreview()}
          </p>
        )}

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* 브랜드 정보 */}
          {showBrand && (
            <span className="font-medium">
              브랜드 ID: {magazine.brandId} {/* 실제로는 브랜드명 표시 */}
            </span>
          )}

          {/* 날짜 정보 */}
          {showDate && magazine.createdDate && (
            <span>
              {formatRelativeTime(magazine.createdDate)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

// 스켈레톤 로딩 컴포넌트
export const MagazineCardSkeleton: React.FC<{ 
  className?: string; 
  imageHeight?: number;
}> = ({ 
  className = '', 
  imageHeight = 240 
}) => (
  <MagazineCard
    magazine={{ id: 0, title: '', brandId: 0, content: '' } as Magazine}
    loading={true}
    className={className}
    imageHeight={imageHeight}
  />
);

// 사용 예시 및 패턴 가이드
export const MagazineCardExamples = {
  // 기본 사용법
  basic: () => {
    const sampleMagazine: MagazineWithImages = {
      id: 1,
      title: '향수의 계절별 선택 가이드',
      content: '봄, 여름, 가을, 겨울 각 계절에 어울리는 향수를 소개합니다. 계절의 특성과 어울리는 향조를 자세히 알아보세요.',
      brandId: 1,
      createdDate: new Date('2024-12-15'),
      updatedDate: new Date(),
      images: [
        {
          id: 1,
          imageUrl: '/images/magazines/seasonal-guide.jpg',
          imageOrder: 1,
          magazineId: 1,
        },
        {
          id: 2,
          imageUrl: '/images/magazines/seasonal-guide-2.jpg',
          imageOrder: 2,
          magazineId: 1,
        },
      ],
    };

    return (
      <MagazineCard 
        magazine={sampleMagazine}
        onClick={(magazine) => console.log('매거진 클릭:', magazine.title)}
      />
    );
  },
  
  // 그리드 레이아웃
  grid: () => {
    const magazines: MagazineWithImages[] = [
      {
        id: 1,
        title: '니치 향수 브랜드 탐방',
        content: '숨겨진 보석 같은 니치 향수 브랜드들을 소개합니다.',
        brandId: 1,
        createdDate: new Date('2024-12-20'),
        images: [{ id: 1, imageUrl: '/images/magazines/niche-brands.jpg', imageOrder: 1, magazineId: 1 }],
      },
      {
        id: 2,
        title: '향수 레이어링 기법',
        content: '여러 향수를 조합하여 나만의 시그니처 향을 만드는 방법',
        brandId: 2,
        createdDate: new Date('2024-12-18'),
        images: [{ id: 2, imageUrl: '/images/magazines/layering.jpg', imageOrder: 1, magazineId: 2 }],
      },
      {
        id: 3,
        title: '향수 보관법과 관리',
        content: '소중한 향수를 오래도록 즐기기 위한 올바른 보관 방법',
        brandId: 3,
        createdDate: new Date('2024-12-15'),
        images: [],
      },
    ] as MagazineWithImages[];

    return (
      <div className="cards-grid cards-grid--magazines">
        {magazines.map((magazine) => (
          <MagazineCard 
            key={magazine.id}
            magazine={magazine}
            onClick={(magazine) => console.log('매거진 선택:', magazine.title)}
          />
        ))}
      </div>
    );
  },
  
  // 로딩 상태
  loading: () => (
    <div className="cards-grid cards-grid--magazines">
      {[...Array(4)].map((_, index) => (
        <MagazineCardSkeleton key={index} />
      ))}
    </div>
  ),
  
  // 컴팩트 모드
  compact: () => {
    const magazine: Magazine = {
      id: 1,
      title: '향수 입문자를 위한 가이드',
      content: '향수를 처음 시작하는 분들을 위한 기본 가이드입니다.',
      brandId: 1,
      createdDate: new Date(),
    };

    return (
      <MagazineCard 
        magazine={magazine}
        showBrand={false}
        showDate={false}
        previewLength={50}
        imageHeight={160}
        className="max-w-64"
      />
    );
  },
  
  // 피드 스타일 (Instagram 스타일)
  feed: () => {
    const magazines: MagazineWithImages[] = [
      {
        id: 1,
        title: '오늘의 향수 추천',
        content: '비 오는 날에 어울리는 따뜻하고 부드러운 향수를 추천드립니다. 우디와 바닐라 계열의 향이 특히 좋아요.',
        brandId: 1,
        createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
        images: [{ id: 1, imageUrl: '/images/magazines/daily-recommendation.jpg', imageOrder: 1, magazineId: 1 }],
      },
      {
        id: 2,
        title: '향수 컬렉션 정리',
        content: '제 향수 컬렉션을 정리해봤어요. 각각의 향수마다 특별한 추억이 담겨있어서 버리기가 힘드네요 😊',
        brandId: 2,
        createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
        images: [
          { id: 2, imageUrl: '/images/magazines/collection-1.jpg', imageOrder: 1, magazineId: 2 },
          { id: 3, imageUrl: '/images/magazines/collection-2.jpg', imageOrder: 2, magazineId: 2 },
          { id: 4, imageUrl: '/images/magazines/collection-3.jpg', imageOrder: 3, magazineId: 2 },
        ],
      },
    ] as MagazineWithImages[];

    return (
      <div className="space-y-6 max-w-md mx-auto">
        {magazines.map((magazine) => (
          <MagazineCard
            key={magazine.id}
            magazine={magazine}
            onClick={(magazine) => console.log('매거진 상세:', magazine.title)}
            className="w-full"
            previewLength={150}
          />
        ))}
      </div>
    );
  },
  
  // 검색 결과용
  searchResult: () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    
    const magazines: Magazine[] = [
      { id: 1, title: '향수 입문 가이드', content: '향수를 처음 시작하는 분들을 위한...', brandId: 1 },
      { id: 2, title: '여름 향수 추천', content: '더운 여름에 어울리는 상큼한 향수들...', brandId: 2 },
      { id: 3, title: '겨울 향수 컬렉션', content: '포근하고 따뜻한 겨울 향수 모음...', brandId: 3 },
    ] as Magazine[];

    const filteredMagazines = magazines.filter(magazine =>
      magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      magazine.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <input 
          type="text"
          placeholder="매거진 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-base mb-4"
        />
        
        <div className="cards-grid cards-grid--magazines">
          {filteredMagazines.map((magazine) => (
            <MagazineCard
              key={magazine.id}
              magazine={magazine}
              onClick={(magazine) => console.log('매거진 선택:', magazine.title)}
            />
          ))}
        </div>
        
        {filteredMagazines.length === 0 && searchTerm && (
          <p className="text-center text-gray-500 py-8">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
        )}
      </div>
    );
  },
  
  // 어드민 페이지용
  adminMode: () => {
    const magazine: MagazineWithImages = {
      id: 1,
      title: '브랜드 스토리: 우리의 시작',
      content: '작은 아틀리에에서 시작된 우리 브랜드의 특별한 이야기를 들려드립니다.',
      brandId: 1,
      createdDate: new Date('2024-12-10'),
      updatedDate: new Date(),
      images: [
        { id: 1, imageUrl: '/images/magazines/brand-story.jpg', imageOrder: 1, magazineId: 1 },
      ],
    };

    return (
      <div className="relative">
        <MagazineCard 
          magazine={magazine}
          onClick={(magazine) => console.log('매거진 편집 페이지로 이동')}
        />
        
        {/* 어드민 액션 버튼들 */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button 
            className="btn-base btn-ghost btn-sm p-1 bg-white/80"
            onClick={(e) => {
              e.stopPropagation();
              console.log('매거진 수정');
            }}
            aria-label="매거진 수정"
          >
            ✏️
          </button>
          <button 
            className="btn-base btn-ghost btn-sm p-1 bg-white/80"
            onClick={(e) => {
              e.stopPropagation();
              console.log('매거진 삭제');
            }}
            aria-label="매거진 삭제"
          >
            🗑️
          </button>
        </div>
        
        {/* 발행 상태 표시 */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            발행됨
          </span>
        </div>
      </div>
    );
  },
};

export default MagazineCard;