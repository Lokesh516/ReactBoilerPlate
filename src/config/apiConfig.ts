/**
 * Centralized API Configuration
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.github.com', 
    TIMEOUT: 15000,
    ENDPOINTS: {
        FOLLOWERS: '/users/octocat/followers',
        FEEDS:'/feeds',
        EMOGIS:'/emojis',
        EVENTS:'/events',
    },
};
