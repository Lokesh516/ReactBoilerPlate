import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface EiSkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    className?: string;
    animation?: 'pulse' | 'wave' | 'none';
}

export const EiSkeleton: React.FC<EiSkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className,
    animation = 'wave',
}) => {
    const baseStyles = 'bg-gray-200 dark:bg-gray-700';

    const variantStyles = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    const animationStyles = {
        pulse: 'animate-pulse-soft',
        wave: 'shimmer',
        none: '',
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={twMerge(
                clsx(
                    baseStyles,
                    variantStyles[variant],
                    animationStyles[animation],
                    className
                )
            )}
            style={style}
        />
    );
};

// Preset skeleton components for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
    lines = 3,
    className,
}) => (
    <div className={clsx('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
            <EiSkeleton
                key={i}
                variant="text"
                width={i === lines - 1 ? '80%' : '100%'}
            />
        ))}
    </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={twMerge(clsx('p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700', className))}>
        <div className="flex items-center gap-4 mb-4">
            <EiSkeleton variant="circular" width={48} height={48} />
            <div className="flex-1">
                <EiSkeleton variant="text" width="60%" className="mb-2" />
                <EiSkeleton variant="text" width="40%" />
            </div>
        </div>
        <SkeletonText lines={3} />
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
    rows = 5,
    className,
}) => (
    <div className={twMerge(clsx('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden', className))}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <EiSkeleton variant="text" width="30%" />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                    <EiSkeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <EiSkeleton variant="text" width="40%" />
                        <EiSkeleton variant="text" width="60%" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
