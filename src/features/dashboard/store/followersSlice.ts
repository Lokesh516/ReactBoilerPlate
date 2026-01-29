import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FollowersState, Follower } from '../types';
import { followersApi } from '../api/followersApi';

const initialState: FollowersState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchFollowers = createAsyncThunk(
    'followers/fetchFollowers',
    async (_, { rejectWithValue }) => {
        try {
            return await followersApi.getFollowers();
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch followers');
        }
    }
);

const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {
        clearFollowersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollowers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFollowers.fulfilled, (state, action: PayloadAction<Follower[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchFollowers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearFollowersError } = followersSlice.actions;
export default followersSlice.reducer;
