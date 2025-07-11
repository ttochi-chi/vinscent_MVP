import React, { useEffect, useRef, HTMLAttributes, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ===== 타입 정의 =====
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';
type ModalType = 'default' | 'alert' | 'image';

// Modal Props
interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  position?: ModalPosition;
  type?: ModalType;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  hideCloseButton?: boolean;
  disableAnimation?: boolean;
  nested?: boolean;
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// 모달 스택 관리
let modalStack: string[] = [];


const ModalRoot: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  position = 'center',
  type = 'default',
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  disableAnimation = false,
  nested = false,
  title,
  className = '',
  children,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalId = useRef(`modal-${Date.now()}`);

  // 클라이언트 사이드 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 모달 스택 관리
  useEffect(() => {
    if (isOpen) {
      modalStack.push(modalId.current);
    } else {
      modalStack = modalStack.filter(id => id !== modalId.current);
    }

    return () => {
      modalStack = modalStack.filter(id => id !== modalId.current);
    };
  }, [isOpen]);

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      // 가장 위의 모달만 닫기
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === modalId.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // 바디 스크롤 방지 (중첩 모달 고려)
  useEffect(() => {
    if (isOpen && modalStack.length === 1) {
      document.body.style.overflow = 'hidden';
    } else if (!isOpen && modalStack.length === 0) {
      document.body.style.overflow = '';
    }

    return () => {
      if (modalStack.length === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // 백드롭 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 닫기 애니메이션 처리
  const handleClose = useCallback(() => {
    if (!disableAnimation) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 250);
    } else {
      onClose();
    }
  }, [disableAnimation, onClose]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen && !isClosing) return null;

  // 서버 사이드 렌더링 방지
  if (!mounted) return null;

  // 클래스명 조합
  const modalClasses = [
    'modal',
    `modal--size-${size}`,
    `modal--position-${position}`,
    type !== 'default' && `modal--${type}`,
    nested && 'modal--nested',
    (isOpen && !isClosing) && 'is-open',
    isClosing && 'is-closing',
    className
  ].filter(Boolean).join(' ');

  // 모달 렌더링
  const modalElement = (
    <div 
      className={modalClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleBackdropClick}
      {...props}
    >
      <div className="modal__backdrop" />
      
      <div 
        ref={modalRef}
        className="modal__content"
        tabIndex={-1}
      >
        {/* 기본 헤더 (title prop 사용 시) */}
        {title && (
          <div className="modal__header">
            <h2 id="modal-title" className="modal__title">{title}</h2>
            {!hideCloseButton && (
              <button
                type="button"
                className="modal__close"
                onClick={handleClose}
                aria-label="모달 닫기"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {/* children에 닫기 버튼이 없는 Header가 있을 경우를 위한 처리 */}
        {!title && !hideCloseButton && (
          <button
            type="button"
            className="modal__close"
            onClick={handleClose}
            aria-label="모달 닫기"
            style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 1 }}
          >
            ✕
          </button>
        )}
        
        {children}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 렌더링
  return createPortal(modalElement, document.body);
};

// ===== Modal Header =====
interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <div className={`modal__header ${className}`} {...props}>
    {children}
  </div>
);

// ===== Modal Title =====
interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const ModalTitle: React.FC<ModalTitleProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <h2 className={`modal__title ${className}`} {...props}>
    {children}
  </h2>
);

// ===== Modal Body =====
interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** 패딩 제거 */
  noPadding?: boolean;
  children?: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ 
  noPadding = false,
  children, 
  className = '', 
  ...props 
}) => (
  <div 
    className={`modal__body ${noPadding ? 'modal__body--no-padding' : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// ===== Modal Footer =====
interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** 정렬 */
  align?: 'start' | 'end' | 'center' | 'between';
  children?: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ 
  align = 'end',
  children, 
  className = '', 
  ...props 
}) => (
  <div 
    className={`modal__footer ${align !== 'end' ? `modal__footer--${align}` : ''} ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// ===== useModal Hook =====
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

// ===== Compound Component 구성 =====
const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;

