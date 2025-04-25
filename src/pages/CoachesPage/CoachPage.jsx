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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import {
  fetchCoachById,
  updateCoach,
  deleteCoachPhoto,
  addReview,
  uploadCoachPhotos,
} from '../../redux/slices/coach';
import { canEditCoach } from '../../utils/roleUtils';
import styles from './CoachPage.module.scss';
import { API_URL } from '../../constants/api';

const CoachPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.auth);
  const { currentCoach: coach, status, categories } = useSelector((state) => state.coach);
  console.log(coach);
  const canEdit = canEditCoach(user, coach);

  const [isEditing, setIsEditing] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoDialogMode, setPhotoDialogMode] = useState('view'); // 'view' or 'delete'
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    specialization: [],
    experience: '',
    description: '',
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
      setEditForm({
        firstName: coach.user.firstName || '',
        lastName: coach.user.lastName || '',
        age: coach.age || '',
        specialization: coach.specialization || [],
        experience: coach.experience || '',
        description: coach.description || '',
      });
    }
  }, [coach]);

  const handleBack = () => {
    navigate('/coaches');
  };

  const handleEditSubmit = async (data) => {
    try {
      const coachData = {
        id,
        description: data.description,
        specialization: data.specialization,
        experience: data.experience,
        age: data.age,
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      };
      await dispatch(updateCoach(coachData)).unwrap();
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
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      try {
        await dispatch(uploadCoachPhotos({ id, photos: files })).unwrap();
        setPhotoPreview(null);
        setPhotoDialogOpen(false);
      } catch (error) {
        console.error('Помилка при завантаженні фото:', error);
      }
    }
  };

  const handlePhotoDelete = async (filename) => {
    try {
      await dispatch(deleteCoachPhoto({ id, filename })).unwrap();
      setPhotoDialogOpen(false);
      setSelectedPhotoId(null);
    } catch (error) {
      console.error('Помилка при видаленні фото:', error);
    }
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
              alt={`${coach.user.firstName} ${coach.user.lastName}`}
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
              <Box
                component="form"
                onSubmit={handleEditSubmit(editForm)}
                className={styles.editForm}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  {...registerReview('firstName')}
                  margin="normal"
                  className={styles.input}
                />
                <TextField
                  fullWidth
                  label="Прізвище"
                  {...registerReview('lastName')}
                  margin="normal"
                  className={styles.input}
                />
                <Grid item xs={12}>
                  <FormControl fullWidth className={styles.input}>
                    <InputLabel>Спеціалізація</InputLabel>
                    <Select
                      multiple
                      value={editForm.specialization}
                      onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
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
                </Grid>
                <TextField
                  fullWidth
                  label="Досвід (років)"
                  type="number"
                  {...registerReview('experience', {
                    min: { value: 0, message: "Досвід не може бути від'ємним" },
                    pattern: { value: /^[0-9]+$/, message: 'Введіть ціле число' },
                  })}
                  error={!!reviewErrors.experience}
                  helperText={reviewErrors.experience?.message}
                  margin="normal"
                  className={styles.input}
                />
                <TextField
                  fullWidth
                  label="Вік"
                  type="number"
                  {...registerReview('age', {
                    min: { value: 18, message: 'Вік не може бути менше 18 років' },
                    max: { value: 100, message: 'Вік не може бути більше 100 років' },
                    pattern: { value: /^[0-9]+$/, message: 'Введіть ціле число' },
                  })}
                  error={!!reviewErrors.age}
                  helperText={reviewErrors.age?.message}
                  margin="normal"
                  className={styles.input}
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
                  <Typography variant="body1">
                    ({coach.reviews ? coach.reviews.length : 0} відгуків)
                  </Typography>
                </Box>

                <Box className={styles.specializationContainer}>
                  {coach.specialization?.map((spec) => {
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

                <Box className={styles.infoContainer}>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Вік:</strong> {coach.age || 'Не вказано'}
                  </Typography>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Досвід:</strong> {coach.experience || 'Не вказано'} років
                  </Typography>
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
                    alt={`Фото тренера ${coach.user.firstName} ${coach.user.lastName}`}
                    className={styles.photoImage}
                    onClick={() => handlePhotoClick(photo)}
                  />
                  {canEdit && (
                    <IconButton
                      className={styles.deletePhotoButton}
                      onClick={() => handlePhotoDelete(photo)}>
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
                onClick={() => handlePhotoDelete(photoPreview)}
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
