import { createSlice, type UnknownAction, type PayloadAction } from '@reduxjs/toolkit';
import type { MonitoringState } from '../types';

const initialState: MonitoringState = {
    apiCalls: [],
    pageViews: {},
    systemLogs: [],
};

interface AsyncMeta {
    requestId: string;
    requestStatus: 'pending' | 'fulfilled' | 'rejected';
}

const isAsyncThunkAction = (action: UnknownAction): action is UnknownAction & { meta: AsyncMeta } => {
    return (
        typeof action === 'object' &&
        action !== null &&
        'meta' in action &&
        typeof (action as any).meta.requestId === 'string'
    );
};

const monitoringSlice = createSlice({
    name: 'monitoring',
    initialState,
    reducers: {
        clearLogs: (state) => {
            state.apiCalls = [];
            state.pageViews = {};
            state.systemLogs = [];
        },
        logPageView: (state, action: PayloadAction<{ path: string; title: string }>) => {
            const { path, title } = action.payload;
            if (state.pageViews[path]) {
                state.pageViews[path].count += 1;
                state.pageViews[path].timestamp = Date.now();
            } else {
                state.pageViews[path] = {
                    path,
                    title,
                    count: 1,
                    timestamp: Date.now(),
                };
            }
        },
        logSystemEvent: (state, action: PayloadAction<{ message: string; type?: 'info' | 'warning' | 'error' | 'success' }>) => {
            state.systemLogs.unshift({
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                message: action.payload.message,
                type: action.payload.type || 'info',
            });
            if (state.systemLogs.length > 50) state.systemLogs.pop();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase('theme/setThemeMode', (state, action: any) => {
                state.systemLogs.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: Date.now(),
                    message: `Theme changed to ${action.payload}`,
                    type: 'info',
                });
            })
            .addMatcher(
                (action) => isAsyncThunkAction(action) && action.type.endsWith('/pending'),
                (state, action: any) => {
                    const actionType = action.type.replace('/pending', '');
                    state.apiCalls.unshift({
                        id: action.meta.requestId,
                        method: 'THUNK',
                        url: actionType,
                        status: 102, // Processing
                        duration: 0,
                        timestamp: Date.now(),
                    });
                    if (state.apiCalls.length > 50) state.apiCalls.pop();
                }
            )
            .addMatcher(
                (action) => isAsyncThunkAction(action) && action.type.endsWith('/fulfilled'),
                (state, action: any) => {
                    const entry = state.apiCalls.find((call) => call.id === action.meta.requestId);
                    if (entry) {
                        entry.status = 200;
                        entry.duration = Date.now() - entry.timestamp;
                    }
                }
            )
            .addMatcher(
                (action) => isAsyncThunkAction(action) && action.type.endsWith('/rejected'),
                (state, action: any) => {
                    const entry = state.apiCalls.find((call) => call.id === action.meta.requestId);
                    if (entry) {
                        entry.status = 500;
                        entry.duration = Date.now() - entry.timestamp;
                    }
                }
            );
    },
});

export const { clearLogs, logPageView, logSystemEvent } = monitoringSlice.actions;
export default monitoringSlice.reducer;
