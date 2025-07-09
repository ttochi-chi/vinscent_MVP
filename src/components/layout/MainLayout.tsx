'use client';

import React from 'react';
import Header from './Header';
import Footer, { FooterProps } from './Footer';

export interface MainLayoutProps {
  /** 페이지 콘텐츠 */
  children: React.ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 헤더 숨김 */
  hideHeader?: boolean;
  /** 푸터 숨김 */
  hideFooter?: boolean;
  /** 푸터 간단 모드 */
  minimalFooter?: boolean;
  /** 헤더 props */
  headerProps?: Omit<React.ComponentProps<typeof Header>, 'className'>;
  /** 푸터 props */
  footerProps?: Omit<FooterProps, 'className'>;
  /** 페이지 제목 (SEO) */
  title?: string;
  /** 페이지 설명 (SEO) */
  description?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = '',
  hideHeader = false,
  hideFooter = false,
  minimalFooter = false,
  headerProps,
  footerProps,
  title,
  description,
}) => {
  return (
    <div className={`main-layout main-layout--full-height ${className}`}>
      {/* 🔧 HTML Head 메타데이터 (실제로는 Next.js의 Head 컴포넌트 사용) */}
      {title && (
        <title>{title} | Vinscent</title>
      )}
      {description && (
        <meta name="description" content={description} />
      )}

      {/* 🔧 헤더 */}
      {!hideHeader && (
        <Header 
          {...headerProps}
        />
      )}

      {/* 🔧 메인 콘텐츠 */}
      <main className="main-layout__content">
        {children}
      </main>

      {/* 🔧 푸터 */}
      {!hideFooter && (
        <Footer
          {...footerProps}
          minimal={minimalFooter}
        />
      )}
    </div>
  );
};

// 🔧 default export로 변경
export default MainLayout;