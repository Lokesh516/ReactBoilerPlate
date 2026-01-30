import { ApiService } from '@/services/apiService';
import { API_CONFIG } from '@/config/apiConfig';
import { ApiCallContext } from '@/services/apiCallContext';
import type { Follower } from '../types';

// Types for chained API responses
interface Feed {
    id: string;
    title: string;
    content: string;
    published_at: string;
}

interface Emoji {
    emoji: string;
    name: string;
    category: string;
}

interface Event {
    id: string;
    type: string;
    actor: {
        login: string;
        avatar_url: string;
    };
    repo: {
        name: string;
        url: string;
    };
    created_at: string;
}

export interface ChainedDashboardData {
    followers: Follower[];
    feeds: Feed[];
    emojis: Emoji[];
    events: Event[];
    summary: {
        totalFollowers: number;
        totalFeeds: number;
        totalEmojis: number;
        totalEvents: number;
    };
}

/**
 * API Chaining Examples with New Endpoints
 */
export const dashboardApi = {
    /**
     * Smart API Chaining with 2-call limit
     * Prioritizes critical APIs and handles dependencies
     */
    getParallelDashboardData: async (username: string): Promise<ChainedDashboardData> => {
        try {
            // Reset context for new chain
            ApiCallContext.reset();
            
            // Strategy 1: Make the most critical API call first (Followers)
            let followers: Follower[] = [];
            try {
                ApiCallContext.enter();
                followers = await ApiService.get<Follower[]>(API_CONFIG.ENDPOINTS.FOLLOWERS);
            } catch (error: any) {
                console.warn('Followers API failed:', error.message);
                followers = [];
            }
            
            // Strategy 2: Use remaining call for the next most important data
            // Since we can only make 2 calls, we'll get feeds as the second priority
            let feeds: Feed[] = [];
            let emojis: Emoji[] = [];
            let events: Event[] = [];
            
            if (ApiCallContext.canMakeCall()) {
                try {
                    ApiCallContext.enter();
                    feeds = await ApiService.get<Feed[]>(API_CONFIG.ENDPOINTS.FEEDS);
                } catch (error: any) {
                    console.warn('Feeds API failed, using mock data:', error.message);
                    feeds = [];
                }
            }
            
            // For remaining data, use mock data since we've hit the limit
            if (!ApiCallContext.canMakeCall()) {
                console.log('API limit reached, using mock data for emojis and events');
                emojis = await getMockEmojis();
                events = await getMockEvents(username);
            } else {
                // If we somehow have capacity (unlikely with 2-call limit)
                try {
                    const [emojisData, eventsData] = await Promise.all([
                        getMockEmojis(),
                        getMockEvents(username)
                    ]);
                    emojis = emojisData;
                    events = eventsData;
                } catch (error) {
                    console.warn('Mock data generation failed:', error);
                    emojis = [];
                    events = [];
                }
            }
            
            return {
                followers,
                feeds,
                emojis,
                events,
                summary: {
                    totalFollowers: followers.length,
                    totalFeeds: feeds.length,
                    totalEmojis: emojis.length,
                    totalEvents: events.length,
                }
            };
        } catch (error) {
            console.error('Error in smart dashboard data chaining:', error);
            throw new Error(`Failed to load dashboard data for ${username}`);
        }
    },

    /**
     * Alternative strategy: Dependency-based chaining
     * If one API needs data from another, limit to 2 calls max
     */
    getDependencyBasedDashboardData: async (username: string): Promise<ChainedDashboardData> => {
        try {
            ApiCallContext.reset();
            
            // Call 1: Get followers (primary data)
            ApiCallContext.enter();
            const followers = await ApiService.get<Follower[]>(API_CONFIG.ENDPOINTS.FOLLOWERS)
                .catch(error => {
                    console.warn('Followers API failed:', error.message);
                    return [] as Follower[];
                });
            
            // Call 2: Get feeds (secondary data)
            let feeds: Feed[] = [];
            if (ApiCallContext.canMakeCall()) {
                ApiCallContext.enter();
                feeds = await ApiService.get<Feed[]>(API_CONFIG.ENDPOINTS.FEEDS)
                    .catch(error => {
                        console.warn('Feeds API failed:', error.message);
                        return [] as Feed[];
                    });
            }
            
            // Use mock data for the rest since we've hit the 2-call limit
            const [emojis, events] = await Promise.all([
                getMockEmojis(),
                getMockEvents(username)
            ]);
            
            return {
                followers,
                feeds,
                emojis,
                events,
                summary: {
                    totalFollowers: followers.length,
                    totalFeeds: feeds.length,
                    totalEmojis: emojis.length,
                    totalEvents: events.length,
                }
            };
        } catch (error) {
            console.error('Error in dependency-based dashboard data chaining:', error);
            throw new Error(`Failed to load dashboard data for ${username}`);
        }
    },

    /**
     * Priority-based chaining with 2-call limit
     * Most important data first, fallback to mock for rest
     */
    getPriorityBasedDashboardData: async (username: string): Promise<ChainedDashboardData> => {
        try {
            ApiCallContext.reset();
            
            // Define priority order: Followers > Feeds > Emojis > Events
            const results: {
                followers: Follower[];
                feeds: Feed[];
                emojis: Emoji[];
                events: Event[];
            } = {
                followers: [],
                feeds: [],
                emojis: [],
                events: []
            };
            
            // Make up to 2 API calls based on priority
            const apiCalls = [
                {
                    key: 'followers' as keyof typeof results,
                    api: () => ApiService.get<Follower[]>(API_CONFIG.ENDPOINTS.FOLLOWERS),
                    fallback: () => [] as Follower[]
                },
                {
                    key: 'feeds' as keyof typeof results,
                    api: () => ApiService.get<Feed[]>(API_CONFIG.ENDPOINTS.FEEDS),
                    fallback: () => [] as Feed[]
                }
            ];
            
            // Execute up to 2 API calls
            for (const call of apiCalls) {
                if (!ApiCallContext.canMakeCall()) break;
                
                try {
                    ApiCallContext.enter();
                    const result = await call.api();
                    if (call.key === 'followers') {
                        results.followers = result as Follower[];
                    } else if (call.key === 'feeds') {
                        results.feeds = result as Feed[];
                    }
                } catch (error: any) {
                    console.warn(`${call.key} API failed:`, error.message);
                    if (call.key === 'followers') {
                        results.followers = call.fallback() as Follower[];
                    } else if (call.key === 'feeds') {
                        results.feeds = call.fallback() as Feed[];
                    }
                }
            }
            
            // Fill remaining data with mocks
            results.emojis = await getMockEmojis();
            results.events = await getMockEvents(username);
            
            return {
                followers: results.followers,
                feeds: results.feeds,
                emojis: results.emojis,
                events: results.events,
                summary: {
                    totalFollowers: results.followers.length,
                    totalFeeds: results.feeds.length,
                    totalEmojis: results.emojis.length,
                    totalEvents: results.events.length,
                }
            };
        } catch (error) {
            console.error('Error in priority-based dashboard data chaining:', error);
            throw new Error(`Failed to load dashboard data for ${username}`);
        }
    }
};

// Helper functions for mock data
const getMockEmojis = (): Promise<Emoji[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    emoji: '😀',
                    name: 'grinning_face',
                    category: 'smileys'
                },
                {
                    emoji: '🎉',
                    name: 'party_popper',
                    category: 'activities'
                },
                {
                    emoji: '🚀',
                    name: 'rocket',
                    category: 'objects'
                }
            ]);
        }, 50);
    });
};

const getMockEvents = (username: string): Promise<Event[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    type: 'PushEvent',
                    actor: {
                        login: username,
                        avatar_url: `https://github.com/${username}.png`
                    },
                    repo: {
                        name: `${username}/sample-repo`,
                        url: `https://github.com/${username}/sample-repo`
                    },
                    created_at: new Date().toISOString()
                },
                {
                    id: '2',
                    type: 'IssuesEvent',
                    actor: {
                        login: username,
                        avatar_url: `https://github.com/${username}.png`
                    },
                    repo: {
                        name: `${username}/another-repo`,
                        url: `https://github.com/${username}/another-repo`
                    },
                    created_at: new Date().toISOString()
                }
            ]);
        }, 50);
    });
};
