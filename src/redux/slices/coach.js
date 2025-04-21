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
  status: 'loading',
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
        state.status = 'loading';
      })
      .addCase(fetchAllCoaches.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.coaches = action.payload;
      })
      .addCase(fetchAllCoaches.rejected, (state) => {
        state.status = 'error';
      })

      // Отримання тренера за ID
      .addCase(fetchCoachById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoachById.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.currentCoach = action.payload;
      })
      .addCase(fetchCoachById.rejected, (state) => {
        state.status = 'error';
      })

      // Створення тренера
      .addCase(createCoach.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCoach.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.coaches.push(action.payload);
      })
      .addCase(createCoach.rejected, (state) => {
        state.status = 'error';
      })

      // Оновлення тренера
      .addCase(updateCoach.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCoach.fulfilled, (state, action) => {
        state.status = 'loaded';
        const index = state.coaches.findIndex((coach) => coach._id === action.payload._id);
        if (index !== -1) {
          state.coaches[index] = action.payload;
        }
        if (state.currentCoach && state.currentCoach._id === action.payload._id) {
          state.currentCoach = action.payload;
        }
      })
      .addCase(updateCoach.rejected, (state) => {
        state.status = 'error';
      })

      // Видалення тренера
      .addCase(deleteCoach.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCoach.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.coaches = state.coaches.filter((coach) => coach._id !== action.payload.id);
        if (state.currentCoach && state.currentCoach._id === action.payload.id) {
          state.currentCoach = null;
        }
      })
      .addCase(deleteCoach.rejected, (state) => {
        state.status = 'error';
      })

      // Додавання відгуку
      .addCase(addReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentCoach && state.currentCoach._id === action.payload.coachId) {
          state.currentCoach.reviews = action.payload.reviews;
        }
      })
      .addCase(addReview.rejected, (state) => {
        state.status = 'error';
      })

      // Завантаження фото
      .addCase(uploadCoachPhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCoachPhotos.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentCoach && state.currentCoach._id === action.payload.coachId) {
          state.currentCoach.photos = action.payload.photos;
        }
      })
      .addCase(uploadCoachPhotos.rejected, (state) => {
        state.status = 'error';
      })

      // Видалення фото
      .addCase(deleteCoachPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCoachPhoto.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentCoach && state.currentCoach._id === action.payload.id) {
          state.currentCoach.photos = state.currentCoach.photos.filter(
            (photo) => photo._id !== action.payload.photoId,
          );
        }
      })
      .addCase(deleteCoachPhoto.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const { clearError, clearSuccess, clearCurrentCoach } = coachSlice.actions;

export default coachSlice.reducer;
