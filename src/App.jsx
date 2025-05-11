import React, { useEffect } from 'react';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAuthMe } from './redux/slices/auth';

import MainPage from './pages/MainPage/MainPage';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import CoachesPage from './pages/CoachesPage/CoachesPage';
import CoachPage from './pages/CoachesPage/SingleCoachPage';
import TrainingsPage from './pages/TrainingsPage/TrainingsPage';
import TrainingDetails from './pages/TrainingsPage/SingleTrainingPage';
import Footer from './components/Footer/Footer';
import AboutPage from './pages/AboutPage/AboutPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminPage from './pages/AdminPage/AdminPage';
import CoachDashboard from './pages/CoachDashboard/CoachDashboard';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <Container maxWidth="lg" className="main">
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
