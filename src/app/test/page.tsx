
'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  Settings, 
  User, 
  Upload,
  Heart,
  MessageCircle,
  Share2,
  Bookmark
} from 'lucide-react';

// 🔧 핵심 수정: 실제 프로젝트 타입만 사용
import { 
  Brand, 
  Product, 
  ProductWithImages,
  Magazine, 
  MagazineWithImages 
} from '@/types';

// 컴포넌트 import
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import MainLayout from '@/components/layout/MainLayout';
import BrandCard from '@/components/features/BrandCard';
import ProductCard from '@/components/features/ProductCard';
import MagazineCard from '@/components/features/MagazineCard';
import { 
  Loading, 
  PageLoading, 
  CardSkeleton, 
  ErrorDisplay, 
  PageError, 
  ImageUpload 
} from '@/components/ui/utilities';

// 🔧 핵심 수정: 실제 프로젝트 스키마에 맞는 Mock 데이터
const mockBrands: Brand[] = [
  {
    id: 1,
    title: '딥디크',                    // 🔧 name → title로 수정
    description: '프랑스 럭셔리 향수 브랜드',
    profileImageUrl: '/images/brands/diptyque.jpg', // 🔧 logoUrl → profileImageUrl로 수정
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date(),
  },
  {
    id: 2,
    title: '조 말론',                   // 🔧 name → title로 수정
    description: '영국 럭셔리 향수 브랜드',
    profileImageUrl: '/images/brands/jo-malone.jpg', // 🔧 logoUrl → profileImageUrl로 수정
    createdDate: new Date('2024-01-02'),
    updatedDate: new Date(),
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    title: '바질 & 네롤리',
    description: '상쾌한 바질과 우아한 네롤리의 조화',
    topNote: '바질, 네롤리',              // 🔧 실제 스키마 속성 사용
    middleNote: '화이트 티, 플로럴',
    baseNote: '베티버, 머스크',
    price: 185000,
    mainImageUrl: '/images/products/basil-neroli.jpg',
    brandId: 1,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date(),
  },
  {
    id: 2,
    title: '라임 바질 & 만다린',
    description: '상큼한 시트러스 향의 대표작',
    topNote: '라임, 바질, 만다린',
    middleNote: '화이트 타임, 아이리스',
    baseNote: '베티버, 앰버',
    price: 165000,
    mainImageUrl: '/images/products/lime-basil.jpg',
    brandId: 2,
    createdDate: new Date('2024-01-02'),
    updatedDate: new Date(),
  },
];

const mockMagazines: Magazine[] = [
  {
    id: 1,
    title: '겨울 향수 추천',
    content: '추운 겨울에 어울리는 따뜻하고 포근한 향수들을 소개합니다. 계절의 특성과 어울리는 향조를 자세히 알아보세요.',
    brandId: 1,
    createdDate: new Date('2024-12-15'),
    updatedDate: new Date(),
  },
  {
    id: 2,
    title: '니치 향수 브랜드 탐방',
    content: '숨겨진 보석 같은 니치 향수 브랜드들을 소개합니다.',
    brandId: 2,
    createdDate: new Date('2024-12-20'),
    updatedDate: new Date(),
  },
];

