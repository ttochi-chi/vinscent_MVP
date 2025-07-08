import React from 'react';
import { Card } from '../ui/Card';
import { Magazine, MagazineWithImages } from '@/types';
import Image from 'next/image';
import { magazineImages } from '@/lib/db/schema';

export interface MagazineCardProps
{
    magazine: MagazineWithImages;
    onClick?:(magazine: MagazineWithImages) => void;
    loading?: boolean;
    className?: string;
    showBrand?: boolean;
    showDate?: boolean;
    previewLength?: number;
    imageHeight?: number;
}

const formatDate = (date: Date) : string => {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if(diffInSeconds < 60) return '방금 전';
    if(diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if(diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if(diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    
    return formatDate(date);
};

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
    const handleClick = () => {
        if(!loading && onClick) onClick(magazine);
    };

    const getFirstImage = () => {
        if('images' in magazine && magazine.images && magazine.images.length > 0) return magazine.images[0].imageUrl;
        return null;
    };

    const getContentPreview = () => {
        if(!magazine.content) return '';
        if(magazine.content.length <= previewLength) return magazine.content;
        return magazine.content.substring(0, previewLength) + '...';
    };

    if(loading)
    {
        return(
            <Card className={`magazine-card ${className}`} noHover>
                <div
                    className="skeleton-image"
                    style={{height: imageHeight}}
                />
                <div className="p-4 space-y-3">
                    <div className="skeleton-text w-3/4 h-5"/>
                    <div className="skeleton-text w-full"/>
                    <div className="skeleton-text w-2/3"/>
                    <div className="skeleton-text w-1/3"/>
                </div>
            </Card>
        );
    }

    const firstImageUrl = getFirstImage();

    return(
        <Card
            clickable={!!onClick}
            onClick={handleClick}
            className={`magazine-card ${className}`}
            aria-label={`${magazine.title} 매거진 카드`}
        >
            {/* 매거진 커버 이미지 */}
            <div
                className="magazine-card__image"
                style={{height: imageHeight}}
            >
                {firstImageUrl ? (
                    <Image
                        src={firstImageUrl}
                        alt={magazine.title}
                        width={300}
                        height={imageHeight}
                        className="magazine-card__image"
                        style={{height: imageHeight}}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-magazine.png';
                        }}
                    />
                ) : (
                    <div
                        className="magazine-card__image bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                        style={{height: imageHeight}}
                    >
                        <div className="text-center">
                            <span className="text-gray-400 text-sm mt-1">매거진</span>
                        </div>
                    </div>
                )}

                {/* 이미지 개수 표시 */}
                {'images' in magazine && magazine.images && magazine.images.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {magazine.images?.length}
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
                            {magazine.title}
                        </span>
                    )}
                    {/* 작성 날짜 */}
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
    className='',
    imageHeight = 240
}) => (
    <MagazineCard
        magazine={{id: 0, title: '', brandId: 0, content: ''} as Magazine}
        loading={true}
        className={className}
        imageHeight={imageHeight}
    />
);

export default MagazineCard;