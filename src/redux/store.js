import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/auth';
import coachSlice from './slices/coach';
import trainingSlice from './slices/trainings';
import categorySlice from './slices/category';
import currentCoachSlice from './slices/currentCoach';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    coach: coachSlice,
    training: trainingSlice,
    category: categorySlice,
    currentCoach: currentCoachSlice,
  },
});
