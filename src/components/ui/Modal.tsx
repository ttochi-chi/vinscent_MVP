/**
 * Modal 컴포넌트
 * 
 * 🔧 주요 기능:
 * - 다양한 크기 (sm, md, lg, xl, full)
 * - 다양한 위치 (center, top, right, bottom, left)
 * - 애니메이션 효과
 * - 접근성 지원
 * - 키보드 제어 (ESC로 닫기)
 * 
 * 사용처: 팝업, 다이얼로그, 알림, 서랍(Drawer)
 */

import React, { useEffect, useRef, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Modal Props 타입 정의
interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** 모달 위치 */
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  /** 모달 타입 */
  type?: 'default' | 'alert' | 'image';
  /** 백드롭 클릭으로 닫기 허용 */
  closeOnBackdrop?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEsc?: boolean;
  /** 닫기 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 애니메이션 비활성화 */
  disableAnimation?: boolean;
  /** 모달 제목 */
  title?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 모달 내용 */
  children?: React.ReactNode;
}

/**
 * Modal 컴포넌트
 * 
 * @example
 * // 기본 모달
 * <Modal isOpen={isOpen} onClose={handleClose} title="모달 제목">
 *   <Modal.Body>모달 내용</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>닫기</Button>
 *   </Modal.Footer>
 * </Modal>
 * 
 * @example
 * // Alert 모달
 * <Modal isOpen={isOpen} onClose={handleClose} size="sm" type="alert">
 *   <Modal.Header>경고</Modal.Header>
 *   <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
 *   <Modal.Footer align="center">
 *     <Button variant="ghost">취소</Button>
 *     <Button variant="danger">삭제</Button>
 *   </Modal.Footer>
 * </Modal>
 */
const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  size = 'md',
  position = 'center',
  type = 'default',
  closeOnBackdrop = true,
  closeOnEsc = true,
  hideCloseButton = false,
  disableAnimation = false,
  title,
  className = '',
  children,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  // ESC 키 핸들러
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스 저장
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // 모달로 포커스 이동
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    } else {
      // 이전 포커스로 복원
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // 바디 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 백드롭 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 닫기 애니메이션 처리
  const handleClose = () => {
    if (!disableAnimation) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 250);
    } else {
      onClose();
    }
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen && !isClosing) return null;

  // 클래스명 조합
  const modalClasses = [
    'modal',
    `modal--size-${size}`,
    `modal--position-${position}`,
    type !== 'default' && `modal--${type}`,
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
                <X size={20} />
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
            <X size={20} />
          </button>
        )}
        
        {children}
      </div>
    </div>
  );

  // Portal을 사용하여 body에 렌더링
  return createPortal(modalElement, document.body);
};

// Modal Header 컴포넌트
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

// Modal Title 컴포넌트  
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

// Modal Body 컴포넌트
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

// Modal Footer 컴포넌트
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

// 서브 컴포넌트 연결
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

// useModal Hook
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

// 추가 export
export { ModalTitle };
export default Modal;