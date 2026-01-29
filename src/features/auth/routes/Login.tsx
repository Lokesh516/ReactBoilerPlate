import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { EiInput, EiButton, EiAlert } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';

const validationSchema = (t: (key: string) => string) => Yup.object({
    email: Yup.string().email(t('validation.emailInvalid')).required(t('validation.required')),
    password: Yup.string().min(6, t('validation.passwordMin')).required(t('validation.required')),
});

const Login: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema(t),
        onSubmit: async (values) => {
            dispatch(loginStart());
            try {
                // Mock API call
                setTimeout(() => {
                    const mockUser = {
                        id: '1',
                        email: values.email,
                        firstName: 'Demo',
                        lastName: 'User',
                        role: 'admin' as const,
                    };
                    dispatch(loginSuccess({ user: mockUser, token: 'mock-jwt-token' }));
                    // Use replace to prevent back navigation to login
                    navigate('/', { replace: true });
                }, 1000);
            } catch (err) {
                dispatch(loginFailure(t('messages.invalidCredentials')));
            }
        },
    });

    return (
        <AuthLayout title={t('login.title')}>
            {error && (
                <EiAlert severity="error" className="mb-4">
                    {error}
                </EiAlert>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <EiInput
                    fullWidth
                    id="email"
                    name="email"
                    label={t('login.email')}
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email : undefined}
                    startAdornment={<Mail className="w-5 h-5" />}
                />

                <EiInput
                    fullWidth
                    id="password"
                    name="password"
                    label={t('login.password')}
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : undefined}
                    startAdornment={<Lock className="w-5 h-5" />}
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('login.rememberMe')}</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        {t('login.forgotPassword')}
                    </Link>
                </div>

                <EiButton
                    fullWidth
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    size="lg"
                    className="mt-6"
                >
                    <span className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${location.pathname === '/'
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}>{t('login.submit')}</span>
                </EiButton>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('login.noAccount')}{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        {t('login.register')}
                    </Link>
                </p>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                    <strong>Demo:</strong> Use any email and password (min 6 chars)
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
