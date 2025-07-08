import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';

//TypeScript 인터페이스 정의
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
  hideCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
}

//Modal 컴포넌트
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  disableBackdropClose = false,
  disableEscapeClose = false,
  hideCloseButton = false,
  className = '',
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  //모달 크기 클래스 매핑
  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'max-w-md',
      md: 'max-w-lg', 
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-7xl mx-4',
    };
    return sizeMap[size];
  };

  //ESC 키 처리
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscapeClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, disableEscapeClose]);

  //포커스 관리
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // 모달에 포커스
      setTimeout(() => {
        const focusableElement = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        focusableElement?.focus();
      }, 100);
    } else {
      // 모달 닫힐 때 이전 포커스 복원
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  //body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  //백드롭 클릭 처리
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !disableBackdropClose) {
      onClose();
    }
  };

  //모달이 닫혀있으면 렌더링 안함
  if (!isOpen) return null;

  //Portal을 사용한 모달 렌더링
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`
          bg-white rounded-lg shadow-xl transform transition-all duration-200 ease-out
          w-full ${getSizeClasses()} max-h-[90vh] overflow-hidden
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/*모달 헤더 */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                rightIcon={X}
                onClick={onClose}
                aria-label="모달 닫기"
                className="ml-auto"
              />
            )}
          </div>
        )}

        {/*모달 콘텐츠 */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

//Modal 하위 컴포넌트들
export const ModalContent: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const ModalFooter: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end space-x-2 p-6 border-t border-gray-200 bg-gray-50 ${className}`}>
    {children}
  </div>
);

//확인 다이얼로그 컴포넌트
export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const getConfirmButtonVariant = () => {
    return variant === 'danger' ? 'secondary' : 'primary';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      hideCloseButton={false}
    >
      <ModalContent>
        <div className="text-center">
          <div className={`mx-auto mb-4 text-4xl ${getVariantClasses()}`}>
            {variant === 'danger'}
            {variant === 'warning'}
            {variant === 'info'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          variant={getConfirmButtonVariant()}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Modal;