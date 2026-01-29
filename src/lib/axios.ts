import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/apiConfig';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: API_CONFIG.TIMEOUT,
});

// Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from storage (we'll implement secure storage later)
        const token = localStorage.getItem('token');

        // Only attach token if it exists and request is to our own API (relative URL)
        if (token && config.headers && !config.url?.startsWith('http')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        // Handle 401 Unauthorized (Token refresh logic placeholder)
        if (error.response?.status === 401) {
            // Clear session or refresh token logic
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        // Global Error Handling (could dispatch to Redux)
        console.error('API Error:', error.message);

        return Promise.reject(error);
    }
);

export default api;
