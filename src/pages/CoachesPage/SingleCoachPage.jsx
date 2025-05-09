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
  updateCoachReview,
  deleteCoachReview,
  uploadCoachPhotos,
  deleteCoach,
} from '../../redux/slices/coach';
import { canEditCoach, isAdmin } from '../../utils/roleUtils';
import { fetchCategories } from '../../redux/slices/category';
import styles from './SingleCoachPage.module.scss';
import { API_URL } from '../../constants/api';
import emptyAvatar from '../../assets/empty-avatar.png';
import { iconMap } from '../../constants/mainPageData';

const CoachPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.auth);
  const { currentCoach: coach, status } = useSelector((state) => state.coach);
  const { categories } = useSelector((state) => state.category);

  const [isEditing, setIsEditing] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoDialogMode, setPhotoDialogMode] = useState('view');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    specializations: [],
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

  const [editReviewDialog, setEditReviewDialog] = useState(false);
  const [deleteReviewDialog, setDeleteReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchCoachById(id));
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (coach) {
      setEditForm({
        firstName: coach.user.firstName || '',
        lastName: coach.user.lastName || '',
        age: coach.age || '',
        specializations: coach.specializations?.map((spec) => spec._id) || [],
        experience: coach.experience || '',
        description: coach.description || '',
      });
    }
  }, [coach]);

  const handleBack = () => {
    navigate('/coaches');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const coachData = {
        id,
        description: editForm.description,
        specializations:
          editForm.specializations.map((id) => categories.find((cat) => cat._id === id)) || [],
        experience: editForm.experience,
        age: editForm.age,
        user: {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
        },
      };
      await dispatch(updateCoach({ id, coachData })).unwrap();
      dispatch(fetchCoachById(id));
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка при оновленні:', error);
      setFormError(error.message || 'Помилка при оновленні профілю');
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
      await dispatch(fetchCoachById(id)).unwrap();
    } catch (error) {
      setReviewError(error.message || 'Помилка при додаванні відгуку');
    }
  };

  const handlePhotoClick = (photo, mode = 'view') => {
    setPhotoPreview(photo);
    setPhotoDialogMode(mode);
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

  const handlePhotoDelete = async (photo) => {
    try {
      await dispatch(deleteCoachPhoto({ id, photoId: photo })).unwrap();
      setPhotoDialogOpen(false);
      await dispatch(fetchCoachById(id)).unwrap();
    } catch (error) {
      console.error('Помилка при видаленні фото:', error);
    }
  };

  const closePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setPhotoPreview(null);
    setPhotoDialogMode('view');
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCoach(id)).unwrap();
      navigate('/coaches');
    } catch (error) {
      setFormError(error.message || 'Помилка при видаленні тренера');
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setReviewValue('rating', review.rating);
    setReviewValue('comment', review.comment);
    setEditReviewDialog(true);
  };

  const handleUpdateReview = async (data) => {
    try {
      await dispatch(
        updateCoachReview({
          id,
          reviewId: selectedReview._id,
          reviewData: {
            comment: data.comment,
            rating: data.rating,
          },
        }),
      ).unwrap();

      setEditReviewDialog(false);
      setReviewSuccess('Відгук успішно оновлено!');
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
      setReviewError(error.message || 'Помилка при оновленні відгуку');
    }
  };

  const handleDeleteReview = async () => {
    try {
      await dispatch(
        deleteCoachReview({
          id,
          reviewId: selectedReview._id,
        }),
      ).unwrap();

      setDeleteReviewDialog(false);
      setReviewSuccess('Відгук успішно видалено!');
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (error) {
      setReviewError(error.message || 'Помилка при видаленні відгуку');
    }
  };

  const handleSpecializationChange = (e) => {
    setEditForm({ ...editForm, specializations: e.target.value });
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

  const isAdminFlag = isAdmin(user);
  const canEdit = canEditCoach(user, coach);

  return (
    <div className={styles.coachPage}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} className={styles.backButton}>
        Назад до списку тренерів
      </Button>

      <Paper className={styles.coachHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarContainer}>
            <Avatar
              src={
                coach?.user?.avatar ? `${API_URL}uploads/avatars/${coach.user.avatar}` : emptyAvatar
              }
              alt={`${coach.user.firstName} ${coach.user.lastName}`}
              className={styles.avatar}>
              {coach.user.firstName?.[0]}
              {coach.user.lastName?.[0]}
            </Avatar>
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
                className={styles.editButton}>
                Редагувати профіль
              </Button>
            )}
          </div>
          <div className={styles.infoContainer}>
            {formError && (
              <Alert severity="error" className={styles.alert}>
                {formError}
              </Alert>
            )}

            {isEditing ? (
              <Box component="form" onSubmit={handleEditSubmit} className={styles.editForm}>
                <Box className={styles.formRow}>
                  <TextField
                    fullWidth
                    label="Ім'я"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className={styles.input}
                  />
                  <TextField
                    fullWidth
                    label="Прізвище"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className={styles.input}
                  />
                </Box>

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

                <Box className={styles.formRow}>
                  <FormControl fullWidth className={styles.input}>
                    <InputLabel>Спеціалізація</InputLabel>
                    <Select
                      multiple
                      value={editForm.specializations}
                      onChange={handleSpecializationChange}
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
                </Box>

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

                <Box className={styles.infoContainer}>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Вік:</strong> {coach.age || 'Не вказано'}
                  </Typography>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Досвід:</strong> {coach.experience || 'Не вказано'} років
                  </Typography>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Email:</strong> {coach.user.email}
                  </Typography>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Дата реєстрації:</strong>{' '}
                    {new Date(coach.createdAt).toLocaleDateString('uk-UA')}
                  </Typography>
                  <Typography variant="body1" className={styles.infoItem}>
                    <strong>Останнє оновлення:</strong>{' '}
                    {new Date(coach.updatedAt).toLocaleDateString('uk-UA')}
                  </Typography>
                </Box>

                <Box className={styles.specializationContainer}>
                  {coach.specializations?.map((spec) => (
                    <Chip
                      key={spec._id}
                      label={spec.name}
                      className={styles.specializationChip}
                      icon={iconMap[spec.iconName]}
                    />
                  ))}
                </Box>

                <Typography variant="body1" className={styles.description}>
                  {coach.description || 'Опис відсутній'}
                </Typography>
              </>
            )}
          </div>
        </div>
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
          <div className={styles.photosGrid}>
            {coach.photos.map((photo) => (
              <div key={photo} className={styles.photoCard}>
                <Card className={styles.photoCard}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={photo.startsWith('http') ? photo : `${API_URL}uploads/coaches/${photo}`}
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
              </div>
            ))}
          </div>
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
                  <Box className={styles.reviewUser}>
                    <Typography variant="subtitle1" className={styles.reviewerName}>
                      {review.user.firstName} {review.user.lastName}
                    </Typography>
                    <Typography variant="body2" className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                    </Typography>
                  </Box>
                  <Box className={styles.reviewActions}>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                      icon={<Star fontSize="inherit" />}
                      className={styles.reviewRating}
                    />
                    {(user?._id === review.user._id || user?.role === 'admin') && (
                      <Box className={styles.reviewButtons}>
                        {user?._id === review.user._id && (
                          <IconButton
                            size="small"
                            onClick={() => handleEditReview(review)}
                            className={styles.editButton}>
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedReview(review);
                            setDeleteReviewDialog(true);
                          }}
                          className={styles.deleteButton}>
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
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

      <Dialog open={editReviewDialog} onClose={() => setEditReviewDialog(false)}>
        <DialogTitle>Редагувати відгук</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReviewDialog(false)}>Скасувати</Button>
          <Button
            onClick={handleSubmitReview(handleUpdateReview)}
            variant="contained"
            color="primary">
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteReviewDialog} onClose={() => setDeleteReviewDialog(false)}>
        <DialogTitle>Видалити відгук</DialogTitle>
        <DialogContent>
          <Typography>Ви впевнені, що хочете видалити цей відгук?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteReviewDialog(false)}>Скасувати</Button>
          <Button onClick={handleDeleteReview} variant="contained" color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

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
      {isAdminFlag && (
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() => setIsDeleteDialogOpen(true)}
          className={styles.deleteButton}
          style={{ marginTop: 20 }}>
          Видалити тренера
        </Button>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className={styles.deleteDialog}>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <Typography>
            Ви впевнені, що хочете видалити тренера {coach.user.firstName} {coach.user.lastName}? Цю
            дію неможливо скасувати.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Скасувати</Button>
          <Button onClick={handleDelete} color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoachPage;
