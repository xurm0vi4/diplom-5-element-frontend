import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add as AddIcon,
  LocationOn,
  AccessTime,
  Group,
  Person,
} from '@mui/icons-material';
import { fetchAllTrainings } from '../../redux/slices/trainings';
import { fetchCategories } from '../../redux/slices/category';
import styles from './TrainingsPage.module.scss';

const TrainingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { trainings, loading, error } = useSelector((state) => state.trainings || {});
  const { categories, status: categoriesStatus } = useSelector((state) => state.category || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');
  const [filterCoach, setFilterCoach] = useState(searchParams.get('coach') || 'all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    // Отримуємо параметри з URL
    const category = searchParams.get('category');
    const coach = searchParams.get('coach');

    // Оновлюємо локальний стан
    if (category) setFilterCategory(category);
    if (coach) setFilterCoach(coach);

    // Завантажуємо тренування з фільтрами
    dispatch(fetchAllTrainings({ category, coach }));
    dispatch(fetchCategories());
  }, [dispatch, searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    console.log(newCategory);
    setFilterCategory(newCategory);
    setPage(1);

    // Оновлюємо URL з новим параметром категорії
    const params = new URLSearchParams(searchParams);
    if (newCategory === 'all') {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }
    setSearchParams(params);
  };

  const handleCoachChange = (e) => {
    const newCoach = e.target.value;
    setFilterCoach(newCoach);
    setPage(1);

    // Оновлюємо URL з новим параметром тренера
    const params = new URLSearchParams(searchParams);
    if (newCoach === 'all') {
      params.delete('coach');
    } else {
      params.set('coach', newCoach);
    }
    setSearchParams(params);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCreateTraining = () => {
    if (isAuthenticated) {
      navigate('/trainings/create');
    } else {
      navigate('/login', { state: { from: '/trainings/create' } });
    }
  };

  const handleTrainingClick = (trainingId) => {
    navigate(`/trainings/${trainingId}`);
  };

  if (loading || categoriesStatus === 'loading') {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження даних...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" color="error">
          Помилка: {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchAllTrainings())}
          className={styles.retryButton}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  // Фільтрація тренувань
  const filteredTrainings = trainings
    ? trainings.filter((training) => {
        // Фільтрація за пошуковим запитом
        const matchesSearch =
          training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          training.description.toLowerCase().includes(searchQuery.toLowerCase());

        // Фільтрація за категорією
        const matchesCategory = filterCategory === 'all' || training.category === filterCategory;

        // Фільтрація за тренером
        const matchesCoach = filterCoach === 'all' || training.coach?._id === filterCoach;

        return matchesSearch && matchesCategory && matchesCoach;
      })
    : [];

  // Пагінація
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainings = filteredTrainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  return (
    <div className={styles.trainingsPage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.pageTitle}>
          Тренування
        </Typography>

        {isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateTraining}
            className={styles.createButton}>
            Створити тренування
          </Button>
        )}
      </Box>

      <Paper className={styles.filtersSection}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Пошук тренувань..."
              value={searchQuery}
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
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Категорія</InputLabel>
              <Select
                labelId="category-label"
                value={filterCategory}
                onChange={handleCategoryChange}
                label="Категорія"
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                }>
                <MenuItem value="all">Всі категорії</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="coach-label">Тренер</InputLabel>
              <Select
                labelId="coach-label"
                value={filterCoach}
                onChange={handleCoachChange}
                label="Тренер"
                startAdornment={
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                }>
                <MenuItem value="all">Всі тренера</MenuItem>
                {trainings &&
                  [...new Set(trainings.map((t) => t.coach?._id))].map((coachId) => {
                    const coach = trainings.find((t) => t.coach?._id === coachId)?.coach;
                    if (!coach) return null;
                    return (
                      <MenuItem key={coachId} value={coachId}>
                        {coach.firstName} {coach.lastName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredTrainings.length === 0 ? (
        <Paper className={styles.noResultsSection}>
          <Typography variant="h6" className={styles.noResultsText}>
            Тренувань не знайдено
          </Typography>
          <Typography variant="body1" className={styles.noResultsSubtext}>
            Спробуйте змінити параметри пошуку або створіть нове тренування
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateTraining}
              className={styles.createButton}>
              Створити тренування
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={3} className={styles.trainingsGrid}>
            {currentTrainings.map((training) => (
              <Grid item xs={12} sm={6} md={4} key={training._id}>
                <Card
                  className={styles.trainingCard}
                  onClick={() => handleTrainingClick(training._id)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={training.image || 'https://via.placeholder.com/400x200?text=Тренування'}
                    alt={training.title}
                    className={styles.trainingImage}
                  />
                  <CardContent className={styles.trainingContent}>
                    <Typography variant="h6" component="h2" className={styles.trainingTitle}>
                      {training.title}
                    </Typography>

                    <Box className={styles.trainingInfo}>
                      <Box className={styles.infoItem}>
                        <LocationOn fontSize="small" />
                        <Typography variant="body2">{training.location}</Typography>
                      </Box>

                      <Box className={styles.infoItem}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">{training.duration} хв</Typography>
                      </Box>

                      <Box className={styles.infoItem}>
                        <Group fontSize="small" />
                        <Typography variant="body2">
                          {training.maxParticipants} учасників
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={styles.categoryContainer}>
                      <Chip
                        label={training.category}
                        color="primary"
                        size="small"
                        className={styles.categoryChip}
                      />
                    </Box>

                    <Typography variant="body2" className={styles.trainingDescription}>
                      {training.description}
                    </Typography>
                  </CardContent>
                  <CardActions className={styles.trainingActions}>
                    <Typography variant="h6" color="primary" className={styles.trainingPrice}>
                      {training.price} ₴
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={styles.detailsButton}>
                      Деталі
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box className={styles.paginationContainer}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default TrainingsPage;
