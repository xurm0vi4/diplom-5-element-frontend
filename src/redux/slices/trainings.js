import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Базовий URL для API
// const API_URL = 'http://localhost:5000/api/training';

// Асинхронні thunks для взаємодії з API
export const fetchAllTrainings = createAsyncThunk(
  'trainings/fetchAllTrainings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/training`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchTrainingById = createAsyncThunk(
  'trainings/fetchTrainingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/training/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createTraining = createAsyncThunk(
  'trainings/createTraining',
  async (trainingData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`/api/training`, trainingData, {
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

export const updateTraining = createAsyncThunk(
  'trainings/updateTraining',
  async ({ id, trainingData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`/api/training/${id}`, trainingData, {
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

export const deleteTraining = createAsyncThunk(
  'trainings/deleteTraining',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/training/${id}`, {
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

export const enrollTraining = createAsyncThunk(
  'trainings/enrollTraining',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/training/${id}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const cancelEnrollment = createAsyncThunk(
  'trainings/cancelEnrollment',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(
        `/api/training/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const uploadTrainingPhotos = createAsyncThunk(
  'trainings/uploadTrainingPhotos',
  async ({ id, photos }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      const response = await axios.post(`/api/training/${id}/photos`, formData, {
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

export const deleteTrainingPhoto = createAsyncThunk(
  'trainings/deleteTrainingPhoto',
  async ({ id, photoId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/training/${id}/photos`, {
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
  trainings: [],
  currentTraining: null,
  status: 'loading',
};

// Створення slice
const trainingsSlice = createSlice({
  name: 'trainings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentTraining: (state) => {
      state.currentTraining = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Отримання всіх тренувань
      .addCase(fetchAllTrainings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTrainings.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.trainings = action.payload;
      })
      .addCase(fetchAllTrainings.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при отриманні тренувань';
      })

      // Отримання тренування за ID
      .addCase(fetchTrainingById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTrainingById.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.currentTraining = action.payload;
      })
      .addCase(fetchTrainingById.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при отриманні тренування';
      })

      // Створення тренування
      .addCase(createTraining.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTraining.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.trainings.push(action.payload);
      })
      .addCase(createTraining.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при створенні тренування';
      })

      // Оновлення тренування
      .addCase(updateTraining.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTraining.fulfilled, (state, action) => {
        state.status = 'loaded';
        const index = state.trainings.findIndex((training) => training._id === action.payload._id);
        if (index !== -1) {
          state.trainings[index] = action.payload;
        }
        if (state.currentTraining && state.currentTraining._id === action.payload._id) {
          state.currentTraining = action.payload;
        }
      })
      .addCase(updateTraining.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при оновленні тренування';
      })

      // Видалення тренування
      .addCase(deleteTraining.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTraining.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.trainings = state.trainings.filter((training) => training._id !== action.payload.id);
        if (state.currentTraining && state.currentTraining._id === action.payload.id) {
          state.currentTraining = null;
        }
      })
      .addCase(deleteTraining.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при видаленні тренування';
      })

      // Запис на тренування
      .addCase(enrollTraining.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(enrollTraining.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentTraining && state.currentTraining._id === action.payload.trainingId) {
          state.currentTraining.enrolledUsers = action.payload.enrolledUsers;
        }
      })
      .addCase(enrollTraining.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при записі на тренування';
      })

      // Скасування запису на тренування
      .addCase(cancelEnrollment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelEnrollment.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentTraining && state.currentTraining._id === action.payload.trainingId) {
          state.currentTraining.enrolledUsers = action.payload.enrolledUsers;
        }
      })
      .addCase(cancelEnrollment.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при скасуванні запису на тренування';
      })

      // Завантаження фото
      .addCase(uploadTrainingPhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadTrainingPhotos.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentTraining && state.currentTraining._id === action.payload.trainingId) {
          state.currentTraining.photos = action.payload.photos;
        }
      })
      .addCase(uploadTrainingPhotos.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при завантаженні фото';
      })

      // Видалення фото
      .addCase(deleteTrainingPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTrainingPhoto.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentTraining && state.currentTraining._id === action.payload.id) {
          state.currentTraining.photos = state.currentTraining.photos.filter(
            (photo) => photo._id !== action.payload.photoId,
          );
        }
      })
      .addCase(deleteTrainingPhoto.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.message || 'Помилка при видаленні фото';
      });
  },
});

export const { clearError, clearSuccess, clearCurrentTraining } = trainingsSlice.actions;

export default trainingsSlice.reducer;
