import React from 'react';
import { Card } from '../ui/Card';
import { Product, ProductWithImages } from '@/types';
import Image from 'next/image';

// TypeScript 인터페이스
export interface ProductCardProps
{
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

// ProductCard 컴포넌트
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
    const handleClick =() => {
        if(!loading && onClick) onClick(product);
    };
    if(loading)
    {
        return(
            <Card className={`product-card ${className}`} noHover>
                <div className="skeleton-image"/>
                <div className="p-3 space-y-2">
                    <div className="skeleton-text w-3/4"/>
                    <div className="skeleton-text w-1/2"/>
                    <div className="skeleton-text w-1/3"/>
                </div>
            </Card>
        );
    }

    return(
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
                            const target = e.target as HTMLImageElement;
                            target.src ='/images/default-product.png';
                        }}
                    />
                ) : (
                    <div className="product-card__image bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">이미지 없음</span>
                    </div>
                )}
            </div>

            {/* 제품 정보 */}
            <div className="p-3 space-y-2">
                {/* 제품명 */}
                <h3 className="product-card__title">
                    {product.title}
                </h3>

                {/* 브랜드명 */}
                {showBrand&&(
                    <p className="product-card__brand">
                        브랜드 ID : {product.brandId} 
                        {/* 브랜드명이 들어가야하는데 임시로 브랜드 ID */}
                    </p>
                )}
                {/* 가격 */}
                {showPrice && (
                    <p className="text-lg font-semibold text-gray-900">
                        {formatPrice(product.price)}
                    </p>
                )}

                {/* 제품 설명 */}
                {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* 노트 정보 */}
                {showNotes && (product.topNote || product.middleNote || product.baseNote) && (
                    <div className="space-y-1">
                        {product.topNote && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">탑 노트 : </span> {product.topNote}
                            </p>
                        )}
                        {product.middleNote && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">미들 노트 : </span> {product.middleNote}
                            </p>
                        )}
                        {product.baseNote && (
                            <p className="text-xs text-gray-500">
                                <span className="font-medium">베이스 노트 : </span> {product.baseNote}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

// 스켈레톤 로딩
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ 
    className = '' 
}) => (
    <ProductCard
        product={{ id: 0, title: '', price: 0, brandId: 0 } as Product}
        loading={true}
        className={className}
    />
);

export default ProductCard;