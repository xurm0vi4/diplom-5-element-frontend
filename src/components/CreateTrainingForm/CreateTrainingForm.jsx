import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Grid,
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
  const { data: user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { categories } = useSelector((state) => state.category);
  const { coaches } = useSelector((state) => state.coach);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isAdmin) {
      dispatch(fetchAllCoaches());
    }
  }, [dispatch, isAdmin]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const trainingData = {
        title: data.title,
        description: data.description,
        category: data.category,
        coach: isAdmin ? data.coach : user._id,
        price: data.price,
        duration: data.duration,
        maxParticipants: data.maxParticipants,
        schedule: data.schedule,
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
        <TextField
          fullWidth
          label="Ціна"
          type="number"
          {...register('price', {
            required: "Ціна обов'язкова",
            min: { value: 0, message: "Ціна не може бути від'ємною" },
          })}
          error={!!errors.price}
          helperText={errors.price?.message}
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
        <TextField
          fullWidth
          label="Максимальна кількість учасників"
          type="number"
          {...register('maxParticipants', {
            required: "Кількість учасників обов'язкова",
            min: { value: 1, message: 'Кількість учасників повинна бути більше 0' },
          })}
          error={!!errors.maxParticipants}
          helperText={errors.maxParticipants?.message}
          className={styles.input}
        />
      </Box>

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
        {isAdmin && (
          <FormControl fullWidth className={styles.input}>
            <InputLabel>Тренер</InputLabel>
            <Select
              {...register('coach', { required: "Тренер обов'язковий" })}
              error={!!errors.coach}>
              {coaches?.map((coach) => (
                <MenuItem key={coach._id} value={coach._id}>
                  {coach.user.firstName} {coach.user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

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
