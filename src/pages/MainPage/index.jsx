import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Container,
  Paper,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  FitnessCenter,
  People,
  Sports,
  ArrowForward,
  LocationOn,
  AccessTime,
  Group,
  Close,
  ArrowBackIos,
  ArrowForwardIos,
  SportsGymnastics,
  Pool,
  SportsMartialArts,
  SportsTennis,
} from '@mui/icons-material';
import { fetchAllTrainings } from '../../redux/slices/trainings';
import { advantages, clubPhotos, categories } from '../../constants/mainPageData';
import styles from './MainPage.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { trainings, loading } = useSelector((state) => state.trainings || {});
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  // Стан для діалогу перегляду фото
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTrainings());
  }, [dispatch]);

  // Отримуємо популярні тренування (перші 3)
  const popularTrainings = trainings ? trainings.slice(0, 3) : [];

  const handleCategoryClick = (categoryId) => {
    navigate(`/trainings?category=${categoryId}`);
  };

  const handleTrainingClick = (trainingId) => {
    navigate(`/trainings/${trainingId}`);
  };

  const handleViewAllTrainings = () => {
    navigate('/trainings');
  };

  const handleViewAllCoaches = () => {
    navigate('/coaches');
  };

  // Обробники для діалогу перегляду фото
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoDialog = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className={styles.mainPage}>
      {/* Hero секція */}
      <Box className={styles.heroSection}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" className={styles.heroTitle}>
                Спортивний клуб "5 елемент"
              </Typography>
              <Typography variant="h5" className={styles.heroSubtitle}>
                Ваш шлях до здорового способу життя
              </Typography>
              <Box className={styles.heroButtons}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={handleViewAllTrainings}>
                  Почати тренування
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/registration')}>
                    Зареєструватися
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={styles.heroImageContainer}>
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Спортивний клуб"
                  className={styles.heroImage}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Слайдер переваг */}
      <Box className={styles.advantagesSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Наші переваги
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Чому варто обрати наш спортивний клуб
          </Typography>

          <Box className={styles.sliderContainer}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={isMobile ? 1 : 3}
              navigation={{
                prevEl: `.${styles.sliderArrowLeft}`,
                nextEl: `.${styles.sliderArrowRight}`,
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              className={styles.advantagesSlider}>
              {advantages.map((advantage, index) => (
                <SwiperSlide key={index}>
                  <Box className={styles.advantageCard}>
                    <Box className={styles.advantageIcon}>{advantage.icon}</Box>
                    <Typography variant="h6" className={styles.advantageTitle}>
                      {advantage.title}
                    </Typography>
                    <Typography variant="body1" className={styles.advantageDescription}>
                      {advantage.description}
                    </Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
            <Box className={styles.sliderArrows}>
              <IconButton className={styles.sliderArrowLeft}>
                <ArrowBackIos />
              </IconButton>
              <IconButton className={styles.sliderArrowRight}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Категорії тренувань */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Категорії тренувань
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Виберіть тренування, яке найкраще підходить для вас
        </Typography>

        <Grid container spacing={3} className={styles.categoriesGrid}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                className={styles.categoryCard}
                onClick={() => handleCategoryClick(category.id)}>
                <CardContent className={styles.categoryContent}>
                  <Box className={styles.categoryIcon}>{category.icon}</Box>
                  <Typography variant="h5" component="h3" className={styles.categoryTitle}>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Популярні тренування */}
      <Box className={styles.trainingsSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Популярні тренування
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Найбільш затребувані тренування нашого клубу
          </Typography>

          {loading ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
              <Typography variant="h6" className={styles.loadingText}>
                Завантаження тренувань...
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3} className={styles.trainingsGrid}>
                {popularTrainings.map((training) => (
                  <Grid item xs={12} sm={6} md={4} key={training._id}>
                    <Card
                      className={styles.trainingCard}
                      onClick={() => handleTrainingClick(training._id)}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          training.image || 'https://via.placeholder.com/400x200?text=Тренування'
                        }
                        alt={training.title}
                        className={styles.trainingImage}
                      />
                      <CardContent className={styles.trainingContent}>
                        <Typography variant="h6" component="h3" className={styles.trainingTitle}>
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

              <Box className={styles.viewAllContainer}>
                <Button
                  variant="outlined"
                  color="primary"
                  endIcon={<ArrowForward />}
                  onClick={handleViewAllTrainings}>
                  Переглянути всі тренування
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>{' '}
      {/* Галерея фото */}
      <Box className={styles.gallerySection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Фотогалерея
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Ознайомтеся з нашими залами та обладнанням
          </Typography>

          <Box className={styles.gallerySliderContainer}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={isMobile ? 1 : 3}
              navigation={{
                prevEl: `.${styles.gallerySliderArrowLeft}`,
                nextEl: `.${styles.gallerySliderArrowRight}`,
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000 }}
              className={styles.photoGallery}>
              {clubPhotos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <Card className={styles.photoCard} onClick={() => handlePhotoClick(photo)}>
                    <img src={photo.url} alt={photo.title} className={styles.photoImage} />
                    <Typography variant="h6" className={styles.photoTitle}>
                      {photo.title}
                    </Typography>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
            <Box className={styles.gallerySliderArrows}>
              <IconButton className={styles.gallerySliderArrowLeft}>
                <ArrowBackIos />
              </IconButton>
              <IconButton className={styles.gallerySliderArrowRight}>
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
      {/* Секція про клуб */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Про наш клуб
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Дізнайтеся більше про наш спортивний клуб
        </Typography>

        <Grid container spacing={4} className={styles.aboutGrid}>
          <Grid item xs={12} md={6}>
            <Box className={styles.aboutImageContainer}>
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Про наш клуб"
                className={styles.aboutImage}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={styles.aboutContent}>
              <Typography variant="h4" component="h3" className={styles.aboutTitle}>
                Наш спортивний клуб - це місце, де ви можете досягти своїх фітнес-цілей
              </Typography>
              <Divider className={styles.aboutDivider} />
              <Typography variant="body1" className={styles.aboutText}>
                Ми пропонуємо широкий вибір тренувань для всіх рівнів підготовки - від початківців
                до професіоналів. Наші досвідчені тренери допоможуть вам досягти бажаних
                результатів.
              </Typography>
              <Typography variant="body1" className={styles.aboutText}>
                Наш клуб оснащений сучасним обладнанням та має зручні зали для тренувань. Ми також
                пропонуємо індивідуальні тренування та консультації з харчування.
              </Typography>
              <Box className={styles.aboutButtons}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  onClick={handleViewAllCoaches}>
                  Наші тренери
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Секція з відгуками */}
      <Box className={styles.testimonialsSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Відгуки наших клієнтів
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Що кажуть про нас наші клієнти
          </Typography>

          <Grid container spacing={3} className={styles.testimonialsGrid}>
            <Grid item xs={12} md={4}>
              <Paper className={styles.testimonialCard}>
                <Typography variant="body1" className={styles.testimonialText}>
                  "Чудовий клуб з професійними тренерами. Завдяки їм я досяг своїх фітнес-цілей за
                  короткий час. Рекомендую!"
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography variant="subtitle1" className={styles.authorName}>
                    Олена Петренко
                  </Typography>
                  <Typography variant="body2" className={styles.authorTitle}>
                    Клієнт клубу
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={styles.testimonialCard}>
                <Typography variant="body1" className={styles.testimonialText}>
                  "Найкращий спортивний клуб у місті! Зручне розташування, сучасне обладнання та
                  привітний персонал. Відвідую регулярно."
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography variant="subtitle1" className={styles.authorName}>
                    Андрій Коваленко
                  </Typography>
                  <Typography variant="body2" className={styles.authorTitle}>
                    Клієнт клубу
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={styles.testimonialCard}>
                <Typography variant="body1" className={styles.testimonialText}>
                  "Завдяки тренуванням у цьому клубі я покращив свою фізичну форму та здоров'я.
                  Тренери дуже уважні та професійні."
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography variant="subtitle1" className={styles.authorName}>
                    Марія Іваненко
                  </Typography>
                  <Typography variant="body2" className={styles.authorTitle}>
                    Клієнт клубу
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* Секція з контактами */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Зв'яжіться з нами
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Маєте питання? Зв'яжіться з нами, і ми з радістю допоможемо
        </Typography>

        <Grid container spacing={4} className={styles.contactGrid}>
          <Grid item xs={12} md={6}>
            <Paper className={styles.contactCard}>
              <Typography variant="h5" component="h3" className={styles.contactTitle}>
                Контактна інформація
              </Typography>
              <Box className={styles.contactInfo}>
                <Typography variant="body1" className={styles.contactText}>
                  <strong>Адреса:</strong> вул. Спортивна, 123, м. Київ
                </Typography>
                <Typography variant="body1" className={styles.contactText}>
                  <strong>Телефон:</strong> +380 44 123 4567
                </Typography>
                <Typography variant="body1" className={styles.contactText}>
                  <strong>Email:</strong> info@sportclub.com
                </Typography>
                <Typography variant="body1" className={styles.contactText}>
                  <strong>Графік роботи:</strong> Пн-Пт: 7:00 - 22:00, Сб-Нд: 9:00 - 20:00
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={styles.contactCard}>
              <Typography variant="h5" component="h3" className={styles.contactTitle}>
                Запишіться на безкоштовну консультацію
              </Typography>
              <Typography variant="body1" className={styles.contactText}>
                Заповніть форму нижче, і наш менеджер зв'яжеться з вами найближчим часом.
              </Typography>
              <Box className={styles.contactForm}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/registration')}>
                  Зареєструватися
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* Діалог перегляду фото */}
      <Dialog
        open={Boolean(selectedPhoto)}
        onClose={handleClosePhotoDialog}
        maxWidth="lg"
        fullWidth>
        <DialogTitle>
          {selectedPhoto?.title}
          <IconButton
            aria-label="close"
            onClick={handleClosePhotoDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePhotoDialog}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainPage;
