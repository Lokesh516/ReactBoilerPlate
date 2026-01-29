import React from 'react';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface EiLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    overlay?: boolean;
    text?: string;
    className?: string;
}

const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
};

export const EiLoader: React.FC<EiLoaderProps> = ({
    size = 'md',
    overlay = false,
    text,
    className,
}) => {
    const loader = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={twMerge(clsx(sizeStyles[size], 'animate-spin text-primary-600 dark:text-primary-400 theme-emerald:text-emerald-600 theme-emerald:dark:text-emerald-400', className))} />
            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400 theme-emerald:text-emerald-700 theme-emerald:dark:text-emerald-300 animate-pulse-soft">
                    {text}
                </p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 theme-emerald:bg-emerald-50/80 theme-emerald:dark:bg-emerald-950/80 backdrop-blur-sm">
                {loader}
            </div>
        );
    }

    return loader;
};
