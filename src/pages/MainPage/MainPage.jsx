import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  Container,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowForward, Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { fetchAllTrainings } from '../../redux/slices/trainings';
import { advantages, clubPhotos } from '../../constants/mainPageData';
import styles from './MainPage.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchCategories } from '../../redux/slices/category';
import { CategoryCard } from '../../components/CategoryCard/CategoryCard';

import gym from '../../assets/gym.jpg';
import gym2 from '../../assets/gym2.jpg';

const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: user } = useSelector((state) => state.auth || {});
  const { categories, status } = useSelector((state) => state.category);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTrainings());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleViewAllTrainings = () => {
    navigate('/trainings');
  };

  const handleViewAllCoaches = () => {
    navigate('/coaches');
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePhotoDialog = () => {
    setSelectedPhoto(null);
  };

  if (status === 'loading') {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box className={styles.errorContainer}>
        <Typography variant="h6" color="error">
          Помилка при завантаженні категорій
        </Typography>
      </Box>
    );
  }

  return (
    <div className={styles.mainPage}>
      <Box className={styles.heroSection}>
        <Container maxWidth="lg">
          <Box className={styles.heroContainer}>
            <Box className={styles.heroContent}>
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
                  Переглянути тренування
                </Button>
                {!user ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/registration')}>
                    Зареєструватися
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/coaches')}>
                    Тренери
                  </Button>
                )}
              </Box>
            </Box>
            <Box className={styles.heroImageContainer}>
              <img src={gym} alt="Спортивний клуб" className={styles.heroImage} />
            </Box>
          </Box>
        </Container>
      </Box>

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

      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Категорії тренувань
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Виберіть тренування, яке найкраще підходить для вас
        </Typography>

        <Box className={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              id={category._id}
              name={category.name}
              description={category.description}
              iconName={category.iconName}
            />
          ))}
        </Box>
      </Container>

      <Box className={styles.section}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Фотогалерея
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Ознайомтеся з нашими залами та обладнанням
          </Typography>

          <Box className={styles.galleryContainer}>
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                960: {
                  slidesPerView: 3,
                },
              }}
              className={styles.gallerySlider}>
              {clubPhotos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <Box className={styles.galleryCard}>
                    <img src={photo.url} alt={photo.title} className={styles.galleryImage} />
                    <Typography className={styles.galleryTitle}>{photo.title}</Typography>
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Про наш клуб
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Дізнайтеся більше про наш спортивний клуб
        </Typography>

        <Box className={styles.aboutContainer}>
          <Box className={styles.aboutImageContainer}>
            <img src={gym2} alt="Про наш клуб" className={styles.aboutImage} />
          </Box>
          <Box className={styles.aboutContent}>
            <Typography variant="h4" component="h3" className={styles.aboutTitle}>
              Елітний сімейний фітнес-центр "5 елемент"
            </Typography>
            <Divider className={styles.aboutDivider} />
            <Typography variant="body1" className={styles.aboutText}>
              Ми пропонуємо широкий вибір тренувань для всіх рівнів підготовки - від початківців до
              професіоналів. Наші досвідчені тренери допоможуть вам досягти бажаних результатів.
              Клуб знаходиться в зручному місці: 10 хвилин їзди від центру міста, 5 хвилин від
              Оболоні та 20 хвилин від Конча-Заспи.
            </Typography>
            <Typography variant="body1" className={styles.aboutText}>
              Наш комплекс площею 21 000 м² включає: два спортивні басейни по 25 метрів, дитячий
              басейн, джакузі та літній басейн під відкритим небом; двоповерховий тренажерний зал
              площею 2000 м²; 18 просторових обладнаних студій для різних видів тренувань; сквош,
              тенісні корти та багато іншого.
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
        </Box>
      </Container>
      <Box className={styles.testimonialsSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Відгуки наших клієнтів
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Що кажуть про нас наші клієнти
          </Typography>

          <Box className={styles.testimonialsContainer}>
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
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Зв'яжіться з нами
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Маєте питання? Зв'яжіться з нами, і ми з радістю допоможемо
        </Typography>

        <Box className={styles.contactContainer}>
          <Paper className={styles.contactCard}>
            <Typography variant="h5" component="h3" className={styles.contactTitle}>
              Контактна інформація
            </Typography>
            <Box className={styles.contactInfo}>
              <Typography variant="body1" className={styles.contactText}>
                <strong>Адреса:</strong> вул. Електриків, 29а, м. Київ
              </Typography>
              <Typography variant="body1" className={styles.contactText}>
                <strong>Телефон:</strong> +380 (44) 495-95-55
              </Typography>
              <Typography variant="body1" className={styles.contactText}>
                <strong>Email:</strong> info@5element.ua
              </Typography>
              <Typography variant="body1" className={styles.contactText}>
                <strong>Графік роботи:</strong> Пн-Пт: 7:00 - 22:00, Сб-Нд: 9:00 - 20:00
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>

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

      <Box className={styles.mapSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Наше розташування
          </Typography>
          <Box className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11426.147788493347!2d30.517266964982344!3d50.478119676728404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce220fe0d8d3%3A0xdba5d7c4c3def87c!2z0KTQuNGC0L3QtdGBLdC60LvRg9CxIMKrNSDQrdC70LXQvNC10L3RgsK7OiDQsNCx0L7QvdC10LzQtdC90YLRiyDQsiDRgdC_0L7RgNGC0LfQsNC7LCDQsdCw0YHRgdC10LnQvQ!5e0!3m2!1sru!2sua!4v1746782772875!5m2!1sru!2sua"
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default MainPage;
