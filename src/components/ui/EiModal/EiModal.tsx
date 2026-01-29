import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export interface EiModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
};

export const EiModal: React.FC<EiModalProps> = ({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    className,
}) => {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal Container */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={twMerge(
                                    clsx(
                                        'w-full transform overflow-hidden rounded-2xl shadow-strong transition-all',
                                        'bg-white dark:bg-gray-800 theme-emerald:bg-emerald-50 theme-emerald:dark:bg-emerald-900',
                                        sizeStyles[size],
                                        className
                                    )
                                )}
                            >
                                {/* Header */}
                                {title && (
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 theme-emerald:border-emerald-200 theme-emerald:dark:border-emerald-700">
                                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100 theme-emerald:text-emerald-900 theme-emerald:dark:text-emerald-100">
                                            {title}
                                        </Dialog.Title>
                                        <button
                                            onClick={onClose}
                                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 theme-emerald:text-emerald-500 theme-emerald:hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-gray-700 theme-emerald:hover:bg-emerald-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="px-6 py-4 text-gray-900 dark:text-gray-100 theme-emerald:text-emerald-900 theme-emerald:dark:text-emerald-100">
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 theme-emerald:border-emerald-200 theme-emerald:dark:border-emerald-700 bg-gray-50 dark:bg-gray-900/50 theme-emerald:bg-emerald-100/50 theme-emerald:dark:bg-emerald-800/50">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
