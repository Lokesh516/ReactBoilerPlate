import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from '@/lib/axios';

/**
 * Centralized API Service for standardized HTTP calls
 */
export const ApiService = {
    /**
     * GET request
     */
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await api.get(url, config);
        return response.data;
    },

    /**
     * POST request
     */
    post: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await api.post(url, data, config);
        return response.data;
    },

    /**
     * PUT request
     */
    put: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await api.put(url, data, config);
        return response.data;
    },

    /**
     * PATCH request
     */
    patch: async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await api.patch(url, data, config);
        return response.data;
    },

    /**
     * DELETE request
     */
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        const response: AxiosResponse<T> = await api.delete(url, config);
        return response.data;
    },
    resetChain: () => {
        api.interceptors.request.use((config) => {
            return config;
        });
    }
};
