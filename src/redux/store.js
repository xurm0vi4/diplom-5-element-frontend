import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth';
import coachSlice from './slices/coach';
import trainingSlice from './slices/trainings';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    coach: coachSlice,
    training: trainingSlice,
  },
});
