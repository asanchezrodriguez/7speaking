import React from 'react';
import { cn } from '../lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className,
    ...props
}) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-intelixs-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-intelixs-blue-600 hover:bg-intelixs-blue-700 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
        ghost: 'text-neutral-400 hover:text-white hover:bg-white/5',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};
