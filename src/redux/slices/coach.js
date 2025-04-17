import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Базовий URL для API
// const API_URL = 'http://localhost:5000/api/coach';

// Асинхронні thunks для взаємодії з API
export const fetchAllCoaches = createAsyncThunk(
  'coach/fetchAllCoaches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/coach`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchCoachById = createAsyncThunk(
  'coach/fetchCoachById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/coach/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createCoach = createAsyncThunk(
  'coach/createCoach',
  async (coachData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`/api/coach`, coachData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCoach = createAsyncThunk(
  'coach/updateCoach',
  async ({ id, coachData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`/api/coach/${id}`, coachData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteCoach = createAsyncThunk(
  'coach/deleteCoach',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/coach/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addReview = createAsyncThunk(
  'coach/addReview',
  async ({ id, reviewData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`/api/coach/${id}/review`, reviewData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const uploadCoachPhotos = createAsyncThunk(
  'coach/uploadCoachPhotos',
  async ({ id, photos }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      const response = await axios.post(`/api/coach/${id}/photos`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteCoachPhoto = createAsyncThunk(
  'coach/deleteCoachPhoto',
  async ({ id, photoId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/coach/${id}/photos`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: { photoId },
      });
      return { id, photoId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Початковий стан
const initialState = {
  coaches: [],
  currentCoach: null,
  loading: false,
  error: null,
  success: false,
};

// Створення slice
const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentCoach: (state) => {
      state.currentCoach = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Отримання всіх тренерів
      .addCase(fetchAllCoaches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoaches.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
      })
      .addCase(fetchAllCoaches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при отриманні тренерів';
      })

      // Отримання тренера за ID
      .addCase(fetchCoachById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoach = action.payload;
      })
      .addCase(fetchCoachById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при отриманні тренера';
      })

      // Створення тренера
      .addCase(createCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCoach.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches.push(action.payload);
        state.success = true;
      })
      .addCase(createCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при створенні тренера';
      })

      // Оновлення тренера
      .addCase(updateCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCoach.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.coaches.findIndex((coach) => coach._id === action.payload._id);
        if (index !== -1) {
          state.coaches[index] = action.payload;
        }
        if (state.currentCoach && state.currentCoach._id === action.payload._id) {
          state.currentCoach = action.payload;
        }
        state.success = true;
      })
      .addCase(updateCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при оновленні тренера';
      })

      // Видалення тренера
      .addCase(deleteCoach.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCoach.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = state.coaches.filter((coach) => coach._id !== action.payload.id);
        if (state.currentCoach && state.currentCoach._id === action.payload.id) {
          state.currentCoach = null;
        }
        state.success = true;
      })
      .addCase(deleteCoach.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при видаленні тренера';
      })

      // Додавання відгуку
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCoach && state.currentCoach._id === action.payload.coachId) {
          state.currentCoach.reviews = action.payload.reviews;
        }
        state.success = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при додаванні відгуку';
      })

      // Завантаження фото
      .addCase(uploadCoachPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadCoachPhotos.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCoach && state.currentCoach._id === action.payload.coachId) {
          state.currentCoach.photos = action.payload.photos;
        }
        state.success = true;
      })
      .addCase(uploadCoachPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при завантаженні фото';
      })

      // Видалення фото
      .addCase(deleteCoachPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCoachPhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentCoach && state.currentCoach._id === action.payload.id) {
          state.currentCoach.photos = state.currentCoach.photos.filter(
            (photo) => photo._id !== action.payload.photoId,
          );
        }
        state.success = true;
      })
      .addCase(deleteCoachPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Помилка при видаленні фото';
      });
  },
});

export const { clearError, clearSuccess, clearCurrentCoach } = coachSlice.actions;

export default coachSlice.reducer;
