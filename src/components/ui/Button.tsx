import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    iconOnly?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            loading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            iconOnly = false,
            className = '',
            disabled,
            children,
            type = 'button',
            onClick,
            ...props
        },
        ref
    ) => {

        /*CSS 클래스 조합 로직*/
        const getButtonClasses  = () => {
            const baseClasses = ['btn-base'];
            baseClasses.push(`btn-${variant}`);
            baseClasses.push(`btn-${size}`);
            if(fullWidth)
            {
                baseClasses.push('btn-full');
            }
            if(disabled && !loading)
            {
                baseClasses.push('btn--disabled');
            }
            if(className)
            {
                baseClasses.push(className);
            }

            return baseClasses.join(' ');
        };

        /*클릭 핸들러*/
        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if(loading || disabled)
            {
                event.preventDefault();
                return;
            }
            onClick?.(event);
        };

        /*키보드 핸들러*/
        const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if(event.key === 'Enter' || event.key === ' ')
            {
                if(loading || disabled)
                {
                    event.preventDefault();
                    return;
                }
            }
            props.onKeyDown?.(event);
        };

        /*ARIA 속성 설정*/
        const ariaProps = {
            'aria-disabled' : disabled || loading,
            'aria-busy' : loading,
            'aria-label' : iconOnly ? (props['aria-label'] || String(children)) : props['aria-label'],
        };

        return(
            <button
                ref={ref}
                type={type}
                className={getButtonClasses()}
                disabled={disabled||loading}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                {...ariaProps}
                {...props}
            >
                {/* 왼쪽 아이콘 */}
                {LeftIcon && !loading && (
                    <LeftIcon
                        size={size==='sm' ? 14 : size === 'lg' ? 20 : 16}
                        aria-hidden = "true"
                    />
                )}

                {/* 오른쪽 아이콘 */}
                {RightIcon && !loading && !iconOnly && (
                    <RightIcon
                        size={size==='sm' ? 14 : size === 'lg' ? 20 : 16}
                        aria-hidden = "true"
                    />
                )}

                {/* 아이콘 버튼 */}
                {iconOnly && RightIcon && !loading && (
                <RightIcon 
                    size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
                    aria-hidden="true"
                />
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;