import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardMedia,
  Chip,
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
  Avatar,
  Rating,
  Divider,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Group,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack,
  PhotoCamera,
  Person,
  Star,
  Send,
} from '@mui/icons-material';
import {
  fetchTrainingById,
  updateTraining,
  uploadTrainingPhotos,
  deleteTrainingPhoto,
  addTrainingReview,
  updateTrainingReview,
  deleteTrainingReview,
  deleteTraining,
} from '../../redux/slices/trainings';
import { fetchCategories } from '../../redux/slices/category';
import { canEditTraining, isAdmin } from '../../utils/roleUtils';
import styles from './SingleTrainingPage.module.scss';
import { API_URL } from '../../constants/api';
import { useForm } from 'react-hook-form';

const TrainingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTraining: training, status } = useSelector((state) => state.training);
  const { categories = [], status: categoriesStatus } = useSelector((state) => state.category);
  const { data: user } = useSelector((state) => state.auth);

  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    coach: '',
    location: '',
    duration: '',
    capacity: '',
    isActive: true,
    schedule: [],
  });
  const [uploadError, setUploadError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [editReviewDialog, setEditReviewDialog] = useState(false);
  const [deleteReviewDialog, setDeleteReviewDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deletePhotoDialogOpen, setDeletePhotoDialogOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      dispatch(fetchTrainingById(id));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (training) {
      setEditForm({
        title: training.title || '',
        description: training.description || '',
        category: training.category?._id || '',
        coach: training.coach?._id || '',
        location: training.location || '',
        duration: training.duration || '',
        capacity: training.capacity || '',
        isActive: training.isActive || true,
        schedule: training.schedule || [],
      });
    }
  }, [training]);

  const handleBack = () => {
    navigate('/trainings');
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadError('');
      await dispatch(uploadTrainingPhotos({ id, photos: files })).unwrap();
      dispatch(fetchTrainingById(id));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Помилка при завантаженні фотографій');
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setPhotoDialogOpen(true);
  };

  const handleClosePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await dispatch(deleteTrainingPhoto({ id, photoId })).unwrap();
      dispatch(fetchTrainingById(id));
      setDeletePhotoDialogOpen(false);
      setSelectedPhotoId(null);
    } catch (error) {
      console.error('Помилка при видаленні фотографії:', error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const trainingData = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        coach: editForm.coach,
        location: editForm.location,
        duration: editForm.duration,
        capacity: editForm.capacity,
        schedule: editForm.schedule,
      };

      await dispatch(updateTraining({ id, trainingData })).unwrap();
      setIsEditing(false);
      dispatch(fetchTrainingById(id));
    } catch (error) {
      console.error('Помилка при оновленні тренування:', error);
    }
  };

  const canEdit = canEditTraining(user, training);

  const onSubmitReview = async (data) => {
    try {
      await dispatch(
        addTrainingReview({
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

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setReviewValue('rating', review.rating);
    setReviewValue('comment', review.comment);
    setEditReviewDialog(true);
  };

  const handleUpdateReview = async (data) => {
    try {
      await dispatch(
        updateTrainingReview({
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
        deleteTrainingReview({
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

  const handleDelete = async () => {
    try {
      await dispatch(deleteTraining(id)).unwrap();
      navigate('/trainings');
    } catch (error) {
      console.error('Помилка при видаленні тренування:', error);
    }
  };

  const canDelete = isAdmin(user) || user?._id === training?.coach?.user?._id;

  if (status === 'loading' || categoriesStatus === 'loading') {
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
          Помилка при завантаженні даних
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchTrainingById(id))}
          className={styles.retryButton}>
          Спробувати знову
        </Button>
      </Box>
    );
  }

  if (!training) {
    return (
      <Box className={styles.notFoundContainer}>
        <Typography variant="h5">Тренування не знайдено</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          className={styles.backButton}>
          Повернутися до списку тренувань
        </Button>
      </Box>
    );
  }

  return (
    <div className={styles.trainingPage}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleBack}
        className={styles.backButton}>
        Назад до тренувань
      </Button>

      <Paper className={styles.trainingHeader}>
        <div className={styles.headerContent}>
          <div className={styles.infoContainer}>
            <div className={styles.headerActions}>
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}>
                  Редагувати тренування
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className={styles.deleteButton}>
                  Видалити тренування
                </Button>
              )}
            </div>

            {isEditing ? (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSubmit();
                }}>
                <TextField
                  fullWidth
                  label="Назва"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Опис"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  multiline
                  rows={4}
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Категорія</InputLabel>
                  <Select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    label="Категорія">
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Місце проведення"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Тривалість (хв)"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  type="number"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Максимальна кількість учасників"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                  type="number"
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value })}
                    label="Статус">
                    <MenuItem value={true}>Активне</MenuItem>
                    <MenuItem value={false}>Неактивне</MenuItem>
                  </Select>
                </FormControl>
                <Box className={styles.editActions}>
                  <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
                    Скасувати
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Зберегти
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h4" className={styles.title}>
                  {training.title}
                </Typography>
                <Typography variant="body1" className={styles.description}>
                  {training.description}
                </Typography>
                <Box className={styles.details}>
                  <Chip icon={<LocationOn />} label={training.location} className={styles.chip} />
                  <Chip
                    icon={<AccessTime />}
                    label={`${training.duration} хв`}
                    className={styles.chip}
                  />
                  <Chip
                    icon={<Group />}
                    label={`${training.capacity} учасників`}
                    className={styles.chip}
                  />
                  <Chip
                    label={training.isActive ? 'Активне' : 'Неактивне'}
                    color={training.isActive ? 'success' : 'error'}
                    className={styles.chip}
                  />
                </Box>
                <Box className={styles.coachInfo}>
                  <Typography variant="h6" className={styles.coachTitle}>
                    Тренер
                  </Typography>
                  <Button
                    startIcon={<Person />}
                    onClick={() => navigate(`/coaches/${training.coach._id}`)}
                    className={styles.coachButton}>
                    {training.coach.user.firstName} {training.coach.user.lastName}
                  </Button>
                </Box>
              </>
            )}
          </div>
        </div>
      </Paper>
      <Paper className={styles.photosSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Фотографії
          </Typography>

          {canEdit && (
            <Button
              variant="outlined"
              color="primary"
              component="label"
              startIcon={<PhotoCamera />}
              className={styles.uploadButton}>
              Завантажити фото
              <input type="file" hidden multiple accept="image/*" onChange={handlePhotoUpload} />
            </Button>
          )}
        </Box>

        {uploadError && (
          <Alert severity="error" className={styles.errorAlert}>
            {uploadError}
          </Alert>
        )}

        {training.photos && training.photos.length > 0 ? (
          <div className={styles.photosGrid}>
            {training.photos.map((photo) => (
              <Card
                key={photo}
                className={styles.photoCard}
                onClick={() => handlePhotoClick(photo)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.startsWith('http') ? photo : `${API_URL}uploads/trainings/${photo}`}
                  alt="Фото тренування"
                  className={styles.photoImage}
                />
                {canEdit && (
                  <IconButton
                    className={styles.deletePhotoButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoId(photo);
                      setDeletePhotoDialogOpen(true);
                    }}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Typography variant="body1" className={styles.noPhotosText}>
            Фотографій поки що немає
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
        <Typography variant="subtitle1" className={styles.reviewFormTitle} my={2}>
          Відгуки
        </Typography>
        {training.reviews && training.reviews.length > 0 ? (
          <Box className={styles.reviewsList}>
            {training.reviews.map((review) => (
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
                          <DeleteIcon />
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

      <Dialog
        open={photoDialogOpen}
        onClose={handleClosePhotoDialog}
        maxWidth="md"
        fullWidth
        className={styles.photoDialog}>
        <DialogTitle className={styles.photoDialogTitle}>
          <Typography variant="h6">Фото тренування</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClosePhotoDialog}
            className={styles.closeButton}>
            <DeleteIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.photoDialogContent}>
          {selectedPhoto && (
            <img
              src={`${API_URL}uploads/trainings/${selectedPhoto}`}
              alt="Фото тренування"
              className={styles.photoPreview}
            />
          )}
        </DialogContent>
        <DialogActions className={styles.photoDialogActions}>
          {canEdit && (
            <Button color="error" onClick={() => handleDeletePhoto(selectedPhoto)}>
              Видалити
            </Button>
          )}
          <Button onClick={handleClosePhotoDialog} color="primary">
            Закрити
          </Button>
        </DialogActions>
      </Dialog>

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
        open={deletePhotoDialogOpen}
        onClose={() => setDeletePhotoDialogOpen(false)}
        className={styles.deletePhotoDialog}>
        <DialogTitle>Видалити фото</DialogTitle>
        <DialogContent>
          <Typography>Ви впевнені, що хочете видалити це фото?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePhotoDialogOpen(false)}>Скасувати</Button>
          <Button
            onClick={() => handleDeletePhoto(selectedPhotoId)}
            variant="contained"
            color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className={styles.deleteDialog}>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <Typography>
            Ви впевнені, що хочете видалити тренування "{training.title}"? Цю дію неможливо
            скасувати.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Скасувати</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrainingPage;
