import React from 'react';
import Link from 'next/link';

export interface FooterProps {
  className?: string;
  minimal?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  minimal = false,
}) => {
  const currentYear = new Date().getFullYear();

  // 푸터 링크 그룹
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
      <footer className={`footer--minimal ${className}`}>
        <div className="footer__container footer__container--minimal">
          <p className="footer__copyright-text"/>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`footer ${className}`}>
      <div className="footer__container">
        {/* 메인 푸터 콘텐츠 */}
        <div className="footer__grid">
          {/* 브랜드 섹션 */}
          <div className="footer__brand-section">
            <Link 
              href="/"
              className="footer__logo-link"
              >
              <span>Vinscent</span>
            </Link>
            <p className="footer__description">
              브랜드가 직접 운영하는 향수/뷰티 매거진 플랫폼. 
              진정한 브랜드 스토리와 제품을 만나보세요.
            </p>
            <div className="footer__social-links">
              {footerLinks.social.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="footer__social-link"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 제품 링크 */}
          <div>
            <h3 className="footer__heading">제품</h3>
            <ul className="footer__list">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer__link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="footer__heading">회사</h3>
            <ul className="footer__list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer__link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="footer__heading">지원</h3>
            <ul className="footer__list">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="footer__link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright-text"/>
            <p className="footer__tagline">
              Made with Like for fragrance lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;