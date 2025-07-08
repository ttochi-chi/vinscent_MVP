/**
 * 🧪 Vinscent MVP 컴포넌트 테스트 페이지
 * 
 * 파일 위치: src/app/test/page.tsx
 * 
 * 목적: 구현된 모든 컴포넌트의 동작을 확인하고 테스트
 * 접속: http://localhost:3000/test
 */

'use client';

import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, User, Settings, Download } from 'lucide-react';

// 🔧 컴포넌트 imports (실제 프로젝트에서는 정확한 경로 사용)
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import Modal, { ModalContent, ModalFooter, ConfirmDialog } from '@/components/ui/Modal';
import Header from '@/components/layout/Header';
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
} from '@/components/ui/[utility]';

// 🔧 타입 imports
import { Brand, Product, Magazine } from '@/types';

// 🔧 테스트용 샘플 데이터
const sampleBrands: Brand[] = [
  {
    id: 1,
    title: 'Tom Ford',
    description: '럭셔리 프리미엄 향수 브랜드',
    profileImageUrl: 'https://via.placeholder.com/80x80/000000/FFFFFF?text=TF',
    createdDate: new Date(),
    updatedDate: new Date(),
  },
  {
    id: 2,
    title: 'Chanel',
    description: '프렌치 엘레강스',
    profileImageUrl: 'https://via.placeholder.com/80x80/000000/FFFFFF?text=CH',
    createdDate: new Date(),
    updatedDate: new Date(),
  },
  {
    id: 3,
    title: 'Dior',
    description: '모던 클래식',
    profileImageUrl: '',
    createdDate: new Date(),
    updatedDate: new Date(),
  },
];

const sampleProducts: Product[] = [
  {
    id: 1,
    title: 'Black Orchid',
    description: '신비롭고 관능적인 플로럴 우디 향수',
    price: 250000,
    mainImageUrl: 'https://via.placeholder.com/250x200/8B4513/FFFFFF?text=Black+Orchid',
    brandId: 1,
    topNote: '트러플, 일랑일랑, 블랙커런트',
    middleNote: '오키드, 스파이시 노트',
    baseNote: '패출리, 바닐라, 인센스',
    createdDate: new Date(),
    updatedDate: new Date(),
  },
  {
    id: 2,
    title: 'Santal 33',
    description: '유니섹스 샌달우드 향수',
    price: 380000,
    mainImageUrl: 'https://via.placeholder.com/250x200/D2691E/FFFFFF?text=Santal+33',
    brandId: 2,
    createdDate: new Date(),
    updatedDate: new Date(),
  },
];

const sampleMagazines: Magazine[] = [
  {
    id: 1,
    title: '향수의 계절별 선택 가이드',
    content: '봄, 여름, 가을, 겨울 각 계절에 어울리는 향수를 소개합니다. 계절의 특성과 어울리는 향조를 자세히 알아보세요.',
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('buttons');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔧 탭 메뉴
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

  // 🔧 탭 컨텐츠 렌더링
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

      case 'inputs':
        return (
          <div className="space-y-8 max-w-md">
            <section>
              <h3 className="text-lg font-semibold mb-4">기본 입력창</h3>
              <div className="space-y-4">
                <Input 
                  label="이름" 
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <Input 
                  label="이메일" 
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  helperText="유효한 이메일 주소를 입력하세요"
                />
                <Input 
                  label="비밀번호" 
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">상태별 입력창</h3>
              <div className="space-y-4">
                <Input 
                  label="에러 상태" 
                  error
                  errorMessage="올바른 값을 입력하세요"
                  defaultValue="잘못된 값"
                />
                <Input 
                  label="비활성화" 
                  disabled
                  defaultValue="수정할 수 없음"
                />
                <Input 
                  search
                  placeholder="검색어를 입력하세요"
                  hideLabel
                  label="검색"
                />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">아이콘 입력창</h3>
              <div className="space-y-4">
                <Input 
                  label="사용자명" 
                  leftIcon={User}
                  placeholder="사용자명"
                />
                <Input 
                  label="설정값" 
                  rightIcon={Settings}
                  placeholder="설정값 입력"
                />
              </div>
            </section>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">기본 카드</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent>
                    <h4 className="text-lg font-medium mb-2">기본 카드</h4>
                    <p className="text-gray-600">기본적인 카드입니다.</p>
                  </CardContent>
                </Card>

                <Card clickable onClick={() => alert('카드 클릭됨!')}>
                  <CardContent>
                    <h4 className="text-lg font-medium mb-2">클릭 가능한 카드</h4>
                    <p className="text-gray-600">클릭해보세요!</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="text-lg font-semibold">완전한 카드</h4>
                    <p className="text-sm text-gray-500">헤더 포함</p>
                  </CardHeader>
                  <CardContent>
                    <p>메인 콘텐츠 영역</p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">액션</Button>
                  </CardFooter>
                </Card>
              </div>
            </section>
          </div>
        );

      case 'modals':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">모달 테스트</h3>
              <div className="flex gap-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  기본 모달 열기
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  확인 다이얼로그
                </Button>
              </div>

              {/* 기본 모달 */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="테스트 모달"
                size="md"
              >
                <ModalContent>
                  <p className="mb-4">모달 테스트 내용입니다.</p>
                  <Input 
                    label="테스트 입력"
                    placeholder="모달 내 입력창"
                  />
                </ModalContent>
                <ModalFooter>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>
                    확인
                  </Button>
                </ModalFooter>
              </Modal>

              {/* 확인 다이얼로그 */}
              <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => alert('확인됨!')}
                title="정말 삭제하시겠습니까?"
                message="이 작업은 되돌릴 수 없습니다."
                variant="danger"
              />
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

            <section>
              <h3 className="text-lg font-semibold mb-4">스켈레톤 로딩</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardSkeleton type="brand" />
                <CardSkeleton type="product" />
                <CardSkeleton type="magazine" />
              </div>
            </section>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-8 max-w-2xl">
            <section>
              <h3 className="text-lg font-semibold mb-4">이미지 업로드</h3>
              <ImageUpload
                label="테스트 이미지 업로드"
                value={images}
                onChange={setImages}
                maxImages={3}
              />
            </section>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">브랜드 카드</h3>
              <div className="cards-grid cards-grid--brands">
                {sampleBrands.map((brand) => (
                  <BrandCard 
                    key={brand.id}
                    brand={brand}
                    onClick={(brand) => alert(`브랜드 클릭: ${brand.title}`)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">제품 카드</h3>
              <div className="cards-grid cards-grid--products">
                {sampleProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onClick={(product) => alert(`제품 클릭: ${product.title}`)}
                    showNotes={true}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-4">매거진 카드</h3>
              <div className="cards-grid cards-grid--magazines">
                {sampleMagazines.map((magazine) => (
                  <MagazineCard 
                    key={magazine.id}
                    magazine={magazine}
                    onClick={(magazine) => alert(`매거진 클릭: ${magazine.title}`)}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4">레이아웃 테스트</h3>
              <p className="text-gray-600 mb-4">
                현재 페이지가 MainLayout으로 감싸져 있습니다. 
                Header와 Footer가 정상적으로 표시되는지 확인하세요.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">레이아웃 구성 요소:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>✅ Header: 로고, 네비게이션, 검색, 사용자 메뉴</li>
                  <li>✅ Main Content: 현재 이 영역</li>
                  <li>✅ Footer: 링크, 저작권, 소셜 미디어</li>
                </ul>
              </div>

              <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                leftIcon={User}
              >
                맨 위로 스크롤
              </Button>
            </section>
          </div>
        );

      default:
        return <div>탭을 선택하세요.</div>;
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
}