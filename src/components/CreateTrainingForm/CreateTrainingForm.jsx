import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { createTraining } from '../../redux/slices/trainings';
import { fetchCategories } from '../../redux/slices/category';
import { fetchAllCoaches } from '../../redux/slices/coach';
import styles from './CreateTrainingForm.module.scss';

const CreateTrainingForm = ({ isAdmin = false }) => {
  const dispatch = useDispatch();
  const { data: currentCoach } = useSelector((state) => state.currentCoach);
  const { coaches } = useSelector((state) => state.coach);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { categories } = useSelector((state) => state.category);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchCategories());
    if (isAdmin) {
      dispatch(fetchAllCoaches());
    }
  }, [dispatch, isAdmin]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const trainingData = {
        title: data.title,
        description: data.description,
        category: data.category,
        coach: isAdmin ? data.coach : currentCoach._id,
        schedule: data.schedule || [],
        duration: data.duration,
        capacity: data.capacity,
        location: data.location,
      };

      await dispatch(createTraining(trainingData)).unwrap();
      setSuccess('Тренування успішно створено!');
      reset();
    } catch (err) {
      setError(err.message || 'Помилка при створенні тренування');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

      <Box className={styles.formRow}>
        <TextField
          fullWidth
          label="Назва"
          {...register('title', { required: "Назва обов'язкова" })}
          error={!!errors.title}
          helperText={errors.title?.message}
          className={styles.input}
        />
      </Box>

      {isAdmin && (
        <Box className={styles.formRow}>
          <FormControl fullWidth className={styles.input}>
            <InputLabel>Тренер</InputLabel>
            <Select
              {...register('coach', { required: "Тренер обов'язковий" })}
              error={!!errors.coach}>
              {coaches?.map((coach) => (
                <MenuItem key={coach._id} value={coach._id}>
                  {`${coach.user.firstName} ${coach.user.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box className={styles.formRow}>
        <FormControl fullWidth className={styles.input}>
          <InputLabel>Категорія</InputLabel>
          <Select
            {...register('category', { required: "Категорія обов'язкова" })}
            error={!!errors.category}>
            {categories?.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className={styles.formRow}>
        <TextField
          fullWidth
          label="Опис"
          multiline
          rows={4}
          {...register('description', { required: "Опис обов'язковий" })}
          error={!!errors.description}
          helperText={errors.description?.message}
          className={styles.textarea}
        />
      </Box>

      <Box className={styles.formRow} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Місце проведення"
          {...register('location', { required: "Місце проведення обов'язкове" })}
          error={!!errors.location}
          helperText={errors.location?.message}
          className={styles.input}
        />
        <TextField
          fullWidth
          label="Місткість"
          type="number"
          {...register('capacity', {
            required: "Місткість обов'язкова",
            min: { value: 1, message: 'Місткість повинна бути більше 0' },
          })}
          error={!!errors.capacity}
          helperText={errors.capacity?.message}
          className={styles.input}
        />
      </Box>

      <Box className={styles.formRow}>
        <TextField
          fullWidth
          label="Тривалість (хвилини)"
          type="number"
          {...register('duration', {
            required: "Тривалість обов'язкова",
            min: { value: 1, message: 'Тривалість повинна бути більше 0' },
          })}
          error={!!errors.duration}
          helperText={errors.duration?.message}
          className={styles.input}
        />
      </Box>

      <Box className={styles.formActions}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          className={styles.submitButton}>
          {isLoading ? <CircularProgress size={24} /> : 'Створити'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTrainingForm;
