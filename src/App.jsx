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
import CoachPage from './pages/CoachesPage/CoachPage';
import TrainingsPage from './pages/TrainingsPage';
import TrainingDetails from './pages/TrainingsPage/TrainingPage';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage';
import CoachDashboard from './pages/CoachDashboard';

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
          <Route path="/registration" element={<Registration />} />
          <Route path="/coaches" element={<CoachesPage />} />
          <Route path="/coaches/:id" element={<CoachPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/trainings/:id" element={<TrainingDetails />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/coach-dashboard" element={<CoachDashboard />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
