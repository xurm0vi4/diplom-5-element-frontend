import React, { useEffect, useState } from 'react';
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
  Pagination,
} from '@mui/material';
import { Search, Star } from '@mui/icons-material';
import { fetchAllCoaches } from '../../redux/slices/coach';
import { fetchCategories } from '../../redux/slices/category';
import styles from './CoachesPage.module.scss';
import { API_URL } from '../../constants/api';

const CoachesPage = () => {
  const dispatch = useDispatch();
  const { coaches = [], status } = useSelector((state) => state.coach || {});
  const { categories } = useSelector((state) => state.category);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const coachesPerPage = 6;
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

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
      coach.specialization?.some((spec) => spec === selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  const indexOfLastCoach = page * coachesPerPage;
  const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
  const currentCoaches = filteredCoaches.slice(indexOfFirstCoach, indexOfLastCoach);
  const pageCount = Math.ceil(filteredCoaches.length / coachesPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
    setPage(1);
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
        <TextField
          select
          value={selectedSpecialization}
          onChange={handleSpecializationChange}
          className={styles.specializationField}>
          <option value="all">Всі спеціалізації</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </TextField>
      </Box>

      {filteredCoaches.length === 0 ? (
        <Box className={styles.noResultsContainer}>
          <Typography variant="h6">
            Тренерів не знайдено. Спробуйте змінити пошуковий запит.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} className={styles.coachesGrid}>
            {currentCoaches.map((coach) => (
              <Grid item xs={12} sm={6} md={4} key={coach._id}>
                <Card className={styles.coachCard}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      coach.photos && coach.photos.length > 0
                        ? `${API_URL}${coach.photos[0]}`
                        : 'https://via.placeholder.com/300x200?text=Тренер'
                    }
                    alt={coach.user.firstName}
                    className={styles.coachImage}
                  />
                  <CardContent className={styles.coachContent}>
                    <Typography variant="h6" component="div" className={styles.coachName}>
                      {coach.user.firstName} {coach.user.lastName}
                    </Typography>

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

                    <Box className={styles.specializationContainer}>
                      {coach?.specialization?.map((spec) => {
                        const category = categories?.find((cat) => cat._id === spec);
                        return (
                          category && (
                            <Chip
                              key={spec}
                              label={category.name}
                              className={styles.specializationChip}
                            />
                          )
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
                      href={`/coaches/${coach._id}`}>
                      Детальніше
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Box className={styles.paginationContainer}>
              <Pagination
                count={pageCount}
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

export default CoachesPage;
