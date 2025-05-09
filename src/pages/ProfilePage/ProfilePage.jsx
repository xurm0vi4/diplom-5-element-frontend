import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  PhotoCamera,
} from '@mui/icons-material';
import { updateUser, uploadAvatar, deleteAvatar } from '../../redux/slices/auth';
import styles from './ProfilePage.module.scss';
import { API_URL } from '../../constants/api';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.data);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(updateUser(data)).unwrap();
      setSuccess('Профіль успішно оновлено');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Помилка при оновленні профілю');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await dispatch(uploadAvatar(file)).unwrap();
      setSuccess('Аватар успішно оновлено');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Помилка при завантаженні аватара');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await dispatch(deleteAvatar()).unwrap();
      setSuccess('Аватар успішно видалено');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Помилка при видаленні аватара');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    });
  };

  if (!user) {
    return (
      <Box className={styles.container}>
        <Typography variant="h5" color="error">
          Будь ласка, увійдіть в систему
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Paper className={styles.profilePaper}>
        <Box className={styles.header}>
          <Box className={styles.avatarContainer}>
            <Avatar
              src={user.avatar ? `${API_URL}uploads/avatars/${user.avatar}` : null}
              className={styles.avatar}>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </Avatar>
            <Box className={styles.avatarActions}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton component="span" color="primary">
                  <PhotoCamera />
                </IconButton>
              </label>
              {user.avatar && (
                <IconButton color="error" onClick={handleAvatarDelete}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          <Typography variant="h4" className={styles.title}>
            Профіль користувача
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className={styles.alert}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" className={styles.alert}>
            {success}
          </Alert>
        )}

        {isEditing ? (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  {...register('firstName', { required: "Ім'я обов'язкове" })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Прізвище"
                  {...register('lastName', { required: "Прізвище обов'язкове" })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email', {
                    required: "Email обов'язковий",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Невірний формат email',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
            </Grid>
            <Box className={styles.actions}>
              <Button variant="contained" color="primary" type="submit">
                Зберегти
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>
                Скасувати
              </Button>
            </Box>
          </Box>
        ) : (
          <Box className={styles.info}>
            <Box className={styles.infoItem}>
              <PersonIcon className={styles.icon} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Ім'я та прізвище
                </Typography>
                <Typography variant="body1">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            </Box>

            <Divider className={styles.divider} />

            <Box className={styles.infoItem}>
              <EmailIcon className={styles.icon} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
            </Box>

            <Divider className={styles.divider} />

            <Box className={styles.infoItem}>
              <CalendarIcon className={styles.icon} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Дата реєстрації
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                </Typography>
              </Box>
            </Box>

            <Box className={styles.actions}>
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditClick}>
                Редагувати профіль
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProfilePage;
