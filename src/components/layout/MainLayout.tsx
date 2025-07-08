import React from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Footer, FooterProps } from './Footer';


export interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
  minimalFooter?: boolean;
  headerProps?: Omit<React.ComponentProps<typeof Header>, 'className'>;
  footerProps?: Omit<FooterProps, 'className'>;
  title?: string;
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
    <div className={`main-layout min-h-screen flex flex-col ${className}`}>
      {/*HTML Head 메타데이터 (실제로는 Next.js의 Head 컴포넌트 사용) */}
      {title && (
        <title>{title} | Vinscent</title>
      )}
      {description && (
        <meta name="description" content={description} />
      )}

      {/*헤더 */}
      {!hideHeader && (
        <Header 
          {...headerProps}
          className="flex-shrink-0"
        />
      )}

      {/*메인 콘텐츠 */}
      <main className="main-layout__content flex-1">
        {children}
      </main>

      {/*푸터 */}
      {!hideFooter && (
        <Footer
          {...footerProps}
          minimal={minimalFooter}
          className="flex-shrink-0"
        />
      )}
    </div>
  );
};


export default MainLayout;