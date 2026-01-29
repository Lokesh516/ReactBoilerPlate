import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import type { EiInputProps } from './EiInput.types';

export const EiInput: React.FC<EiInputProps> = ({
    label,
    error,
    helperText,
    startAdornment,
    endAdornment,
    type = 'text',
    className,
    fullWidth = false,
    disabled = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const inputType = type === 'password' && showPassword ? 'text' : type;
    const isPassword = type === 'password';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(!!e.target.value);
        props.onChange?.(e);
    };

    return (
        <div className={twMerge(clsx('relative', fullWidth && 'w-full', className))}>
            <div className="relative">
                {/* Input Field */}
                <input
                    type={inputType}
                    className={clsx(
                        'peer w-full rounded-lg border-2 transition-all duration-200',
                        'bg-white dark:bg-gray-800 theme-emerald:bg-white theme-emerald:dark:bg-emerald-900',
                        'text-gray-900 dark:text-gray-100 theme-emerald:text-emerald-900 theme-emerald:dark:text-emerald-100',
                        'px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'disabled:bg-gray-100 dark:disabled:bg-gray-900 theme-emerald:disabled:bg-emerald-50',
                        startAdornment ? 'pl-12' : 'pl-4',
                        endAdornment || isPassword ? 'pr-12' : 'pr-4',
                        label ? 'pt-6 pb-2' : 'py-3',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 theme-emerald:border-emerald-300 theme-emerald:dark:border-emerald-700 focus:border-primary-500',
                    )}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={handleChange}
                    {...props}
                />

                {/* Floating Label */}
                {label && (
                    <label
                        className={clsx(
                            'absolute left-4 transition-all duration-200 pointer-events-none',
                            startAdornment && 'left-12',
                            isFocused || hasValue
                                ? 'top-1.5 text-xs font-medium'
                                : 'top-1/2 -translate-y-1/2 text-base',
                            error
                                ? 'text-red-500'
                                : isFocused
                                    ? 'text-primary-600 dark:text-primary-400 theme-emerald:text-emerald-600'
                                    : 'text-gray-500 dark:text-gray-400 theme-emerald:text-emerald-600 theme-emerald:dark:text-emerald-400'
                        )}
                    >
                        {label}
                    </label>
                )}

                {/* Start Adornment */}
                {startAdornment && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 theme-emerald:text-emerald-500">
                        {startAdornment}
                    </div>
                )}

                {/* End Adornment or Password Toggle */}
                {(endAdornment || isPassword) && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {isPassword ? (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 theme-emerald:text-emerald-500 theme-emerald:hover:text-emerald-700 transition-colors focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 theme-emerald:text-emerald-500">{endAdornment}</div>
                        )}
                    </div>
                )}
            </div>

            {/* Helper Text or Error Message */}
            {(helperText || error) && (
                <p
                    className={clsx(
                        'mt-1.5 text-sm',
                        error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400 theme-emerald:text-emerald-600 theme-emerald:dark:text-emerald-400'
                    )}
                >
                    {error ? helperText : helperText}
                </p>
            )}
        </div>
    );
};
