/**
 * MagazineCard 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거
 * - Card 컴포넌트 활용으로 일관성 확보
 * - compound component 패턴 적용
 * - 날짜 포맷팅 유틸리티 포함
 * 
 * 사용처: 매거진 목록, 매거진 피드
 * 근원지: MVP에 필요한 매거진 표시 기능
 */

import React from 'react';
import Card from '../ui/Card';
import { Magazine, MagazineWithImages } from '@/types';

// ===== 날짜 포맷팅 유틸리티 =====
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

const formatRelativeTime = (date: Date | string | undefined): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  
  return formatDate(dateObj);
};

// ===== Props 타입 정의 =====
export interface MagazineCardProps {
  /** 매거진 데이터 */
  magazine: Magazine | MagazineWithImages;
  /** 클릭 핸들러 */
  onClick?: (magazine: Magazine | MagazineWithImages) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 브랜드 표시 여부 */
  showBrand?: boolean;
  /** 날짜 표시 여부 */
  showDate?: boolean;
  /** 콘텐츠 미리보기 길이 */
  previewLength?: number;
  /** 이미지 높이 */
  imageHeight?: number;
  /** 레이아웃 타입 */
  layout?: 'vertical' | 'horizontal';
  /** 상대 시간 표시 */
  useRelativeTime?: boolean;
}

/**
 * MagazineCard 루트 컴포넌트
 * 
 * @example
 * // 기본 사용
 * <MagazineCard 
 *   magazine={magazineData}
 *   onClick={handleMagazineClick}
 * />
 * 
 * @example
 * // 가로 레이아웃
 * <MagazineCard 
 *   magazine={magazineData}
 *   layout="horizontal"
 *   previewLength={150}
 * />
 */
