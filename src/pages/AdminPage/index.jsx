import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { isAdmin } from '../../utils/roleUtils';
import styles from './AdminPage.module.scss';
import CreateTrainingForm from '../../components/CreateTrainingForm/CreateTrainingForm';
import CreateCoachForm from '../../components/CreateCoachForm/CreateCoachForm';

const AdminPage = () => {
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

    if (!isAdmin(user)) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user || !isAdmin(user)) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={styles.adminPage}>
      <Typography variant="h4" component="h1" className={styles.title}>
        Панель адміністратора
      </Typography>

      <Paper className={styles.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered>
          <Tab label="Тренери" />
          <Tab label="Тренування" />
        </Tabs>
      </Paper>

      <Paper className={styles.contentContainer}>
        {activeTab === 0 ? (
          <Box className={styles.coachesSection}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Управління тренерами</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setActiveTab(0)}>
                Створити тренера
              </Button>
            </Box>
            <CreateCoachForm />
          </Box>
        ) : (
          <Box className={styles.trainingsSection}>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Управління тренуваннями</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setActiveTab(1)}>
                Створити тренування
              </Button>
            </Box>
            <CreateTrainingForm isAdmin={true} />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default AdminPage;
