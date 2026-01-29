import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface EiAlertProps extends React.HTMLAttributes<HTMLDivElement> {
    severity?: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
    title?: string;
}

const severityConfig = {
    success: {
        icon: CheckCircle,
        className: 'bg-green-50 dark:bg-green-950/30 theme-emerald:bg-green-100 theme-emerald:dark:bg-green-900/30 border-green-200 dark:border-green-800 theme-emerald:border-green-300 text-green-800 dark:text-green-200 theme-emerald:text-green-900 theme-emerald:dark:text-green-100',
        iconClassName: 'text-green-500 dark:text-green-400',
    },
    error: {
        icon: AlertCircle,
        className: 'bg-red-50 dark:bg-red-950/30 theme-emerald:bg-red-100 theme-emerald:dark:bg-red-900/30 border-red-200 dark:border-red-800 theme-emerald:border-red-300 text-red-800 dark:text-red-200 theme-emerald:text-red-900 theme-emerald:dark:text-red-100',
        iconClassName: 'text-red-500 dark:text-red-400',
    },
    warning: {
        icon: AlertTriangle,
        className: 'bg-yellow-50 dark:bg-yellow-950/30 theme-emerald:bg-yellow-100 theme-emerald:dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 theme-emerald:border-yellow-300 text-yellow-800 dark:text-yellow-200 theme-emerald:text-yellow-900 theme-emerald:dark:text-yellow-100',
        iconClassName: 'text-yellow-500 dark:text-yellow-400',
    },
    info: {
        icon: Info,
        className: 'bg-blue-50 dark:bg-blue-950/30 theme-emerald:bg-blue-100 theme-emerald:dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 theme-emerald:border-blue-300 text-blue-800 dark:text-blue-200 theme-emerald:text-blue-900 theme-emerald:dark:text-blue-100',
        iconClassName: 'text-blue-500 dark:text-blue-400',
    },
};

export const EiAlert: React.FC<EiAlertProps> = ({
    severity = 'info',
    onClose,
    title,
    children,
    className,
    ...props
}) => {
    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
        <div
            className={twMerge(
                clsx(
                    'flex items-start gap-3 p-4 rounded-lg border animate-slide-down',
                    config.className,
                    className
                )
            )}
            role="alert"
            {...props}
        >
            <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', config.iconClassName)} />

            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="font-semibold mb-1">{title}</h4>
                )}
                <div className="text-sm">{children}</div>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-current"
                    aria-label="Close"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};
