import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/auth';

import { Button, Container } from '@mui/material';
import styles from './Header.module.scss';

const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => Boolean(state.auth.data));
  const navigate = useNavigate();

  const onClickLogout = () => {
    if (window.confirm('Чи ви впевнені, що хочете вийти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <header className={styles.root}>
      <Container maxWidth="lg" fixed>
        <div className={styles.flex}>
          <Link to="/">
            <Button variant="contained" color="secondary">
              5 елемент
            </Button>
          </Link>
          {isAuth ? (
            <div className={styles.buttons}>
              <Button onClick={onClickLogout} color="error" variant="contained">
                Вийти
              </Button>
            </div>
          ) : (
            <div className={styles.buttons}>
              <Link to="/trainings">
                <Button variant="outlined">Заняття</Button>
              </Link>
              <Link to="/coaches">
                <Button variant="outlined">Тренери</Button>
              </Link>
              <Link to="/login">
                <Button variant="outlined">Увійти</Button>
              </Link>
              <Link to="/registration">
                <Button variant="contained">Реєстрація</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
