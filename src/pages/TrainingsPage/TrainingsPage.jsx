import { useEffect, useState } from 'react';
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
  Avatar,
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
import { fetchAllCoaches } from '../../redux/slices/coach';
import styles from './TrainingsPage.module.scss';
import { isAdmin, isCoach } from '../../utils/roleUtils';
import { API_URL } from '../../constants/api';
import emptyAvatar from '../../assets/empty-avatar.png';
import placeholderImage from '../../assets/placeholder-image.jpg';

const TrainingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { trainings, status } = useSelector((state) => state.training);
  const { categories = [], status: categoriesStatus } = useSelector((state) => state.category);
  const { coaches = [], status: coachesStatus } = useSelector((state) => state.coach);
  const { data } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all');
  const [filterCoach, setFilterCoach] = useState(searchParams.get('coach') || 'all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const canCreateTraining = isAdmin(data) || isCoach(data);

  useEffect(() => {
    const category = searchParams.get('category');
    const coach = searchParams.get('coach');

    if (category) setFilterCategory(category);
    if (coach) setFilterCoach(coach);

    dispatch(fetchAllTrainings({ category, coach }));
    dispatch(fetchCategories());
    dispatch(fetchAllCoaches());
  }, [dispatch, searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
    dispatch(fetchAllTrainings({ category: event.target.value, coach: filterCoach }));
  };

  const handleCoachChange = (event) => {
    setFilterCoach(event.target.value);
    dispatch(fetchAllTrainings({ category: filterCategory, coach: event.target.value }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCreateTraining = () => {
    if (isAdmin(data)) {
      navigate('/admin');
    } else if (isCoach(data)) {
      navigate('/coach-dashboard');
    } else {
      navigate('/login', { state: { from: '/trainings/create' } });
    }
  };

  const handleTrainingClick = (trainingId) => {
    navigate(`/trainings/${trainingId}`);
  };

  if (status === 'loading' || categoriesStatus === 'loading' || coachesStatus === 'loading') {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження даних...
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
          onClick={() => dispatch(fetchAllTrainings())}
          className={styles.retryButton}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  const filteredTrainings =
    trainings?.filter((training) => {
      const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || training.category?._id === filterCategory;
      const matchesCoach = filterCoach === 'all' || training.coach?._id === filterCoach;

      return matchesSearch && matchesCategory && matchesCoach;
    }) || [];

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

        {canCreateTraining && (
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
                  <MenuItem key={category._id} value={category._id}>
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
                {coaches.map((coach) => (
                  <MenuItem key={coach._id} value={coach._id}>
                    {coach.user.firstName} {coach.user.lastName}
                  </MenuItem>
                ))}
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
          {canCreateTraining && (
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
          <Box className={styles.trainingsGrid}>
            {currentTrainings.map((training) => (
              <Box key={training._id} className={styles.trainingCardWrapper}>
                <Card
                  className={styles.trainingCard}
                  onClick={() => handleTrainingClick(training._id)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      training.photos?.[0]
                        ? `${API_URL}uploads/trainings/${training.photos[0]}`
                        : placeholderImage
                    }
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
                        <Typography variant="body2">{training.capacity} учасників</Typography>
                      </Box>
                    </Box>

                    <Box className={styles.categoryContainer}>
                      <Chip
                        label={training.category.name}
                        color="primary"
                        size="small"
                        className={styles.categoryChip}
                      />
                    </Box>

                    <Box className={styles.coachContainer}>
                      <Avatar
                        src={
                          training?.coach?.user?.avatar
                            ? `${API_URL}uploads/avatars/${training.coach.user.avatar}`
                            : emptyAvatar
                        }
                        alt={`${training.coach?.user?.firstName} ${training.coach?.user?.lastName}`}
                        className={styles.coachAvatar}
                      />
                      <Typography variant="body2" className={styles.coachName}>
                        {training.coach?.user?.firstName} {training.coach?.user?.lastName}
                      </Typography>
                    </Box>

                    <Typography variant="body2" className={styles.trainingDescription}>
                      {training.description}
                    </Typography>
                  </CardContent>
                  <CardActions className={styles.trainingActions}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={styles.detailsButton}>
                      Деталі
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>

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
