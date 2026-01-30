import axios from 'axios';
import type {
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';
import { API_CONFIG } from '@/config/apiConfig';
import { ApiCallContext } from '@/services/apiCallContext';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    timeout: API_CONFIG.TIMEOUT,
});

/* =========================
   Request Interceptor
========================= */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 🔴 Enforce API chaining limit HERE
        ApiCallContext.enter();

        // Attach auth token (if applicable)
        const token = localStorage.getItem('token');

        if (token && config.headers && !config.url?.startsWith('http')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/* =========================
   Response Interceptor
========================= */
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        // Auth handling
        if (error.response?.status === 401) {
            // session cleanup / refresh token logic
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
