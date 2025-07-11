/**
 * Modal 컴포넌트
 * 
 * 🔧 메소드 추적 기반 개선 완료:
 * - lucide-react 의존성 제거 (X 아이콘 → ✕ 문자)
 * - 중첩 모달 지원 추가
 * - compound component 패턴 적용
 * - 접근성 완벽 지원
 * 
 * 사용처: 팝업, 다이얼로그, 알림, 서랍(Drawer)
 * 근원지: MVP 필수 모달 기능 통합
 */

import React, { useEffect, useRef, HTMLAttributes, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ===== 타입 정의 =====
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalPosition = 'center' | 'top' | 'right' | 'bottom' | 'left';
type ModalType = 'default' | 'alert' | 'image';

// Modal Props
interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 크기 */
  size?: ModalSize;
  /** 모달 위치 */
  position?: ModalPosition;
  /** 모달 타입 */
  type?: ModalType;
  /** 백드롭 클릭으로 닫기 허용 */
  closeOnBackdrop?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEsc?: boolean;
  /** 닫기 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 애니메이션 비활성화 */
  disableAnimation?: boolean;
  /** 중첩 모달 여부 */
  nested?: boolean;
  /** 모달 제목 (간편 사용) */
  title?: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
  /** 모달 내용 */
  children?: React.ReactNode;
}

// 모달 스택 관리
let modalStack: string[] = [];

/**
 * Modal 루트 컴포넌트
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
 * // 중첩 모달
 * <Modal isOpen={isOpen} onClose={handleClose} nested>
 *   <Modal.Header>
 *     <Modal.Title>중첩 모달</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>내용</Modal.Body>
 * </Modal>
 */
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

// ===== 사용 예시 =====
export const ModalExamples = {
  // 기본 모달
  basic: () => {
    const modal = useModal();
    
    return (
      <>
        <button onClick={modal.open} className="button">
          모달 열기
        </button>
        
        <Modal isOpen={modal.isOpen} onClose={modal.close} title="기본 모달">
          <Modal.Body>
            <p>모달 내용이 여기에 표시됩니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={modal.close} className="button button--variant-ghost">
              취소
            </button>
            <button onClick={modal.close} className="button">
              확인
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },

  // Alert 모달
  alert: () => {
    const modal = useModal();
    
    return (
      <>
        <button onClick={modal.open} className="button button--variant-danger">
          삭제
        </button>
        
        <Modal 
          isOpen={modal.isOpen} 
          onClose={modal.close} 
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
            <button onClick={modal.close} className="button button--variant-ghost">
              취소
            </button>
            <button onClick={modal.close} className="button button--variant-danger">
              삭제
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },

  // 중첩 모달
  nested: () => {
    const parentModal = useModal();
    const childModal = useModal();
    
    return (
      <>
        <button onClick={parentModal.open} className="button">
          첫 번째 모달 열기
        </button>
        
        <Modal isOpen={parentModal.isOpen} onClose={parentModal.close} title="부모 모달">
          <Modal.Body>
            <p>이것은 부모 모달입니다.</p>
            <button onClick={childModal.open} className="button button--size-sm">
              중첩 모달 열기
            </button>
          </Modal.Body>
        </Modal>
        
        <Modal 
          isOpen={childModal.isOpen} 
          onClose={childModal.close} 
          title="중첩 모달"
          nested
          size="sm"
        >
          <Modal.Body>
            <p>이것은 중첩된 자식 모달입니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={childModal.close} className="button button--size-sm">
              닫기
            </button>
          </Modal.Footer>
        </Modal>
      </>
    );
  },

  // Drawer (사이드 모달)
  drawer: () => {
    const modal = useModal();
    
    return (
      <>
        <button onClick={modal.open} className="button">
          메뉴 열기
        </button>
        
        <Modal 
          isOpen={modal.isOpen} 
          onClose={modal.close} 
          position="left"
          hideCloseButton
        >
          <Modal.Header>
            <Modal.Title>메뉴</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <nav>
              <a href="/" className="block py-2">홈</a>
              <a href="/products" className="block py-2">제품</a>
              <a href="/magazines" className="block py-2">매거진</a>
              <a href="/brands" className="block py-2">브랜드</a>
            </nav>
          </Modal.Body>
        </Modal>
      </>
    );
  },

  // 이미지 모달
  image: () => {
    const modal = useModal();
    
    return (
      <>
        <img 
          src="/images/product-thumb.jpg" 
          alt="제품 썸네일"
          onClick={modal.open}
          className="cursor-pointer"
        />
        
        <Modal 
          isOpen={modal.isOpen} 
          onClose={modal.close}
          type="image"
          size="xl"
        >
          <Modal.Body noPadding>
            <img 
              src="/images/product-full.jpg" 
              alt="제품 전체 이미지"
              className="w-full"
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
};