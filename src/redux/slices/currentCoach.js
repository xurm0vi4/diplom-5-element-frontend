import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchCurrentCoach = createAsyncThunk(
  'currentCoach/fetchCurrentCoach',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/coach/user`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const currentCoachSlice = createSlice({
  name: 'currentCoach',
  initialState: {
    data: null,
    status: 'loading',
    error: null,
  },
  reducers: {
    clearCurrentCoach: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentCoach.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentCoach.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchCurrentCoach.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCoach } = currentCoachSlice.actions;
export default currentCoachSlice.reducer;
