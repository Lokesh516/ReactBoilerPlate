import { ApiService } from '@/services/apiService';
import { API_CONFIG } from '@/config/apiConfig';
import type { Follower } from '../types';

export const followersApi = {
    getFollowers: async (): Promise<Follower[]> => {
        return await ApiService.get<Follower[]>(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.FOLLOWERS);
    },
};