const MagazineCardRoot: React.FC<MagazineCardProps> = ({
  magazine,
  onClick,
  loading = false,
  className = '',
  showBrand = true,
  showDate = true,
  previewLength = 100,
  imageHeight = 240,
  layout = 'vertical',
  useRelativeTime = true,
}) => {
  // 클릭 핸들러
  const handleClick = () => {
    if (!loading && onClick) {
      onClick(magazine);
    }
  };

  // 첫 번째 이미지 가져오기
  const getFirstImage = (): string | null => {
    if ('images' in magazine && magazine.images && magazine.images.length > 0) {
      return magazine.images[0].imageUrl;
    }
    return null;
  };

  // 콘텐츠 미리보기 생성
  const getContentPreview = (): string => {
    if (!magazine.content) return '';
    if (magazine.content.length <= previewLength) return magazine.content;
    return magazine.content.substring(0, previewLength) + '...';
  };

  // 이미지 개수 확인
  const getImageCount = (): number => {
    if ('images' in magazine && magazine.images) {
      return magazine.images.length;
    }
    return 0;
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <Card 
        type="magazine"
        horizontal={layout === 'horizontal'}
        className={`magazine-card ${className}`}
        loading
      >
        <div 
          className="skeleton skeleton-image skeleton-image--tall"
          style={{ height: imageHeight }}
        />
        <Card.Content>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text skeleton-text--short" />
        </Card.Content>
      </Card>
    );
  }

  const firstImageUrl = getFirstImage();
  const imageCount = getImageCount();

  return (
    <Card 
      type="magazine"
      horizontal={layout === 'horizontal'}
      className={`magazine-card magazine-card--${layout} ${className}`}
      href={onClick ? '#' : undefined}
    >
      {/* 매거진 커버 이미지 */}
      <Card.Media 
        src={firstImageUrl || undefined}
        alt={magazine.title}
        style={{ height: imageHeight }}
      >
        {!firstImageUrl && (
          <div className="magazine-card__no-image">
            <span>📰</span>
            <span>매거진</span>
          </div>
        )}
        
        {/* 이미지 개수 표시 */}
        {imageCount > 1 && (
          <div className="magazine-card__image-count">
            📷 {imageCount}
          </div>
        )}
      </Card.Media>

      {/* 매거진 콘텐츠 */}
      <Card.Content>
        {/* 매거진 제목 */}
        <Card.Title>{magazine.title}</Card.Title>

        {/* 콘텐츠 미리보기 */}
        {magazine.content && (
          <p className="magazine-card__preview">
            {getContentPreview()}
          </p>
        )}

        {/* 메타 정보 */}
        {(showBrand || showDate) && (
          <div className="magazine-card__meta">
            {/* 브랜드 정보 */}
            {showBrand && (
              <span className="magazine-card__brand">
                브랜드 #{magazine.brandId}
              </span>
            )}

            {/* 날짜 정보 */}
            {showDate && magazine.createdDate && (
              <span className="magazine-card__date">
                {useRelativeTime 
                  ? formatRelativeTime(magazine.createdDate)
                  : formatDate(magazine.createdDate)
                }
              </span>
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

// ===== 스켈레톤 컴포넌트 =====
interface MagazineCardSkeletonProps {
  className?: string;
  imageHeight?: number;
  layout?: 'vertical' | 'horizontal';
}

const MagazineCardSkeleton: React.FC<MagazineCardSkeletonProps> = ({ 
  className = '', 
  imageHeight = 240,
  layout = 'vertical'
}) => (
  <MagazineCardRoot
    magazine={{ id: 0, title: '', brandId: 0, content: '' } as Magazine}
    loading={true}
    className={className}
    imageHeight={imageHeight}
    layout={layout}
  />
);

// ===== 매거진 카드 그리드 =====
interface MagazineCardGridProps {
  magazines: (Magazine | MagazineWithImages)[];
  onMagazineClick?: (magazine: Magazine | MagazineWithImages) => void;
  loading?: boolean;
  loadingCount?: number;
  columns?: 1 | 2 | 3 | 4;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

const MagazineCardGrid: React.FC<MagazineCardGridProps> = ({
  magazines,
  onMagazineClick,
  loading = false,
  loadingCount = 6,
  columns = 3,
  layout = 'vertical',
  className = ''
}) => {
  if (loading) {
    return (
      <Card.Grid columns={columns} className={className}>
        {[...Array(loadingCount)].map((_, index) => (
          <MagazineCardSkeleton key={index} layout={layout} />
        ))}
      </Card.Grid>
    );
  }

  return (
    <Card.Grid columns={columns} className={className}>
      {magazines.map((magazine) => (
        <MagazineCard
          key={magazine.id}
          magazine={magazine}
          onClick={onMagazineClick}
          layout={layout}
        />
      ))}
    </Card.Grid>
  );
};

// ===== 매거진 피드 =====
interface MagazineFeedProps {
  magazines: (Magazine | MagazineWithImages)[];
  onMagazineClick?: (magazine: Magazine | MagazineWithImages) => void;
  loading?: boolean;
  className?: string;
}

const MagazineFeed: React.FC<MagazineFeedProps> = ({
  magazines,
  onMagazineClick,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`magazine-feed ${className}`}>
        {[...Array(3)].map((_, index) => (
          <MagazineCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`magazine-feed ${className}`}>
      {magazines.map((magazine) => (
        <MagazineCard
          key={magazine.id}
          magazine={magazine}
          onClick={onMagazineClick}
          previewLength={200}
          useRelativeTime
        />
      ))}
    </div>
  );
};

// ===== Compound Component 구성 =====
const MagazineCard = Object.assign(MagazineCardRoot, {
  Skeleton: MagazineCardSkeleton,
  Grid: MagazineCardGrid,
  Feed: MagazineFeed,
});

export default MagazineCard;

// ===== 사용 예시 =====
export const MagazineCardExamples = {
  // 기본 사용
  basic: () => {
    const sampleMagazine: MagazineWithImages = {
      id: 1,
      title: '향수의 계절별 선택 가이드',
      content: '봄, 여름, 가을, 겨울 각 계절에 어울리는 향수를 소개합니다. 계절의 특성과 어울리는 향조를 자세히 알아보세요.',
      brandId: 1,
      createdDate: new Date('2024-12-15'),
      updatedDate: new Date(),
      images: [
        { id: 1, imageUrl: '/images/magazines/seasonal-guide.jpg', imageOrder: 1, magazineId: 1 },
        { id: 2, imageUrl: '/images/magazines/seasonal-guide-2.jpg', imageOrder: 2, magazineId: 1 },
      ],
    };

    return (
      <MagazineCard 
        magazine={sampleMagazine}
        onClick={(magazine) => console.log('매거진 클릭:', magazine.title)}
      />
    );
  },

  // 매거진 그리드
  grid: () => {
    const magazines: Magazine[] = [
      {
        id: 1,
        title: '니치 향수 브랜드 탐방',
        content: '숨겨진 보석 같은 니치 향수 브랜드들을 소개합니다.',
        brandId: 1,
        createdDate: new Date('2024-12-20'),
      },
      {
        id: 2,
        title: '향수 레이어링 기법',
        content: '여러 향수를 조합하여 나만의 시그니처 향을 만드는 방법',
        brandId: 2,
        createdDate: new Date('2024-12-18'),
      },
      {
        id: 3,
        title: '향수 보관법과 관리',
        content: '소중한 향수를 오래도록 즐기기 위한 올바른 보관 방법',
        brandId: 3,
        createdDate: new Date('2024-12-15'),
      },
    ];

    return (
      <MagazineCard.Grid
        magazines={magazines}
        onMagazineClick={(magazine) => console.log('매거진 선택:', magazine.title)}
        columns={3}
      />
    );
  },

  // 가로 레이아웃
  horizontal: () => {
    const magazine: Magazine = {
      id: 1,
      title: '2024 향수 트렌드 리포트',
      content: '올해 가장 주목받은 향수들과 앞으로의 트렌드를 분석합니다. 전문가들의 의견과 함께 살펴보는 향수 시장의 미래.',
      brandId: 1,
      createdDate: new Date(),
    };

    return (
      <MagazineCard
        magazine={magazine}
        layout="horizontal"
        previewLength={200}
        imageHeight={180}
      />
    );
  },

  // 피드 스타일
  feed: () => {
    const magazines: MagazineWithImages[] = [
      {
        id: 1,
        title: '오늘의 향수 추천',
        content: '비 오는 날에 어울리는 따뜻하고 부드러운 향수를 추천드립니다. 우디와 바닐라 계열의 향이 특히 좋아요.',
        brandId: 1,
        createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
        images: [{ id: 1, imageUrl: '/images/magazines/daily.jpg', imageOrder: 1, magazineId: 1 }],
      },
      {
        id: 2,
        title: '향수 컬렉션 정리',
        content: '제 향수 컬렉션을 정리해봤어요. 각각의 향수마다 특별한 추억이 담겨있어서 정리하는 것도 즐거웠습니다.',
        brandId: 2,
        createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
        images: [
          { id: 2, imageUrl: '/images/magazines/collection-1.jpg', imageOrder: 1, magazineId: 2 },
          { id: 3, imageUrl: '/images/magazines/collection-2.jpg', imageOrder: 2, magazineId: 2 },
        ],
      },
    ] as MagazineWithImages[];

    return (
      <MagazineCard.Feed
        magazines={magazines}
        onMagazineClick={(magazine) => console.log('매거진 상세:', magazine.title)}
      />
    );
  },

  // 로딩 상태
  loading: () => (
    <MagazineCard.Grid
      magazines={[]}
      loading
      loadingCount={6}
      columns={3}
    />
  ),

  // 날짜 형식
  dateFormats: () => {
    const magazine: Magazine = {
      id: 1,
      title: '시간대별 향수 추천',
      content: '아침, 점심, 저녁 시간대별로 어울리는 향수를 추천합니다.',
      brandId: 1,
      createdDate: new Date(),
    };

    return (
      <div className="space-y-4">
        <MagazineCard
          magazine={magazine}
          useRelativeTime={true}
        />
        <MagazineCard
          magazine={magazine}
          useRelativeTime={false}
        />
      </div>
    );
  }
};