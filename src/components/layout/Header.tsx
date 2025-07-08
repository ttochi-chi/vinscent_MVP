import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, User, Settings } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';

// TypeScript 인터페이스 정의
export interface HeaderProps {
  className?: string;
  hideSearch?: boolean;
  hideUserMenu?: boolean;
  logoHref?: string;
}

// 네비게이션 메뉴 타입
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Header 컴포넌트 구현
export const Header: React.FC<HeaderProps> = ({
  className = '',
  hideSearch = false,
  hideUserMenu = false,
  logoHref = '/',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // 메인 네비게이션 메뉴
  const mainNavItems: NavItem[] = [
    { label: '매거진', href: '/magazines' },
    { label: '제품', href: '/products' },
    { label: '브랜드', href: '/brands' },
    { label: '어드민', href: '/admin' },
  ];

  // 활성 링크 확인
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // 모바일 메뉴 토글
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 모바일 메뉴 닫기
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 브랜드명 */}
          <div className="flex items-center">
            <Link 
              href={logoHref}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
              style={{ fontFamily: 'var(--font-family-logo)' }}
            >
              <span>Vinscent</span>
            </Link>
          </div>

          {/* 중앙 검색바 (데스크톱) */}
          {!hideSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <Input
                  search
                  placeholder="브랜드나 제품을 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  hideLabel
                  label="검색"
                />
              </form>
            </div>
          )}

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header__nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveLink(item.href) 
                    ? 'header__nav-link--active bg-gray-100' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 사용자 메뉴 & 모바일 버튼 */}
          <div className="flex items-center space-x-2">
            {/* 사용자 메뉴 (데스크톱) */}
            {!hideUserMenu && (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={User}
                  onClick={() => router.push('/profile')}
                >
                  프로필
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  rightIcon={Settings}
                  aria-label="설정"
                  onClick={() => router.push('/settings')}
                />
              </div>
            )}

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              rightIcon={isMobileMenuOpen ? X : Menu}
              aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              onClick={toggleMobileMenu}
              className="md:hidden"
            />
          </div>
        </div>

        {/* 모바일 검색바 */}
        {!hideSearch && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <Input
                search
                placeholder="브랜드나 제품을 검색하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                hideLabel
                label="검색"
              />
            </form>
          </div>
        )}
      </div>

      {/* 모바일 네비게이션 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* 메인 네비게이션 */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActiveLink(item.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 모바일 사용자 메뉴 */}
            {!hideUserMenu && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  👤 프로필
                </Link>
                <Link
                  href="/settings"
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  ⚙️ 설정
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// 사용 예시 및 패턴 가이드
export const HeaderExamples = {
  // 기본 헤더
  basic: () => <Header />,
  
  // 검색 없는 헤더
  noSearch: () => <Header hideSearch />,
  
  // 사용자 메뉴 없는 헤더 (로그아웃 상태)
  noUserMenu: () => <Header hideUserMenu />,
  
  // 어드민 헤더
  admin: () => (
    <Header 
      className="border-b-2 border-blue-200 bg-blue-50"
      logoHref="/admin"
    />
  ),
  
  // 커스텀 스타일
  custom: () => (
    <Header 
      className="bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg"
    />
  ),
};

export default Header;