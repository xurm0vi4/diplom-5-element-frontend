import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Rating, 
  Button, 
  Divider, 
  Chip, 
  CircularProgress, 
  TextField, 
  Card, 
  CardContent, 
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  Star, 
  Send, 
  PhotoCamera, 
  Delete, 
  Close 
} from '@mui/icons-material';
import { fetchCoachById, addReview, uploadCoachPhotos, deleteCoachPhoto } from '../../redux/slices/coach';
import styles from './CoachPage.module.scss';

const CoachPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCoach, loading, error } = useSelector((state) => state.coach || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});
  
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoDialogMode, setPhotoDialogMode] = useState('view'); // 'view' or 'delete'
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchCoachById(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/coaches');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setReviewError('Будь ласка, введіть текст відгуку');
      return;
    }
    
    if (rating < 1) {
      setReviewError('Будь ласка, встановіть рейтинг');
      return;
    }
    
    dispatch(addReview({ 
      id, 
      reviewData: { 
        text: reviewText, 
        rating 
      } 
    }))
      .unwrap()
      .then(() => {
        setReviewText('');
        setRating(5);
        setReviewError('');
        setReviewSuccess('Ваш відгук успішно додано!');
        setTimeout(() => setReviewSuccess(''), 3000);
      })
      .catch((err) => {
        setReviewError(err.message || 'Помилка при додаванні відгуку');
      });
  };

  const handlePhotoClick = (photo, mode = 'view') => {
    setPhotoPreview(photo);
    setPhotoDialogMode(mode);
    if (mode === 'delete') {
      setSelectedPhotoId(photo._id);
    }
    setPhotoDialogOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(files);
    
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('photos', file);
      });
      
      dispatch(uploadCoachPhotos({ id, photos: files }))
        .unwrap()
        .then(() => {
          setSelectedPhotos([]);
        })
        .catch((err) => {
          console.error('Помилка при завантаженні фото:', err);
        });
    }
  };

  const handleDeletePhoto = () => {
    if (selectedPhotoId) {
      dispatch(deleteCoachPhoto({ id, photoId: selectedPhotoId }))
        .unwrap()
        .then(() => {
          setPhotoDialogOpen(false);
          setSelectedPhotoId(null);
        })
        .catch((err) => {
          console.error('Помилка при видаленні фото:', err);
        });
    }
  };

  const closePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setPhotoPreview(null);
    setPhotoDialogMode('view');
    setSelectedPhotoId(null);
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження інформації про тренера...
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
          onClick={() => dispatch(fetchCoachById(id))}
          className={styles.retryButton}
        >
          Спробувати знову
        </Button>
      </Box>
    );
  }

  if (!currentCoach) {
    return (
      <Box className={styles.notFoundContainer}>
        <Typography variant="h6">
          Тренера не знайдено
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleBack}
          className={styles.backButton}
        >
          Повернутися до списку тренерів
        </Button>
      </Box>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isCoachOwner = user?._id === currentCoach.userId;

  return (
    <div className={styles.coachPage}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleBack}
        className={styles.backButton}
      >
        Назад до списку тренерів
      </Button>

      <Paper className={styles.coachHeader}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className={styles.avatarContainer}>
            <Avatar 
              src={currentCoach.photos && currentCoach.photos.length > 0 ? currentCoach.photos[0] : null}
              alt={currentCoach.name}
              className={styles.avatar}
            />
          </Grid>
          <Grid item xs={12} md={8} className={styles.infoContainer}>
            <Typography variant="h4" component="h1" className={styles.coachName}>
              {currentCoach.name}
            </Typography>
            
            <Box className={styles.ratingContainer}>
              <Rating 
                value={currentCoach.rating || 0} 
                precision={0.5} 
                readOnly 
                icon={<Star fontSize="inherit" />}
                className={styles.rating}
              />
              <Typography variant="body1">
                ({currentCoach.reviews ? currentCoach.reviews.length : 0} відгуків)
              </Typography>
            </Box>
            
            <Box className={styles.specializationContainer}>
              {currentCoach.specialization && (
                <Chip 
                  label={currentCoach.specialization} 
                  color="primary" 
                  className={styles.specializationChip}
                />
              )}
            </Box>
            
            <Typography variant="body1" className={styles.description}>
              {currentCoach.description || 'Опис відсутній'}
            </Typography>
            
            {(isAdmin || isCoachOwner) && (
              <Box className={styles.adminActions}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate(`/coaches/${id}/edit`)}
                >
                  Редагувати профіль
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper className={styles.photosSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2">
            Фотографії
          </Typography>
          
          {(isAdmin || isCoachOwner) && (
            <Button 
              variant="contained" 
              color="primary"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Завантажити фото
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </Button>
          )}
        </Box>
        
        {currentCoach.photos && currentCoach.photos.length > 0 ? (
          <Grid container spacing={2} className={styles.photosGrid}>
            {currentCoach.photos.map((photo) => (
              <Grid item xs={6} sm={4} md={3} key={photo._id}>
                <Card className={styles.photoCard}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={photo}
                    alt={`Фото тренера ${currentCoach.name}`}
                    className={styles.photoImage}
                    onClick={() => handlePhotoClick(photo)}
                  />
                  {(isAdmin || isCoachOwner) && (
                    <IconButton 
                      className={styles.deletePhotoButton}
                      onClick={() => handlePhotoClick(photo, 'delete')}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" className={styles.noPhotosText}>
            Фотографій поки немає
          </Typography>
        )}
      </Paper>

      <Paper className={styles.reviewsSection}>
        <Typography variant="h5" component="h2" className={styles.sectionTitle}>
          Відгуки
        </Typography>
        
        {isAuthenticated ? (
          <Box component="form" onSubmit={handleReviewSubmit} className={styles.reviewForm}>
            <Typography variant="subtitle1" className={styles.reviewFormTitle}>
              Залишити відгук
            </Typography>
            
            {reviewError && (
              <Alert severity="error" className={styles.reviewAlert}>
                {reviewError}
              </Alert>
            )}
            
            {reviewSuccess && (
              <Alert severity="success" className={styles.reviewAlert}>
                {reviewSuccess}
              </Alert>
            )}
            
            <Box className={styles.ratingInput}>
              <Typography component="legend">Ваш рейтинг:</Typography>
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                icon={<Star fontSize="inherit" />}
                className={styles.ratingStars}
              />
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Ваш відгук"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className={styles.reviewTextField}
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              endIcon={<Send />}
              className={styles.submitButton}
            >
              Надіслати відгук
            </Button>
          </Box>
        ) : (
          <Alert severity="info" className={styles.loginAlert}>
            Щоб залишити відгук, будь ласка, <Button color="primary" onClick={() => navigate('/login')}>увійдіть</Button> або <Button color="primary" onClick={() => navigate('/register')}>зареєструйтесь</Button>
          </Alert>
        )}
        
        <Divider className={styles.divider} />
        
        {currentCoach.reviews && currentCoach.reviews.length > 0 ? (
          <Box className={styles.reviewsList}>
            {currentCoach.reviews.map((review) => (
              <Paper key={review._id} className={styles.reviewItem}>
                <Box className={styles.reviewHeader}>
                  <Typography variant="subtitle1" className={styles.reviewerName}>
                    {review.userName || 'Анонімний користувач'}
                  </Typography>
                  <Rating 
                    value={review.rating} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                    icon={<Star fontSize="inherit" />}
                    className={styles.reviewRating}
                  />
                </Box>
                <Typography variant="body2" className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                </Typography>
                <Typography variant="body1" className={styles.reviewText}>
                  {review.text}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" className={styles.noReviewsText}>
            Поки немає відгуків. Будьте першим!
          </Typography>
        )}
      </Paper>

      {/* Діалог для перегляду/видалення фото */}
      <Dialog
        open={photoDialogOpen}
        onClose={closePhotoDialog}
        maxWidth="md"
        fullWidth
        className={styles.photoDialog}
      >
        <DialogTitle className={styles.photoDialogTitle}>
          {photoDialogMode === 'view' ? 'Перегляд фото' : 'Видалення фото'}
          <IconButton
            aria-label="close"
            onClick={closePhotoDialog}
            className={styles.closeButton}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.photoDialogContent}>
          {photoPreview && (
            <img 
              src={photoPreview} 
              alt="Фото тренера" 
              className={styles.photoPreview}
            />
          )}
        </DialogContent>
        <DialogActions className={styles.photoDialogActions}>
          {photoDialogMode === 'delete' ? (
            <>
              <Button onClick={closePhotoDialog} color="primary">
                Скасувати
              </Button>
              <Button onClick={handleDeletePhoto} color="error" variant="contained">
                Видалити
              </Button>
            </>
          ) : (
            <Button onClick={closePhotoDialog} color="primary">
              Закрити
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoachPage;
