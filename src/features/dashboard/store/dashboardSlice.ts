import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dashboardApi } from '../api/dashboardApi';
import { ApiService } from '@/services/apiService';
import type { ChainedDashboardData } from '../api/dashboardApi';

interface DashboardState {
    data: ChainedDashboardData | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: null,
    isLoading: false,
    error: null,
};

/**
 * Async thunk for fetching complete dashboard data using parallel API chaining
 */
export const fetchCompleteDashboardData = createAsyncThunk(
    'dashboard/fetchComplete',
    async (username: string, { rejectWithValue }) => {
        console.log("CALLING API",username)
        try {
            // Reset any existing chain state
            ApiService.resetChain();
            
            // Use parallel API chaining for better performance
            return await dashboardApi.getParallelDashboardData(username);
        } catch (error: any) {
            return rejectWithValue(
                error.message || 'Failed to fetch complete dashboard data'
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
        clearDashboardData: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompleteDashboardData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCompleteDashboardData.fulfilled, (state, action: PayloadAction<ChainedDashboardData>) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchCompleteDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearDashboardError, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
