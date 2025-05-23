import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
  const { data } = await axios.post('/api/auth/login', params);
  return data;
});

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/api/auth/signup', params);
  return data;
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/api/auth/user');
  return data;
});

export const updateUser = createAsyncThunk('auth/updateUser', async (params) => {
  const { data } = await axios.put('/api/auth/user', params);
  return data;
});

export const uploadAvatar = createAsyncThunk('auth/uploadAvatar', async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const { data } = await axios.post('/api/auth/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
});

export const deleteAvatar = createAsyncThunk('auth/deleteAvatar', async () => {
  const { data } = await axios.delete('/api/auth/user/avatar');
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.data = null;
        state.status = 'error';
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.data = null;
        state.status = 'error';
      })
      .addCase(fetchRegister.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(fetchRegister.rejected, (state) => {
        state.data = null;
        state.status = 'error';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'loaded';
      })
      .addCase(updateUser.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.status = 'loaded';
      })
      .addCase(uploadAvatar.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(deleteAvatar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.status = 'loaded';
      })
      .addCase(deleteAvatar.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
