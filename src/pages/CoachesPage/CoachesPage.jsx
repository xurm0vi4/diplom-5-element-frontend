import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search, Star } from '@mui/icons-material';
import { fetchAllCoaches } from '../../redux/slices/coach';
import { fetchCategories } from '../../redux/slices/category';
import styles from './CoachesPage.module.scss';
import { API_URL } from '../../constants/api';
import emptyAvatar from '../../assets/empty-avatar.png';
import { iconMap } from '../../constants/mainPageData';
import { useNavigate } from 'react-router-dom';

const CoachesPage = () => {
  const dispatch = useDispatch();
  const { coaches = [], status } = useSelector((state) => state.coach || {});
  const { categories } = useSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllCoaches());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      searchTerm === '' ||
      coach.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === 'all' ||
      (coach.specializations &&
        coach.specializations.some((spec) => spec._id === selectedSpecialization));

    return matchesSearch && matchesSpecialization;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  if (status === 'loading') {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження тренерів...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" color="error">
          Помилка
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchAllCoaches())}
          className={styles.retryButton}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  return (
    <div className={styles.coachesPage}>
      <Typography variant="h4" component="h1" className={styles.pageTitle}>
        Наші тренери
      </Typography>

      <Box className={styles.searchContainer}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Пошук тренерів за ім'ям або спеціалізацією"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          className={styles.searchField}
        />
      </Box>

      <Box className={styles.specializationContainer}>
        <FormControl fullWidth>
          <InputLabel>Спеціалізація</InputLabel>
          <Select
            value={selectedSpecialization}
            onChange={handleSpecializationChange}
            label="Спеціалізація"
            className={styles.specializationField}>
            <MenuItem value="all">Всі спеціалізації</MenuItem>
            {categories?.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredCoaches.length === 0 ? (
        <Box className={styles.noResultsContainer}>
          <Typography variant="h6">
            Тренерів не знайдено. Спробуйте змінити пошуковий запит.
          </Typography>
        </Box>
      ) : (
        <Box className={styles.coachesGrid}>
          {filteredCoaches.map((coach) => (
            <Box key={coach._id} className={styles.coachCardWrapper}>
              <Card className={styles.coachCard}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    coach?.user?.avatar
                      ? `${API_URL}uploads/avatars/${coach.user.avatar}`
                      : emptyAvatar
                  }
                  alt={`${coach.user.firstName} ${coach.user.lastName}`}
                  className={styles.coachImage}
                />
                <CardContent className={styles.coachContent}>
                  <Box className={styles.coachNameContainer}>
                    <Typography variant="h6" component="div" className={styles.coachName}>
                      {coach.user.firstName} {coach.user.lastName}
                    </Typography>
                  </Box>

                  <Box className={styles.ratingContainer}>
                    <Rating
                      value={
                        coach?.reviews?.reduce((acc, review) => acc + review.rating, 0) /
                          (coach?.reviews?.length || 1) || 0
                      }
                      precision={0.5}
                      readOnly
                      icon={<Star fontSize="inherit" />}
                      className={styles.rating}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({coach.reviews ? coach.reviews.length : 0} відгуків)
                    </Typography>
                  </Box>

                  <Box className={styles.infoContainer}>
                    <Typography variant="body2" className={styles.infoItem}>
                      <strong>Вік:</strong> {coach.age || 'Не вказано'}
                    </Typography>
                    <Typography variant="body2" className={styles.infoItem}>
                      <strong>Досвід:</strong> {coach.experience || 'Не вказано'} років
                    </Typography>
                  </Box>

                  <Box className={styles.specializationContainer}>
                    {coach.specializations?.map((spec) => {
                      return (
                        <Chip
                          key={spec._id}
                          label={spec.name}
                          className={styles.specializationChip}
                          icon={iconMap[spec.iconName]}
                        />
                      );
                    })}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className={styles.coachDescription}>
                    {coach.description
                      ? `${coach.description.substring(0, 100)}...`
                      : 'Опис відсутній'}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={styles.viewButton}
                    onClick={() => navigate(`/coaches/${coach._id}`)}>
                    Детальніше
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
};

export default CoachesPage;
