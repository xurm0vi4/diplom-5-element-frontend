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
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { createCoach } from '../../redux/slices/coach';
import { fetchCategories } from '../../redux/slices/category';
import styles from './CreateCoachForm.module.scss';

const CreateCoachForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSpecializationChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSpecializations(typeof value === 'string' ? value.split(',') : value);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const coachData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        age: data.age,
        specialization: selectedSpecializations,
        experience: data.experience,
        description: data.description,
      };

      await dispatch(createCoach(coachData)).unwrap();
      setSuccess('Тренера успішно створено!');
      reset();
      setSelectedSpecializations([]);
    } catch (err) {
      setError(err.message || 'Помилка при створенні тренера');
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
          label="Ім'я"
          {...register('firstName', { required: "Ім'я обов'язкове" })}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          className={styles.input}
        />
        <TextField
          fullWidth
          label="Прізвище"
          {...register('lastName', { required: "Прізвище обов'язкове" })}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          className={styles.input}
        />
      </Box>

      <Box className={styles.formRow}>
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
          className={styles.input}
        />
        <TextField
          fullWidth
          label="Пароль"
          type="password"
          {...register('password', {
            required: "Пароль обов'язковий",
            minLength: {
              value: 6,
              message: 'Пароль повинен містити мінімум 6 символів',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          className={styles.input}
        />
      </Box>

      <Box className={styles.formRow}>
        <TextField
          fullWidth
          label="Вік"
          type="number"
          {...register('age', {
            required: "Вік обов'язковий",
            min: { value: 18, message: 'Вік не може бути менше 18 років' },
            max: { value: 100, message: 'Вік не може бути більше 100 років' },
            pattern: { value: /^[0-9]+$/, message: 'Введіть ціле число' },
          })}
          error={!!errors.age}
          helperText={errors.age?.message}
          className={styles.input}
        />
        <TextField
          fullWidth
          label="Досвід (років)"
          type="number"
          {...register('experience', {
            required: "Досвід обов'язковий",
            min: { value: 0, message: "Досвід не може бути від'ємним" },
            pattern: { value: /^[0-9]+$/, message: 'Введіть ціле число' },
          })}
          error={!!errors.experience}
          helperText={errors.experience?.message}
          className={styles.input}
        />
      </Box>

      <Box className={styles.formRow}>
        <FormControl fullWidth className={styles.input}>
          <InputLabel>Спеціалізація</InputLabel>
          <Select
            multiple
            value={selectedSpecializations}
            onChange={handleSpecializationChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={categories?.find((cat) => cat._id === value)?.name} />
                ))}
              </Box>
            )}>
            {categories?.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {isLoading ? <CircularProgress size={24} /> : 'Створити тренера'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCoachForm;
