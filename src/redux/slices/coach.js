import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

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
      const response = await axios.post(`/api/coach/${id}/reviews`, reviewData, {
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

export const uploadCoachPhotos = createAsyncThunk('coach/uploadPhotos', async ({ id, photos }) => {
  const formData = new FormData();
  photos.forEach((photo) => {
    formData.append('photos', photo);
  });

  const { data } = await axios.post(`/api/coach/${id}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
});

export const deleteCoachPhoto = createAsyncThunk(
  'coach/deleteCoachPhoto',
  async ({ id, photoId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/coach/${id}/photos/${photoId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      return { id, photos: response.data.photos };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCoachReview = createAsyncThunk(
  'coach/updateReview',
  async ({ id, reviewId, reviewData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`/api/coach/${id}/reviews/${reviewId}`, reviewData, {
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

export const deleteCoachReview = createAsyncThunk(
  'coach/deleteReview',
  async ({ id, reviewId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`/api/coach/${id}/reviews/${reviewId}`, {
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

const initialState = {
  coaches: [],
  currentCoach: null,
  status: 'loading',
};

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
          state.currentCoach = { ...state.currentCoach, ...action.payload };
        }
      })
      .addCase(updateCoach.rejected, (state) => {
        state.status = 'error';
      })

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

      .addCase(uploadCoachPhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCoachPhotos.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.currentCoach.photos = action.payload.photos;
      })
      .addCase(uploadCoachPhotos.rejected, (state) => {
        state.status = 'error';
      })

      .addCase(deleteCoachPhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCoachPhoto.fulfilled, (state, action) => {
        const { id } = action.payload;
        if (state.currentCoach && state.currentCoach._id === id) {
          state.currentCoach.photos = state.currentCoach.photos.filter(
            (photo) => photo !== action.payload.photoId,
          );
        }
        state.status = 'succeeded';
      })
      .addCase(deleteCoachPhoto.rejected, (state) => {
        state.status = 'error';
      })

      .addCase(updateCoachReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCoachReview.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentCoach && state.currentCoach._id === action.payload._id) {
          state.currentCoach = action.payload;
        }
      })
      .addCase(updateCoachReview.rejected, (state) => {
        state.status = 'error';
      })

      .addCase(deleteCoachReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCoachReview.fulfilled, (state, action) => {
        state.status = 'loaded';
        if (state.currentCoach && state.currentCoach._id === action.payload._id) {
          state.currentCoach = action.payload;
        }
      })
      .addCase(deleteCoachReview.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const { clearError, clearSuccess, clearCurrentCoach } = coachSlice.actions;

export default coachSlice.reducer;
