import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/components/layout/AuthLayout/AuthLayout';
import { EiInput, EiButton } from '@/components/ui';

const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
});

const Register: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async () => {
            setIsLoading(true);
            try {
                // Mock Registration
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/login');
                }, 1500);
            } catch (err) {
                setIsLoading(false);
            }
        },
    });

    return (
        <AuthLayout title={t('register.title')}>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <EiInput
                    fullWidth
                    id="name"
                    name="name"
                    label={t('register.name')}
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name ? formik.errors.name : undefined}
                    startAdornment={<UserIcon className="w-5 h-5" />}
                />

                <EiInput
                    fullWidth
                    id="email"
                    name="email"
                    label={t('register.email')}
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
                    label={t('register.password')}
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password ? formik.errors.password : undefined}
                    startAdornment={<Lock className="w-5 h-5" />}
                />

                <EiInput
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label={t('register.confirmPassword')}
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
                    startAdornment={<Lock className="w-5 h-5" />}
                />

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
                        }`}>{t('register.submit')}</span>

                </EiButton>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('register.haveAccount')}{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        {t('register.login')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
