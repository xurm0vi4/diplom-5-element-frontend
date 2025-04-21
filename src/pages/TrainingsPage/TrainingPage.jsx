import {
  fetchTrainingById,
  enrollTraining,
  cancelEnrollment,
  updateTraining,
} from '../../redux/slices/trainings';
import { canEditTraining } from '../../utils/roleUtils';
import styles from './TrainingPage.module.scss';

const TrainingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentTraining: training,
    loading,
    error,
  } = useSelector((state) => state.trainings || {});
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    duration: '',
    maxParticipants: '',
    price: '',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchTrainingById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (training) {
      setEditForm({
        title: training.title || '',
        description: training.description || '',
        category: training.category || '',
        location: training.location || '',
        duration: training.duration || '',
        maxParticipants: training.maxParticipants || '',
        price: training.price || '',
      });
    }
  }, [training]);

  const handleBack = () => {
    navigate('/trainings');
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
    setReviewError('');
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    setReviewError('');
  };

  const handleSubmitReview = () => {
    if (!rating) {
      setReviewError('Будь ласка, вкажіть рейтинг');
      return;
    }

    if (!review.trim()) {
      setReviewError('Будь ласка, напишіть відгук');
      return;
    }

    // Тут буде логіка відправки відгуку на сервер
    setReviewSuccess(true);
    setReview('');
    setRating(0);

    // Скидаємо повідомлення про успіх через 3 секунди
    setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(files);

    // Тут буде логіка завантаження фото на сервер
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setPhotoDialogOpen(true);
  };

  const handleClosePhotoDialog = () => {
    setPhotoDialogOpen(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = (photoId) => {
    // Тут буде логіка видалення фото
    setPhotoDialogOpen(false);
  };

  const handleEnrollTraining = () => {
    if (isAuthenticated) {
      dispatch(enrollTraining(id));
    } else {
      navigate('/login', { state: { from: `/trainings/${id}` } });
    }
  };

  const handleCancelEnrollment = () => {
    dispatch(cancelEnrollment(id));
  };

  const handleEditSubmit = async () => {
    try {
      await dispatch(updateTraining({ id, ...editForm })).unwrap();
      setIsEditing(false);
      dispatch(fetchTrainingById(id));
    } catch (error) {
      console.error('Помилка при оновленні тренування:', error);
    }
  };

  const isEnrolled = training?.enrolledUsers?.includes(user?._id);
  const canEdit = canEditTraining(user, training);

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="h6" className={styles.loadingText}>
          Завантаження тренування...
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className={styles.imageContainer}>
              <img
                src={training.image || 'https://via.placeholder.com/400x300?text=Тренування'}
                alt={training.title}
                className={styles.trainingImage}
              />
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}>
                  Редагувати тренування
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box className={styles.infoContainer}>
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
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <TextField
                    fullWidth
                    label="Категорія"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Місце проведення"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Тривалість (хвилин)"
                    type="number"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Максимальна кількість учасників"
                    type="number"
                    value={editForm.maxParticipants}
                    onChange={(e) => setEditForm({ ...editForm, maxParticipants: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Ціна"
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
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
                  <Typography variant="h4" component="h1" className={styles.trainingTitle}>
                    {training.title}
                  </Typography>

                  <Box className={styles.ratingContainer}>
                    <Rating
                      value={training.rating || 0}
                      precision={0.5}
                      readOnly
                      className={styles.rating}
                    />
                    <Typography variant="body1">
                      ({training.reviews?.length || 0} відгуків)
                    </Typography>
                  </Box>

                  <Box className={styles.categoryContainer}>
                    <Chip
                      label={training.category}
                      color="primary"
                      className={styles.categoryChip}
                    />
                  </Box>

                  <Box className={styles.trainingInfo}>
                    <Box className={styles.infoItem}>
                      <LocationOn fontSize="small" />
                      <Typography variant="body1">{training.location}</Typography>
                    </Box>

                    <Box className={styles.infoItem}>
                      <AccessTime fontSize="small" />
                      <Typography variant="body1">{training.duration} хвилин</Typography>
                    </Box>

                    <Box className={styles.infoItem}>
                      <Group fontSize="small" />
                      <Typography variant="body1">{training.maxParticipants} учасників</Typography>
                    </Box>

                    <Box className={styles.infoItem}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body1">
                        {new Date(training.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" className={styles.description}>
                    {training.description}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={styles.photosSection}>
        <Box className={styles.sectionHeader}>
          <Typography variant="h5" className={styles.sectionTitle}>
            Фотографії
          </Typography>

          {isAuthenticated && user?._id === training.coach && (
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

        {training.photos && training.photos.length > 0 ? (
          <Grid container spacing={2} className={styles.photosGrid}>
            {training.photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo._id}>
                <Card className={styles.photoCard} onClick={() => handlePhotoClick(photo)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={photo.url}
                    alt="Фото тренування"
                    className={styles.photoImage}
                  />
                  {isAuthenticated && user?._id === training.coach && (
                    <IconButton
                      className={styles.deletePhotoButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo._id);
                      }}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" className={styles.noPhotosText}>
            Фотографій поки що немає
          </Typography>
        )}
      </Paper>

      <Paper className={styles.reviewsSection}>
        <Typography variant="h5" className={styles.sectionTitle}>
          Відгуки
        </Typography>

        {isAuthenticated ? (
          <Paper className={styles.reviewForm}>
            <Typography variant="h6" className={styles.reviewFormTitle}>
              Залишити відгук
            </Typography>

            {reviewSuccess && (
              <Alert severity="success" className={styles.reviewAlert}>
                Ваш відгук успішно додано!
              </Alert>
            )}

            {reviewError && (
              <Alert severity="error" className={styles.reviewAlert}>
                {reviewError}
              </Alert>
            )}

            <Box className={styles.ratingInput}>
              <Typography component="legend">Ваш рейтинг</Typography>
              <Rating
                name="rating"
                value={rating}
                onChange={handleRatingChange}
                className={styles.ratingStars}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Ваш відгук"
              value={review}
              onChange={handleReviewChange}
              className={styles.reviewTextField}
            />

            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSubmitReview}
              className={styles.submitButton}>
              Надіслати відгук
            </Button>
          </Paper>
        ) : (
          <Alert severity="info" className={styles.loginAlert}>
            Будь ласка,{' '}
            <Button color="primary" onClick={() => navigate('/login')}>
              увійдіть
            </Button>{' '}
            щоб залишити відгук
          </Alert>
        )}

        <Divider className={styles.divider} />

        {training.reviews && training.reviews.length > 0 ? (
          <List className={styles.reviewsList}>
            {training.reviews.map((review) => (
              <ListItem key={review._id} className={styles.reviewItem}>
                <ListItemAvatar>
                  <Avatar src={review.user.avatar}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box className={styles.reviewHeader}>
                      <Typography variant="subtitle1" className={styles.reviewerName}>
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} precision={0.5} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                      </Typography>
                      <Typography variant="body1" className={styles.reviewText}>
                        {review.text}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" className={styles.noReviewsText}>
            Відгуків поки що немає
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
            <img src={selectedPhoto.url} alt="Фото тренування" className={styles.photoPreview} />
          )}
        </DialogContent>
        <DialogActions className={styles.photoDialogActions}>
          {isAuthenticated && user?._id === training.coach && (
            <Button color="error" onClick={() => handleDeletePhoto(selectedPhoto?._id)}>
              Видалити
            </Button>
          )}
          <Button onClick={handleClosePhotoDialog} color="primary">
            Закрити
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrainingPage;
