import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  Avatar,
  Grid,
  Chip,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import { Edit as EditIcon, PhotoCamera, Close } from '@mui/icons-material';
import { updateCoach } from '../../redux/slices/coach';
import { fetchAllTrainings } from '../../redux/slices/trainings';
import { fetchCategories } from '../../redux/slices/category';
import { fetchCurrentCoach, clearCurrentCoach } from '../../redux/slices/currentCoach';
import { uploadAvatar } from '../../redux/slices/auth';
import CreateTrainingForm from '../../components/CreateTrainingForm/CreateTrainingForm';
import styles from './CoachDashboard.module.scss';
import { API_URL } from '../../constants/api';
import { iconMap } from '../../constants/mainPageData';

const CoachDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user } = useSelector((state) => state.auth);
  const { data: currentCoach, status: currentCoachStatus } = useSelector(
    (state) => state.currentCoach,
  );
  const { trainings } = useSelector((state) => state.training);
  const { categories } = useSelector((state) => state.category);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingTraining, setIsCreatingTraining] = useState(false);
  const [editForm, setEditForm] = useState({
    age: '',
    specializations: [],
    experience: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (user?._id && user?.role === 'coach') {
      dispatch(fetchCurrentCoach(user._id));
      dispatch(fetchCategories());
    }
    return () => {
      dispatch(clearCurrentCoach());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (currentCoach?._id) {
      dispatch(fetchAllTrainings({ coach: currentCoach._id }));
    }
  }, [dispatch, currentCoach]);

  useEffect(() => {
    if (currentCoach) {
      setEditForm({
        age: currentCoach.age || '',
        specializations: currentCoach.specializations?.map((spec) => spec._id) || [],
        experience: currentCoach.experience || '',
        description: currentCoach.description || '',
      });
    }
  }, [currentCoach]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setIsCreatingTraining(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const coachData = {
        id: user._id,
        description: editForm.description,
        specializations:
          editForm.specializations.map((id) => categories.find((cat) => cat._id === id)) || [],
        experience: editForm.experience,
        age: editForm.age,
      };

      await dispatch(updateCoach({ id: currentCoach._id, coachData })).unwrap();
      await dispatch(fetchCurrentCoach(user._id));
      setSuccess('Профіль успішно оновлено');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Помилка при оновленні профілю');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreateTraining = () => {
    setIsCreatingTraining(true);
  };

  const handleTrainingClick = (id) => {
    navigate(`/trainings/${id}`);
  };

  const handlePhotoClick = () => {
    setPhotoDialogOpen(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) return;

    try {
      await dispatch(uploadAvatar(selectedFile)).unwrap();
      await dispatch(fetchCurrentCoach(user._id));
      setPhotoDialogOpen(false);
      setSelectedFile(null);
      setPhotoPreview(null);
      setSuccess('Фото успішно оновлено');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Помилка при завантаженні фото');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleClosePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedFile(null);
    setPhotoPreview(null);
  };

  if (!user || user.role !== 'coach') {
    return (
      <Box className={styles.coachDashboard}>
        <Typography variant="h5" className={styles.title}>
          Доступ заборонено
        </Typography>
      </Box>
    );
  }

  if (currentCoachStatus === 'loading') {
    return (
      <Box className={styles.coachDashboard}>
        <Typography variant="h5" className={styles.title}>
          Завантаження...
        </Typography>
      </Box>
    );
  }

  if (currentCoachStatus === 'error') {
    return (
      <Box className={styles.coachDashboard}>
        <Typography variant="h5" className={styles.title} color="error">
          Помилка при завантаженні даних
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchCurrentCoach(user._id))}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.coachDashboard}>
      <Typography variant="h4" className={styles.title}>
        Панель тренера
      </Typography>

      <Box className={styles.tabsContainer}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Мій профіль" />
          <Tab label="Мої тренування" />
        </Tabs>
      </Box>

      <Box className={styles.contentContainer}>
        {activeTab === 0 && (
          <>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Профіль</Typography>
              {!isEditing && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}>
                  Редагувати профіль
                </Button>
              )}
            </Box>

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

            <Box className={styles.avatarContainer}>
              <Avatar
                src={
                  currentCoach?.user?.avatar
                    ? `${API_URL}uploads/avatars/${currentCoach.user.avatar}`
                    : null
                }
                alt={`${currentCoach?.user?.firstName} ${currentCoach?.user?.lastName}`}
                className={styles.avatar}
                onClick={handlePhotoClick}>
                {currentCoach?.user?.firstName?.[0]}
                {currentCoach?.user?.lastName?.[0]}
              </Avatar>
              <IconButton className={styles.photoButton} onClick={handlePhotoClick} color="primary">
                <PhotoCamera />
              </IconButton>
            </Box>

            <Box className={styles.profileInfo}>
              <Typography variant="h4" className={styles.name}>
                {currentCoach?.user?.firstName} {currentCoach?.user?.lastName}
              </Typography>
              <Link
                onClick={() => navigate(`/coaches/${currentCoach?._id}`)}
                variant="body1"
                className={styles.profileLink}>
                Перейти на мою сторінку
              </Link>
              <Typography variant="body1" className={styles.description}>
                {currentCoach?.description}
              </Typography>
              <Box className={styles.infoContainer}>
                <Typography variant="body1" className={styles.infoItem}>
                  <strong>Вік:</strong> {currentCoach?.age || 'Не вказано'}
                </Typography>
                <Typography variant="body1" className={styles.infoItem}>
                  <strong>Досвід:</strong> {currentCoach?.experience || 'Не вказано'} років
                </Typography>
              </Box>
              <Box className={styles.specializations}>
                {currentCoach?.specializations?.map((spec) => (
                  <Chip
                    key={spec._id}
                    label={spec.name}
                    className={styles.chip}
                    icon={iconMap[spec.iconName]}
                  />
                ))}
              </Box>
            </Box>

            {isEditing && (
              <Box component="form" onSubmit={handleEditSubmit} className={styles.editForm}>
                <Box className={styles.formRow}>
                  <TextField
                    fullWidth
                    label="Вік"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className={styles.input}
                  />
                  <TextField
                    fullWidth
                    label="Досвід (років)"
                    type="number"
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    className={styles.input}
                  />
                </Box>

                <FormControl fullWidth className={styles.input}>
                  <InputLabel>Спеціалізація</InputLabel>
                  <Select
                    multiple
                    value={editForm.specializations}
                    onChange={(e) => setEditForm({ ...editForm, specializations: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={categories?.find((cat) => cat._id === value)?.name}
                          />
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

                <TextField
                  fullWidth
                  label="Опис"
                  multiline
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={styles.textarea}
                />

                <Box className={styles.formActions}>
                  <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                    Скасувати
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Зберегти
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box className={styles.sectionHeader}>
              <Typography variant="h5">Тренування</Typography>
              {!isCreatingTraining && (
                <Button variant="contained" color="primary" onClick={handleCreateTraining}>
                  Створити тренування
                </Button>
              )}
            </Box>

            {isCreatingTraining ? (
              <CreateTrainingForm isAdmin={false} />
            ) : (
              <Grid container spacing={3}>
                {trainings?.map((training) => (
                  <Grid item xs={12} sm={6} md={4} key={training._id}>
                    <Card
                      className={styles.trainingCard}
                      onClick={() => handleTrainingClick(training._id)}>
                      <CardContent>
                        <Typography variant="h6">{training.title}</Typography>
                        <Typography variant="body2">{training.description}</Typography>
                        <Chip
                          label={training.category?.name}
                          className={styles.chip}
                          icon={iconMap[training.category?.iconName]}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      <Dialog open={photoDialogOpen} onClose={handleClosePhotoDialog}>
        <DialogTitle>Змінити фото профілю</DialogTitle>
        <DialogContent>
          <Box className={styles.photoDialogContent}>
            {photoPreview ? (
              <img src={photoPreview} alt="Попередній перегляд" className={styles.photoPreview} />
            ) : (
              <Avatar
                src={
                  currentCoach?.user?.avatar
                    ? `${API_URL}uploads/avatars/${currentCoach.user.avatar}`
                    : null
                }
                className={styles.photoPreview}>
                {currentCoach?.user?.firstName?.[0]}
                {currentCoach?.user?.lastName?.[0]}
              </Avatar>
            )}
            <input
              accept="image/*"
              type="file"
              id="photo-upload"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCamera />}
                className={styles.uploadButton}>
                Вибрати фото
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhotoDialog}>Скасувати</Button>
          <Button
            onClick={handlePhotoUpload}
            variant="contained"
            color="primary"
            disabled={!selectedFile}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CoachDashboard;
