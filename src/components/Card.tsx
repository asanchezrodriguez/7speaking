import React from 'react';
import { cn } from '../lib/utils/cn';

interface CardProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    onClick,
    className,
    selected = false
}) => {
    const isClickable = !!onClick;

    return (
        <div
            onClick={onClick}
            className={cn(
                'glass-effect rounded-xl p-6 transition-all duration-300',
                isClickable && 'cursor-pointer hover:bg-white/10 hover:border-intelixs-blue-500/50',
                selected && 'border-intelixs-blue-500 bg-intelixs-blue-500/10',
                className
            )}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            {children}
        </div>
    );
};
