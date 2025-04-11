import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { 
  Search, 
  FilterList,
  Add as AddIcon,
  LocationOn,
  AccessTime,
  Group
} from '@mui/icons-material';
import { fetchAllTrainings } from '../../redux/slices/trainings';
import styles from './TrainingsPage.module.scss';

const TrainingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trainings, loading, error } = useSelector((state) => state.trainings || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
  // Категорії тренувань
  const categories = [
    { id: 'all', name: 'Всі категорії' },
    { id: 'fitness', name: 'Фітнес' },
    { id: 'yoga', name: 'Йога' },
    { id: 'dance', name: 'Танці' },
    { id: 'martial_arts', name: 'Бойові мистецтва' },
    { id: 'swimming', name: 'Плавання' },
    { id: 'team_sports', name: 'Командні види спорту' }
  ];
  
  // Локації тренувань
  const locations = [
    { id: 'all', name: 'Всі локації' },
    { id: 'kyiv', name: 'Київ' },
    { id: 'lviv', name: 'Львів' },
    { id: 'odesa', name: 'Одеса' },
    { id: 'kharkiv', name: 'Харків' },
    { id: 'dnipro', name: 'Дніпро' }
  ];

  useEffect(() => {
    // Завантаження тренувань при першому рендері
    dispatch(fetchAllTrainings());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Скидаємо на першу сторінку при зміні пошуку
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setPage(1);
  };

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
    setPage(1);
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

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження тренувань...
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
          className={styles.retryButton}
        >
          Спробувати знову
        </Button>
      </Box>
    );
  }

  // Фільтрація тренувань
  const filteredTrainings = trainings ? trainings.filter(training => {
    // Фільтрація за пошуковим запитом
    const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         training.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фільтрація за категорією
    const matchesCategory = filterCategory === 'all' || training.category === filterCategory;
    
    // Фільтрація за локацією
    const matchesLocation = filterLocation === 'all' || training.location === filterLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  }) : [];
  
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
            className={styles.createButton}
          >
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
                }
              >
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
              <InputLabel id="location-label">Локація</InputLabel>
              <Select
                labelId="location-label"
                value={filterLocation}
                onChange={handleLocationChange}
                label="Локація"
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                }
              >
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
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
          {isAuthenticated && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              onClick={handleCreateTraining}
              className={styles.createButton}
            >
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
                  onClick={() => handleTrainingClick(training._id)}
                >
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
                        <Typography variant="body2">
                          {training.location}
                        </Typography>
                      </Box>
                      
                      <Box className={styles.infoItem}>
                        <AccessTime fontSize="small" />
                        <Typography variant="body2">
                          {training.duration} хв
                        </Typography>
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
                      className={styles.detailsButton}
                    >
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