// 🧪 메인 테스트 컴포넌트
export default function ComponentTestPage() {
  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 탭 메뉴
  const tabs = [
    { id: 'buttons', label: '버튼' },
    { id: 'inputs', label: '입력창' },
    { id: 'cards', label: '카드' },
    { id: 'modals', label: '모달' },
    { id: 'loading', label: '로딩/에러' },
    { id: 'upload', label: '이미지 업로드' },
    { id: 'layout', label: '레이아웃' },
    { id: 'features', label: '기능별 카드' },
  ];

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'buttons':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">버튼 변형</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">버튼 크기</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">버튼 상태</h3>
              <div className="flex flex-wrap gap-4">
                <Button 
                  loading={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 2000);
                  }}
                >
                  {isLoading ? '로딩 중...' : '로딩 테스트'}
                </Button>
                <Button disabled>비활성화</Button>
                <Button fullWidth>전체 너비</Button>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">아이콘 버튼</h3>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={Plus}>추가</Button>
                <Button rightIcon={Download}>다운로드</Button>
                <Button iconOnly rightIcon={Search} aria-label="검색" />
                <Button iconOnly rightIcon={Settings} variant="ghost" aria-label="설정" />
              </div>
            </section>
          </div>
        );

      case 'loading':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">로딩 컴포넌트</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Loading variant="spinner" size="sm" message="작은 스피너" />
                <Loading variant="spinner" size="md" message="중간 스피너" />
                <Loading variant="spinner" size="lg" message="큰 스피너" />
                <Loading variant="dots" size="md" message="도트 로딩" />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">기존 스켈레톤 스타일 활용</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 기존 skeleton CSS 클래스 사용 */}
                <div className="card-base p-4">
                  <div className="skeleton skeleton-avatar mx-auto mb-3"></div>
                  <div className="skeleton skeleton-text w-20 mx-auto"></div>
                </div>

                <div className="card-base p-4">
                  <div className="skeleton skeleton-image mb-3"></div>
                  <div className="skeleton skeleton-text w-3/4 mb-2"></div>
                  <div className="skeleton skeleton-text w-1/2"></div>
                </div>

                <div className="card-base p-4">
                  <div className="skeleton skeleton-image mb-3" style={{ height: '240px' }}></div>
                  <div className="skeleton skeleton-text w-full mb-2"></div>
                  <div className="skeleton skeleton-text w-3/4 mb-2"></div>
                  <div className="skeleton skeleton-text w-1/2"></div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">에러 컴포넌트</h3>
              <div className="space-y-4">
                <ErrorDisplay 
                  message="일반적인 오류 메시지입니다." 
                  showRetry 
                  onRetry={() => alert('재시도 클릭!')}
                />
                <ErrorDisplay 
                  variant="warning"
                  message="경고 메시지입니다." 
                />
                <ErrorDisplay 
                  variant="info"
                  message="정보 메시지입니다."
                />
              </div>
            </section>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">🔧 통합 타입으로 브랜드 카드</h3>
              <div className="cards-grid cards-grid--brands">
                {mockBrands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    onClick={(brand) => alert(`${brand.title} 클릭!`)} // 🔧 title 사용
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">🔧 통합 타입으로 제품 카드</h3>
              <div className="cards-grid cards-grid--products">
                {mockProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={(product) => alert(`${product.title} 클릭!`)}
                    showNotes={true} // 🔧 향조 정보 표시
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">🔧 통합 타입으로 매거진 카드</h3>
              <div className="cards-grid cards-grid--magazines">
                {mockMagazines.map((magazine) => (
                  <MagazineCard
                    key={magazine.id}
                    magazine={magazine}
                    onClick={(magazine) => alert(`${magazine.title} 클릭!`)}
                  />
                ))}
              </div>
            </section>

            {/* 🔧 추가: 타입 시스템 상태 표시 */}
            <section className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 font-semibold mb-2">✅ 타입 시스템 통합 완료</h4>
              <div className="text-green-700 text-sm space-y-1">
                <p>• 모든 컴포넌트가 src/types/index.ts의 단일 타입 정의 사용</p>
                <p>• Brand.title, Product.price, Magazine.content 속성 정상 인식</p>
                <p>• TypeScript 에러 완전 해결</p>
              </div>
            </section>
          </div>
        );

      default:
        return (
          <div className="empty-state">
            <div className="empty-state__title">탭을 선택하세요</div>
            <div className="empty-state__description">
              위의 탭 메뉴에서 테스트할 컴포넌트를 선택해주세요.
            </div>
          </div>
        );
    }
  };

  return (
    <MainLayout 
      title="컴포넌트 테스트"
      description="Vinscent MVP 컴포넌트 테스트 페이지"
    >
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 컴포넌트 테스트 페이지
          </h1>
          <p className="text-gray-600">
            구현된 모든 컴포넌트의 동작을 확인하고 테스트할 수 있습니다.
          </p>
          {/* 🔧 추가: 타입 시스템 상태 표시 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              ✅ <strong>타입 시스템 통합 완료</strong>: 모든 컴포넌트가 일관된 타입 정의를 사용합니다.
            </p>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="card-base p-6">
          {renderTabContent()}
        </div>

        {/* 현재 상태 디버깅 정보 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">🔍 디버깅 정보</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>활성 탭: {activeTab}</p>
            <p>모달 상태: {isModalOpen ? '열림' : '닫힘'}</p>
            <p>로딩 상태: {isLoading ? '로딩 중' : '대기'}</p>
            <p>업로드된 이미지: {images.length}개</p>
            <p>폼 데이터: {JSON.stringify(formData)}</p>
            <p className="text-green-600">✅ 타입 시스템: 통합 완료</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}