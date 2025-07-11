/**
 * 컴포넌트 테스트 페이지
 * 
 * 🔧 모든 컴포넌트의 상태 점검용 페이지
 * - 각 컴포넌트의 모든 변형 확인
 * - 스타일 적용 확인
 * - 인터랙션 테스트
 * 
 * 사용처: 개발 시 컴포넌트 상태 확인
 * URL: /test/components
 */

'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal, { useModal } from '@/components/ui/Modal';
import Form from '@/components/ui/Form';
import BrandCard from '@/components/features/BrandCard';
import MagazineCard from '@/components/features/MagazineCard';
import ProductCard from '@/components/features/ProductCard';
import { Brand, Product, Magazine } from '@/types';

export default function ComponentTestPage() {
  // 테스트 데이터
  const testBrand: Brand = {
    id: 1,
    title: 'Tom Ford',
    description: '럭셔리 프리미엄 향수 브랜드',
    profileImageUrl: undefined, // 테스트를 위해 이미지 제거
  };

  const testProduct: Product = {
    id: 1,
    title: 'Black Orchid',
    description: '신비롭고 관능적인 플로럴 우디 향수',
    price: 250000,
    mainImageUrl: undefined, // 테스트를 위해 이미지 제거
    brandId: 1,
    topNote: '트러플, 일랑일랑',
    middleNote: '오키드, 스파이시',
    baseNote: '패출리, 바닐라',
  };

  const testMagazine: Magazine = {
    id: 1,
    title: '2024 향수 트렌드 리포트',
    content: '올해 가장 주목받은 향수들과 앞으로의 트렌드를 분석합니다.',
    brandId: 1,
    createdDate: new Date(),
  };

  return (
    <div className="container mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">컴포넌트 테스트 페이지</h1>

      {/* Button 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">1. Button 컴포넌트</h2>
        
        <div className="space-y-6">
          {/* 기본 버튼들 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Variants</h3>
            <div className="flex gap-3 flex-wrap">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          {/* 크기 변형 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Sizes</h3>
            <div className="flex gap-3 items-center flex-wrap">
              <Button size="xs">XS Button</Button>
              <Button size="sm">SM Button</Button>
              <Button size="md">MD Button</Button>
              <Button size="lg">LG Button</Button>
              <Button size="xl">XL Button</Button>
            </div>
          </div>

          {/* 상태 */}
          <div>
            <h3 className="text-lg font-medium mb-2">States</h3>
            <div className="flex gap-3 flex-wrap">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>

          {/* 링크 버튼 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Link Buttons</h3>
            <div className="flex gap-3 flex-wrap">
              <Button as="a" href="#link">Link Button</Button>
              <Button as="a" href="#secondary" variant="secondary">Secondary Link</Button>
            </div>
          </div>

          {/* 아이콘 버튼 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Icon Buttons</h3>
            <div className="flex gap-3 flex-wrap">
              <Button iconOnly size="sm" aria-label="수정">✏️</Button>
              <Button iconOnly size="sm" variant="danger" aria-label="삭제">🗑️</Button>
              <Button iconOnly variant="ghost" aria-label="메뉴">☰</Button>
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Button Groups</h3>
            <div className="space-y-3">
              <Button.Group attached>
                <Button variant="secondary">이전</Button>
                <Button variant="secondary">다음</Button>
              </Button.Group>
              
              <Button.Group attached vertical>
                <Button size="sm">위로</Button>
                <Button size="sm">아래로</Button>
              </Button.Group>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* Card 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">2. Card 컴포넌트</h2>
        
        <div className="space-y-6">
          {/* 기본 카드 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <Card.Header>
                  <Card.Title>기본 카드</Card.Title>
                  <Card.Subtitle>부제목</Card.Subtitle>
                </Card.Header>
                <Card.Content>
                  카드 내용이 들어갑니다.
                </Card.Content>
              </Card>

              <Card variant="elevated">
                <Card.Content>
                  <Card.Title>Elevated 카드</Card.Title>
                  <p>그림자가 있는 카드입니다.</p>
                </Card.Content>
              </Card>

              <Card variant="filled">
                <Card.Content>
                  <Card.Title>Filled 카드</Card.Title>
                  <p>배경색이 있는 카드입니다.</p>
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* 이미지 카드 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Image Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <Card.Media>
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span>이미지 영역</span>
                  </div>
                </Card.Media>
                <Card.Content>
                  <Card.Title>이미지 카드</Card.Title>
                  <p>이미지가 포함된 카드</p>
                </Card.Content>
              </Card>

              <Card clickable onClick={() => console.log('카드 클릭')}>
                <Card.Badge>NEW</Card.Badge>
                <Card.Media>
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <span>클릭 가능</span>
                  </div>
                </Card.Media>
                <Card.Content>
                  <Card.Title>클릭 가능한 카드</Card.Title>
                </Card.Content>
              </Card>

              <Card horizontal>
                <Card.Media>
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                    <span>IMG</span>
                  </div>
                </Card.Media>
                <Card.Content>
                  <Card.Title>가로형 카드</Card.Title>
                  <p>이미지와 콘텐츠가 나란히</p>
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* 특수 카드 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Special Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card type="product">
                <Card.Badge>SALE</Card.Badge>
                <Card.Media>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span>제품 이미지</span>
                  </div>
                </Card.Media>
                <Card.Content>
                  <Card.Title>제품 카드</Card.Title>
                  <Card.Subtitle>브랜드명</Card.Subtitle>
                  <Card.Price price={180000} originalPrice={250000} discount={28} />
                </Card.Content>
              </Card>

              <Card type="magazine">
                <Card.Media>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span>매거진 커버</span>
                  </div>
                </Card.Media>
                <Card.Content>
                  <Card.Title>매거진 카드</Card.Title>
                  <p>매거진 내용 미리보기...</p>
                  <Card.Author 
                    name="작성자" 
                    date="2024.12.20"
                  />
                </Card.Content>
              </Card>
            </div>
          </div>

          {/* 로딩 상태 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Loading State</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card loading>
                <div className="skeleton skeleton-image h-40" />
                <Card.Content>
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text skeleton-text--short" />
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* Modal 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">3. Modal 컴포넌트</h2>
        <ModalTest />
      </section>

      <hr />

      {/* Form 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">4. Form 컴포넌트</h2>
        <FormTest />
      </section>

      <hr />

      {/* BrandCard 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">5. BrandCard 컴포넌트</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Single Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <BrandCard brand={testBrand} onClick={(b) => console.log('브랜드:', b)} />
              <BrandCard brand={{ ...testBrand, profileImageUrl: undefined }} />
              <BrandCard brand={testBrand} selected />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Brand Grid</h3>
            <BrandCard.Grid
              brands={[
                testBrand,
                { ...testBrand, id: 2, title: 'Chanel' },
                { ...testBrand, id: 3, title: 'Dior', profileImageUrl: undefined },
                { ...testBrand, id: 4, title: 'Hermès' },
              ]}
              onBrandClick={(b) => console.log('선택:', b)}
              columns={4}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Compact Mode</h3>
            <BrandCard.Grid
              brands={[
                { id: 1, title: 'Creed' },
                { id: 2, title: 'Byredo' },
                { id: 3, title: 'Le Labo' },
                { id: 4, title: 'Diptyque' },
              ] as Brand[]}
              columns={4}
              compact
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Loading State</h3>
            <BrandCard.Grid
              brands={[]}
              loading
              loadingCount={4}
              columns={4}
            />
          </div>
        </div>
      </section>

      <hr />

      {/* MagazineCard 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">6. MagazineCard 컴포넌트</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Single Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MagazineCard magazine={testMagazine} onClick={(m) => console.log('매거진:', m)} />
              <MagazineCard magazine={testMagazine} layout="horizontal" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Magazine Grid</h3>
            <MagazineCard.Grid
              magazines={[
                testMagazine,
                { ...testMagazine, id: 2, title: '향수 레이어링 기법' },
                { ...testMagazine, id: 3, title: '니치 향수 브랜드' },
              ]}
              onMagazineClick={(m) => console.log('선택:', m)}
              columns={3}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Magazine Feed</h3>
            <MagazineCard.Feed
              magazines={[
                { ...testMagazine, createdDate: new Date(Date.now() - 2 * 60 * 60 * 1000) },
                { ...testMagazine, id: 2, createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000) },
              ]}
              onMagazineClick={(m) => console.log('매거진:', m)}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Loading State</h3>
            <MagazineCard.Grid
              magazines={[]}
              loading
              loadingCount={3}
              columns={3}
            />
          </div>
        </div>
      </section>

      <hr />

      {/* ProductCard 컴포넌트 테스트 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">7. ProductCard 컴포넌트</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Single Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProductCard product={testProduct} onClick={(p) => console.log('제품:', p)} />
              <ProductCard product={testProduct} showNotes />
              <ProductCard product={testProduct} originalPrice={350000} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Product Grid</h3>
            <ProductCard.Grid
              products={[
                testProduct,
                { ...testProduct, id: 2, title: 'Aventus', price: 420000 },
                { ...testProduct, id: 3, title: 'Santal 33', price: 380000, mainImageUrl: undefined },
              ]}
              onProductClick={(p) => console.log('선택:', p)}
              columns={3}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Product List</h3>
            <ProductCard.List
              products={[
                testProduct,
                { ...testProduct, id: 2, title: 'Molecule 01', price: 180000 },
              ]}
              onProductClick={(p) => console.log('제품:', p)}
              showNotes
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Loading State</h3>
            <ProductCard.Grid
              products={[]}
              loading
              loadingCount={3}
              columns={3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Modal 테스트 서브컴포넌트
function ModalTest() {
  const basicModal = useModal();
  const alertModal = useModal();
  const nestedParent = useModal();
  const nestedChild = useModal();
  const drawerModal = useModal();
  const imageModal = useModal();

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <Button onClick={basicModal.open}>기본 모달</Button>
        <Button onClick={alertModal.open} variant="danger">Alert 모달</Button>
        <Button onClick={nestedParent.open}>중첩 모달</Button>
        <Button onClick={drawerModal.open}>Drawer 모달</Button>
        <Button onClick={imageModal.open}>이미지 모달</Button>
      </div>

      {/* 기본 모달 */}
      <Modal isOpen={basicModal.isOpen} onClose={basicModal.close} title="기본 모달">
        <Modal.Body>
          <p>이것은 기본 모달입니다.</p>
          <p>ESC 키를 누르거나 백드롭을 클릭하면 닫힙니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={basicModal.close} variant="ghost">취소</Button>
          <Button onClick={basicModal.close}>확인</Button>
        </Modal.Footer>
      </Modal>

      {/* Alert 모달 */}
      <Modal 
        isOpen={alertModal.isOpen} 
        onClose={alertModal.close} 
        size="sm" 
        type="alert"
      >
        <Modal.Header>
          <Modal.Title>정말 삭제하시겠습니까?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>이 작업은 되돌릴 수 없습니다.</p>
        </Modal.Body>
        <Modal.Footer align="center">
          <Button onClick={alertModal.close} variant="ghost">취소</Button>
          <Button onClick={alertModal.close} variant="danger">삭제</Button>
        </Modal.Footer>
      </Modal>

      {/* 중첩 모달 */}
      <Modal isOpen={nestedParent.isOpen} onClose={nestedParent.close} title="부모 모달">
        <Modal.Body>
          <p>이것은 부모 모달입니다.</p>
          <Button onClick={nestedChild.open} size="sm">자식 모달 열기</Button>
        </Modal.Body>
      </Modal>

      <Modal 
        isOpen={nestedChild.isOpen} 
        onClose={nestedChild.close} 
        title="자식 모달"
        nested
        size="sm"
      >
        <Modal.Body>
          <p>이것은 중첩된 자식 모달입니다.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={nestedChild.close} size="sm">닫기</Button>
        </Modal.Footer>
      </Modal>

      {/* Drawer 모달 */}
      <Modal 
        isOpen={drawerModal.isOpen} 
        onClose={drawerModal.close} 
        position="left"
        title="메뉴"
      >
        <Modal.Body>
          <nav className="space-y-2">
            <a href="#" className="block py-2">홈</a>
            <a href="#" className="block py-2">제품</a>
            <a href="#" className="block py-2">매거진</a>
            <a href="#" className="block py-2">브랜드</a>
          </nav>
        </Modal.Body>
      </Modal>

      {/* 이미지 모달 */}
      <Modal 
        isOpen={imageModal.isOpen} 
        onClose={imageModal.close}
        type="image"
        size="xl"
      >
        <Modal.Body noPadding>
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            <span className="text-2xl">이미지 영역</span>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

// Form 테스트 서브컴포넌트
function FormTest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    category: '',
    agree: false,
    option: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [singleImage, setSingleImage] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      {/* 기본 폼 */}
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Form</h3>
        <Form onSubmit={(e) => { e.preventDefault(); console.log('제출:', formData); }} className="max-w-md">
          <Form.Group>
            <Form.Label htmlFor="name" required>이름</Form.Label>
            <Form.Input 
              id="name" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="이름을 입력하세요"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">이메일</Form.Label>
            <Form.Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
            <Form.Help>이메일 형식으로 입력해주세요.</Form.Help>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="description">설명</Form.Label>
            <Form.Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="설명을 입력하세요"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="category">카테고리</Form.Label>
            <Form.Select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">선택하세요</option>
              <option value="perfume">향수</option>
              <option value="cosmetic">화장품</option>
              <option value="other">기타</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Checkbox
              id="agree"
              checked={formData.agree}
              onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
              label="약관에 동의합니다"
            />
          </Form.Group>

          <Form.Actions align="end">
            <Button type="button" variant="ghost">취소</Button>
            <Button type="submit">제출</Button>
          </Form.Actions>
        </Form>
      </div>

      {/* 크기 변형 */}
      <div>
        <h3 className="text-lg font-medium mb-2">Size Variants</h3>
        <div className="space-y-3 max-w-md">
          <Form.Input fieldSize="sm" placeholder="Small Input" />
          <Form.Input fieldSize="md" placeholder="Medium Input" />
          <Form.Input fieldSize="lg" placeholder="Large Input" />
        </div>
      </div>

      {/* 에러 상태 */}
      <div>
        <h3 className="text-lg font-medium mb-2">Error States</h3>
        <div className="max-w-md">
          <Form.Group>
            <Form.Label htmlFor="error-input">에러 필드</Form.Label>
            <Form.Input id="error-input" error placeholder="에러 상태" />
            <Form.Error>이 필드는 필수입니다.</Form.Error>
          </Form.Group>
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div>
        <h3 className="text-lg font-medium mb-2">Image Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.ImageUpload
            label="다중 이미지 업로드"
            value={images}
            onChange={setImages}
            maxImages={3}
          />
          
          <Form.ImageUpload
            label="단일 이미지 업로드"
            value={singleImage}
            onChange={setSingleImage}
            single
          />
        </div>
      </div>

      {/* 로딩 상태 */}
      <div>
        <h3 className="text-lg font-medium mb-2">Loading States</h3>
        <div className="flex gap-4 flex-wrap">
          <Form.Loading variant="spinner" size="sm" />
          <Form.Loading variant="spinner" size="md" />
          <Form.Loading variant="spinner" size="lg" message="로딩 중..." />
          <Form.Loading variant="dots" size="md" />
        </div>
      </div>
    </div>
  );
}