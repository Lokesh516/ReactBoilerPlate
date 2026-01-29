/**
 * Redux Middleware for Action Logging
 * Logs all Redux actions and state changes
 */

import type { UnknownAction, Dispatch } from '@reduxjs/toolkit';
import { logger } from '@/services/logging/Logger';

const EXCLUDED_ACTIONS = ['@@INIT', '@@REPLACE', 'redux-persist'];
const THUNK_ACTIONS = ['pending', 'fulfilled', 'rejected'];

/**
 * Logger middleware for Redux
 * Logs all actions and their payloads
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loggerMiddleware = (_api: any) => (next: Dispatch) => (action: UnknownAction) => {
    // Skip internal Redux actions
    if (typeof action === 'object' && action !== null && 'type' in action) {
        const actionType = String(action.type);

        const shouldExclude =
            EXCLUDED_ACTIONS.some((excluded) => actionType.includes(excluded)) ||
            THUNK_ACTIONS.some((thunk) => actionType.includes(thunk));

        if (!shouldExclude && import.meta.env.VITE_LOG_REDUX_ACTIONS === 'true') {
            logger.debug(`Redux Action: ${actionType}`, {
                payload: (action as Record<string, unknown>).payload,
            });
        }
    }

    try {
        const result = next(action);
        return result;
    } catch (error) {
        const actionType = typeof action === 'object' && action !== null && 'type' in action
            ? String(action.type)
            : 'unknown';

        logger.error(`Error in action: ${actionType}`, {
            error: error instanceof Error ? error.message : String(error),
        });

        throw error;
    }
};

export default loggerMiddleware;
