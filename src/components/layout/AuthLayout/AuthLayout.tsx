import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950 p-4 animate-fade-in">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Auth Card */}
            <div className="relative w-full max-w-md">
                <div className="glass-strong rounded-2xl shadow-strong p-8 animate-scale-in">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-glow">
                            <span className="text-light font-bold text-3xl">Ei</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center gradient-text mb-2">
                        Enhancesys Innovation
                    </h1>

                    {title && (
                        <p className="text-center text-primary-600 dark:text-primary-400 mb-8 font-medium">
                            {title}
                        </p>
                    )}

                    {/* Content */}
                    <div className="mt-6">
                        {children}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse-soft" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
};
