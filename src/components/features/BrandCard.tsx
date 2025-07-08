import React from 'react';
import { Card } from '../ui/Card';
import { Brand } from '@/types';
import Image from 'next/image';

export interface BrandCardProps
{
    brand: Brand;
    onClick?: (brand: Brand) => void;
    loading?: boolean;
    className?: string;
    imageSize?: number;
}

export const BrandCard: React.FC<BrandCardProps> = ({
    brand,
    onClick,
    loading = false,
    className = '',
    imageSize = 80,
}) => {
    const handleClick = () => {
        if(!loading && onClick) onClick(brand);
    };

    if(loading)
    {
        return(
            <Card className={`brand-card ${className}`} noHover>
                <div
                    className="skelation-avatar mx-auto mb-3"
                    style={{width: imageSize, height: imageSize}}
                />
                <div className="skeleton-text w-20 mx-auto" />
            </Card>
        );
    }

    return(
        <Card
            clickable={!!onClick}
            onClick={handleClick}
            className={`brand-card ${className}`}
            aria-label={`${brand.title} 브랜드 카드`}
        >
            {/* 브랜드 로고/이미지 */}
            <div
                className="brand-card__image"
                style={{width: imageSize, height: imageSize}}
            >
                {brand.profileImageUrl ? (
                    <Image
                        src={brand.profileImageUrl}
                        alt={`${brand.title} 로고`}
                        width={imageSize}
                        height={imageSize}
                        className="brand-card__image"
                        style={{width: imageSize, height: imageSize}}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-brand.png';
                        }}
                    />
                ) : (
                    <div
                        className="brand-card__image bg-gray-200 flex items-center justify-center"
                        style={{width: imageSize, height: imageSize}}
                    >
                        <span className="text-gray-400 text-xs font-medium">
                            {brand.title.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
            {/* 브랜드명 */}
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

export const BrandCardSkeleton: React.FC<{className?: string; imageSize?:number}> = ({
    className = '',
    imageSize = 80
}) => (
    <BrandCard
        brand={{id: 0, title: '', description: ''} as Brand}
        loading={true}
        className={className}
        imageSize={imageSize}
    />
);

export default BrandCard;