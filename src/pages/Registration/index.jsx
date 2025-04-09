import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button, Paper, TextField, Typography } from '@mui/material';
import { fetchRegister } from '../../redux/slices/auth';

import styles from './Registration.module.scss';

const Registration = () => {
  const isAuth = useSelector((state) => Boolean(state.auth.data));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));
    console.log(data);

    if (!data.payload) {
      alert('Registration failed');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    navigate('/');
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Реєстрація
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Ім'я"
          type="firstName"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('firstName', { required: "Уведіть ваше ім'я" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Прізвище"
          type="lastName"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('lastName', { required: 'Уведіть ваше повне прізвище' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Електронна пошта"
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Уведіть вашу електронну пошту' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Уведіть ваш пароль' })}
          fullWidth
        />
        <Button disabled={!isValid} size="large" variant="contained" type="submit" fullWidth>
          Sign up
        </Button>
      </form>
    </Paper>
  );
};

export default Registration;
