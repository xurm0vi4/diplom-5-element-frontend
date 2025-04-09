import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from './redux/slices/auth';

import MainPage from './pages/MainPage';
import Header from './components/Header';
import Login from './pages/Login';
import Registration from './pages/Registration';
import CoachesPage from './pages/CoachesPage';
import TrainingsPage from './pages/TrainingsPage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
