import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  className?: string;
  logoHref?: string;
  hideSearch?: boolean;
  hideUserMenu?: boolean;
  sticky?: boolean;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  className = '',
  logoHref = '/',
  hideSearch = false,
  hideUserMenu = false,
  sticky = false,
  transparent = false
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 열기/닫기
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 네비게이션 아이템
  const navItems = [
    { href: '/', label: '홈' },
    { href: '/products', label: '제품' },
    { href: '/magazines', label: '매거진' },
    { href: '/brands', label: '브랜드' },
  ];

  // 헤더 클래스 조합
  const headerClasses = [
    'header',
    sticky && 'header--sticky',
    transparent && 'header--transparent',
    isScrolled && 'is-scrolled',
    className
  ].filter(Boolean).join(' ');

  // 모바일 메뉴 클래스
  const mobileMenuClasses = [
    'header__mobile-menu',
    isMobileMenuOpen && 'is-open'
  ].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <div className="header__container">
        {/* 로고 */}
        <Link href={logoHref} className="header__logo">
          Vinscent
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="header__nav-item">
                <Link
                  href={item.href}
                  className={`header__nav-link ${
                    pathname === item.href ? 'header__nav-link--active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 검색바 */}
        {!hideSearch && (
          <div className="header__search">
            <div className="header__search-form">
              <input
                type="search"
                placeholder="검색어를 입력하세요"
                className="header__search-input"
                aria-label="검색"
              />
              <button 
                type="button" 
                className="header__search-button"
                aria-label="검색 실행"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="header__actions">
          {/* 사용자 메뉴 */}
          {!hideUserMenu && (
            <div className="header__user-menu">
              <button
                className="header__user-button"
                aria-label="사용자 메뉴"
              >
                <User size={20} />
              </button>
            </div>
          )}

          {/* 모바일 메뉴 버튼 */}
          <button
            className="header__mobile-button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={mobileMenuClasses}>
        <div className="header__mobile-content">
          {/* 모바일 검색 */}
          {!hideSearch && (
            <div className="header__mobile-search">
              <div className="header__search-form">
                <input
                  type="search"
                  placeholder="검색어를 입력하세요"
                  className="header__search-input"
                  aria-label="검색"
                />
                <button 
                  type="button" 
                  className="header__search-button"
                  aria-label="검색 실행"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          )}

          {/* 모바일 네비게이션 */}
          <ul className="header__mobile-nav">
            {navItems.map((item) => (
              <li key={item.href} className="header__mobile-nav-item">
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`header__mobile-nav-link ${
                    pathname === item.href ? 'header__mobile-nav-link--active' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 모바일 사용자 메뉴 */}
          {!hideUserMenu && (
            <div className="header__mobile-user-menu">
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="header__mobile-user-link"
              >
                👤 프로필
              </Link>
              <Link
                href="/settings"
                onClick={closeMobileMenu}
                className="header__mobile-user-link"
              >
                ⚙️ 설정
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;