import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { isCoach } from '../../utils/roleUtils';
import styles from './CoachDashboard.module.scss';
import CreateTrainingForm from '../../components/CreateTrainingForm/CreateTrainingForm';

const CoachDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isCoach(user)) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user || !isCoach(user)) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    navigate(`/coaches/${user._id}`);
  };

  return (
    <div className={styles.coachDashboard}>
      <Typography variant="h4" component="h1" className={styles.title}>
        Панель тренера
      </Typography>

      <Paper className={styles.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered>
          <Tab label="Мій профіль" />
          <Tab label="Мої тренування" />
        </Tabs>
      </Paper>

      <Paper className={styles.contentContainer}>
        {activeTab === 0 ? (
          <Box className={styles.profileSection}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Мій профіль</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}>
                Редагувати профіль
              </Button>
            </Box>
            {/* Тут можна додати інформацію про тренера */}
          </Box>
        ) : (
          <Box className={styles.trainingsSection}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Мої тренування</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setActiveTab(1)}>
                Створити тренування
              </Button>
            </Box>
            <CreateTrainingForm isAdmin={false} />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default CoachDashboard;
