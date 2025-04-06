import { configureStore } from '@reduxjs/toolkit';
// import postsSlice from './slices/posts';
import authSlice from './slices/auth';

export const store = configureStore({
  reducer: {
    // posts: postsSlice,
    auth: authSlice,
  },
});
