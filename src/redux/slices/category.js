import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const { data } = await axios.get('/api/category');
  return data;
});

const initialState = {
  categories: [],
  status: 'loading',
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.categories = [];
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.status = 'error';
        state.categories = [];
      });
  },
});

export default categorySlice.reducer;
