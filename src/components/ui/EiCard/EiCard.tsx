import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface EiCardProps {
    title?: React.ReactNode;
    subheader?: React.ReactNode;
    action?: React.ReactNode;
    footer?: React.ReactNode;
    noPadding?: boolean;
    glass?: boolean;
    hover?: boolean;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const EiCard: React.FC<EiCardProps> = ({
    children,
    title,
    subheader,
    action,
    footer,
    noPadding = false,
    glass = false,
    hover = false,
    className,
    style,
}) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'rounded-xl border transition-all duration-300',
                    glass
                        ? 'glass border-white/20 dark:border-gray-700/50 theme-emerald:border-emerald-200/50'
                        : 'bg-white dark:bg-gray-800 theme-emerald:bg-emerald-50 theme-emerald:dark:bg-emerald-900 border-gray-200 dark:border-gray-700 theme-emerald:border-emerald-200 theme-emerald:dark:border-emerald-700 shadow-soft',
                    hover && 'hover:shadow-medium hover:-translate-y-1 cursor-pointer',
                    className
                )
            )}
            style={style}
        >
            {/* Header */}
            {(title || subheader || action) && (
                <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 theme-emerald:border-emerald-200 theme-emerald:dark:border-emerald-700">
                    <div className="flex-1">
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 theme-emerald:text-emerald-900 theme-emerald:dark:text-emerald-100">
                                {title}
                            </h3>
                        )}
                        {subheader && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 theme-emerald:text-emerald-600 theme-emerald:dark:text-emerald-300">
                                {subheader}
                            </p>
                        )}
                    </div>
                    {action && <div className="ml-4">{action}</div>}
                </div>
            )}

            {/* Content */}
            <div className={clsx(noPadding ? 'p-0' : 'p-6')}>
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 theme-emerald:border-emerald-200 theme-emerald:dark:border-emerald-700 bg-gray-50 dark:bg-gray-900/50 theme-emerald:bg-emerald-100/50 theme-emerald:dark:bg-emerald-800/50 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};
