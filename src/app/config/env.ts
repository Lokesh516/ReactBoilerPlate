import * as Yup from 'yup';

const envSchema = Yup.object({
    REACT_APP_API_BASE_URL: Yup.string().url().required(),
    REACT_APP_ENVIRONMENT: Yup.string().oneOf(['development', 'staging', 'production']).default('development'),
    REACT_APP_VERSION: Yup.string().required(),
});

export const validateEnv = () => {
    try {
        const vars = {
            REACT_APP_API_BASE_URL: import.meta.env.REACT_APP_API_BASE_URL,
            REACT_APP_ENVIRONMENT: import.meta.env.REACT_APP_ENVIRONMENT,
            REACT_APP_VERSION: import.meta.env.REACT_APP_VERSION,
        };

        envSchema.validateSync(vars, { abortEarly: false });
        return vars;
    } catch (err: any) {
        if (import.meta.env.DEV) {
            console.error('Environment Validation Error:', err.errors);
        }
        // In production we might want to fail hard or log to Sentry
        return import.meta.env;
    }
};

export const env = validateEnv();
