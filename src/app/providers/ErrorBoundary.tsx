import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { EiButton } from '@/components/ui';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // Here you would typically log the error to an external service like Sentry
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-950/30">
                                <AlertTriangle className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Something went wrong
                        </h1>

                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            An unexpected error has occurred. Please try refreshing the page or return to safety.
                        </p>

                        <EiButton
                            variant="primary"
                            size="lg"
                            onClick={this.handleReset}
                            className="w-full sm:w-auto"
                        >
                            Back to Safety
                        </EiButton>

                        {import.meta.env.MODE === 'development' && (
                            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
                                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto">
                                    {this.state.error?.toString()}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
