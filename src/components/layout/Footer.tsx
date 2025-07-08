import React from 'react';
import Link from 'next/link';
import { Header } from './Header';

// ==================== FOOTER COMPONENT ====================

export interface FooterProps {
  /** 추가 CSS 클래스 */
  className?: string;
  /** 간단 모드 (링크 최소화) */
  minimal?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  minimal = false,
}) => {
  const currentYear = new Date().getFullYear();

  // 🔧 푸터 링크 그룹
  const footerLinks = {
    product: [
      { label: '매거진', href: '/magazines' },
      { label: '제품', href: '/products' },
      { label: '브랜드', href: '/brands' },
    ],
    company: [
      { label: '회사소개', href: '/about' },
      { label: '채용정보', href: '/careers' },
      { label: '보도자료', href: '/press' },
    ],
    support: [
      { label: '고객센터', href: '/support' },
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
    ],
    social: [
      { label: 'Instagram', href: 'https://instagram.com/vinscent' },
      { label: 'YouTube', href: 'https://youtube.com/@vinscent' },
      { label: 'Blog', href: '/blog' },
    ],
  };

  if (minimal) {
    return (
      <footer className={`bg-gray-50 border-t border-gray-200 py-6 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Vinscent. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 🔧 메인 푸터 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* 🔧 브랜드 섹션 */}
          <div className="lg:col-span-2">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'var(--font-family-logo)' }}
            >
              <span className="text-2xl">🌹</span>
              <span>Vinscent</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              브랜드가 직접 운영하는 향수/뷰티 매거진 플랫폼. 
              진정한 브랜드 스토리와 제품을 만나보세요.
            </p>
            <div className="flex space-x-4">
              {footerLinks.social.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 🔧 제품 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">제품</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔧 회사 정보 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">회사</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔧 고객지원 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">지원</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🔧 하단 저작권 */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              © {currentYear} Vinscent. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              Made with ❤️ for fragrance lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;