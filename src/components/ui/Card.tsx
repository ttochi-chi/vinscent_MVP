import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>
{
    clickable?: boolean;
    noHover?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    role?: string;
    'aria-label' ?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            clickable = false,
            noHover = false,
            className = '',
            children,
            onClick,
            role,
            tabIndex,
            'aria-label': ariaLabel,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const getCardClasses =() => {
            const baseClasses = ['card-base'];
            if(noHover) baseClasses.push('hover:transform-none hover:shadow-sm');
            if(clickable) baseClasses.push('cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2');
            if(className) baseClasses.push(className);

            return baseClasses.join(' ');
        };

        const handelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
            if(clickable && onClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                onClick(event as any);
            }
            onKeyDown?.(event);
        };

        const accessibilityProps = {
            role: clickable ? (role || 'button') : role,
            tabIndex: clickable ? (tabIndex ?? 0) : tabIndex,
            'aria-label': ariaLabel,
        };

        return (
            <div
                ref={ref}
                className={getCardClasses()}
                onClick={clickable ? onClick: undefined}
                onKeyDown={handelKeyDown}
                {...accessibilityProps}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className = '', children, ...props }, ref) => (
        <div
            ref={ref}
            className={`p-4 border-b border-gray-100 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({className = '', children, ...props}, ref) => (
        <div
            ref={ref}
            className={`p-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({className ='', children, ...props}, ref) => (
        <div
            ref={ref}
            className={`p-4 border-t border-gray-100 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
);
CardFooter.displayName = 'CardFooter';

export default Card;