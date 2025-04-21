import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
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
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Send,
  PhotoCamera,
  Delete,
  Close,
  Edit as EditIcon,
} from '@mui/icons-material';
import { fetchCoachById, updateCoach, deleteCoachPhoto, addReview } from '../../redux/slices/coach';
import { canEditCoach } from '../../utils/roleUtils';
import styles from './CoachPage.module.scss';
import { API_URL } from '../../constants/api';

const CoachPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.auth);
  const { currentCoach: coach, status } = useSelector((state) => state.coach);
  console.log(coach);
  const canEdit = canEditCoach(user, coach);

  const [isEditing, setIsEditing] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoDialogMode, setPhotoDialogMode] = useState('view'); // 'view' or 'delete'
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      specialization: '',
      experience: '',
    },
  });

  const {
    register: registerReview,
    handleSubmit: handleSubmitReview,
    reset: resetReview,
    setValue: setReviewValue,
    watch: watchReview,
    formState: { errors: reviewErrors },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCoachById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (coach) {
      resetEdit({
        name: coach.name || '',
        description: coach.description || '',
        specialization: coach.specialization || '',
        experience: coach.experience || '',
      });
    }
  }, [coach, resetEdit]);

  const handleBack = () => {
    navigate('/coaches');
  };

  const handleEditSubmit = async (data) => {
    try {
      await dispatch(updateCoach({ id, ...data })).unwrap();
      setIsEditing(false);
      dispatch(fetchCoachById(id));
    } catch (error) {
      console.error('Помилка при оновленні профілю:', error);
    }
  };

  const onSubmitReview = async (data) => {
    try {
      await dispatch(
        addReview({
          id,
          reviewData: {
            comment: data.comment,
            rating: data.rating,
          },
        }),
      ).unwrap();

      resetReview();
      setReviewSuccess('Ваш відгук успішно додано!');
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
      setReviewError(error.message || 'Помилка при додаванні відгуку');
    }
  };

  const handlePhotoClick = (photo, mode = 'view') => {
    console.log(photo);
    setPhotoPreview(photo);
    setPhotoDialogMode(mode);
    if (mode === 'delete') {
      setSelectedPhotoId(photo._id);
    }
    setPhotoDialogOpen(true);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoDialogOpen(true);
    }
  };

  const handlePhotoDelete = (photoId) => {
    setSelectedPhotoId(photoId);
    setPhotoDialogMode('delete');
    setPhotoDialogOpen(true);
  };

  const closePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setPhotoPreview(null);
    setPhotoDialogMode('view');
    setSelectedPhotoId(null);
  };

  if (status === 'loading') {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження інформації про тренера...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" color="error">
          Помилка: {status}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchCoachById(id))}
          className={styles.retryButton}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  if (!coach) {
    return (
      <Box className={styles.notFoundContainer}>
        <Typography variant="h6">Тренера не знайдено</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          className={styles.backButton}>
          Повернутися до списку тренерів
        </Button>
      </Box>
    );
  }
  return (
    <div className={styles.coachPage}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} className={styles.backButton}>
        Назад до списку тренерів
      </Button>

      <Paper className={styles.coachHeader}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className={styles.avatarContainer}>
            <Avatar
              src={coach.photos && coach.photos.length > 0 ? `${API_URL}${coach.photos[0]}` : null}
              alt={coach.name}
              className={styles.avatar}
              onClick={() => console.log(coach.photos[0])}
            />
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                className={styles.editButton}>
                Редагувати профіль
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={8} className={styles.infoContainer}>
            {isEditing ? (
              <Box component="form" onSubmit={handleSubmitEdit(handleEditSubmit)}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  {...registerEdit('name', { required: "Ім'я обов'язкове" })}
                  error={!!editErrors.name}
                  helperText={editErrors.name?.message}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Опис"
                  {...registerEdit('description')}
                  margin="normal"
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Спеціалізація"
                  {...registerEdit('specialization')}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Досвід (років)"
                  type="number"
                  {...registerEdit('experience', {
                    min: { value: 0, message: "Досвід не може бути від'ємним" },
                    pattern: { value: /^[0-9]+$/, message: 'Введіть ціле число' },
                  })}
                  error={!!editErrors.experience}
                  helperText={editErrors.experience?.message}
                  margin="normal"
                />
                <Box className={styles.editActions}>
                  <Button variant="contained" color="primary" type="submit">
                    Зберегти
                  </Button>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Скасувати
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h4" component="h1" className={styles.coachName}>
                  {coach.name}
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
                  <Typography variant="body1">
                    ({coach.reviews ? coach.reviews.length : 0} відгуків)
                  </Typography>
                </Box>

                <Box className={styles.specializationContainer}>
                  {coach.specialization && (
                    <Chip
                      label={coach.specialization}
                      color="primary"
                      className={styles.specializationChip}
                    />
                  )}
                </Box>

                <Typography variant="body1" className={styles.description}>
                  {coach.description || 'Опис відсутній'}
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper className={styles.photosSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" component="h2">
            Фотографії
          </Typography>

          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              component="label"
              startIcon={<PhotoCamera />}>
              Завантажити фото
              <input type="file" hidden multiple accept="image/*" onChange={handlePhotoUpload} />
            </Button>
          )}
        </Box>

        {coach.photos && coach.photos.length > 0 ? (
          <Grid container spacing={2} className={styles.photosGrid}>
            {coach.photos.map((photo) => (
              <Grid item xs={6} sm={4} md={3} key={photo._id}>
                <Card className={styles.photoCard}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={photo.startsWith('http') ? photo : `${API_URL}${photo}`}
                    alt={`Фото тренера ${coach.name}`}
                    className={styles.photoImage}
                    onClick={() => handlePhotoClick(photo)}
                  />
                  {canEdit && (
                    <IconButton
                      className={styles.deletePhotoButton}
                      onClick={() => handlePhotoDelete(photo._id)}>
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

        {user ? (
          <Box
            component="form"
            onSubmit={handleSubmitReview(onSubmitReview)}
            className={styles.reviewForm}>
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
                value={watchReview('rating')}
                onChange={(event, newValue) => {
                  setReviewValue('rating', newValue);
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
              {...registerReview('comment', { required: "Текст відгуку обов'язковий" })}
              error={!!reviewErrors.comment}
              helperText={reviewErrors.comment?.message}
              className={styles.reviewTextField}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<Send />}
              className={styles.submitButton}>
              Надіслати відгук
            </Button>
          </Box>
        ) : (
          <Alert severity="info" className={styles.loginAlert}>
            Щоб залишити відгук, будь ласка,{' '}
            <Button color="primary" onClick={() => navigate('/login')}>
              увійдіть
            </Button>{' '}
            або{' '}
            <Button color="primary" onClick={() => navigate('/register')}>
              зареєструйтесь
            </Button>
          </Alert>
        )}

        <Divider className={styles.divider} />

        {coach.reviews && coach.reviews.length > 0 ? (
          <Box className={styles.reviewsList}>
            {coach.reviews.map((review) => (
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
                  {review.comment}
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
        className={styles.photoDialog}>
        <DialogTitle className={styles.photoDialogTitle}>
          {photoDialogMode === 'view' ? 'Перегляд фото' : 'Видалення фото'}
          <IconButton aria-label="close" onClick={closePhotoDialog} className={styles.closeButton}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.photoDialogContent}>
          {photoPreview && (
            <img
              src={photoPreview.startsWith('http') ? photoPreview : `${API_URL}${photoPreview}`}
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
              <Button
                onClick={() => {
                  dispatch(deleteCoachPhoto({ id, photoId: selectedPhotoId }));
                  closePhotoDialog();
                }}
                color="error"
                variant="contained">
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
