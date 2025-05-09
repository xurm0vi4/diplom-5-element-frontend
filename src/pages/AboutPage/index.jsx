import React from 'react';
import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { LocationOn, Phone, Email, AccessTime } from '@mui/icons-material';
import { features, clubPhotos } from '../../constants/aboutPageData';
import styles from './AboutPage.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.aboutPage}>
      <Box className={styles.heroSection}>
        <Container>
          <Typography variant="h2" className={styles.heroTitle}>
            Про клуб "5 елемент"
          </Typography>
          <Typography variant="h5" className={styles.heroSubtitle}>
            Елітний сімейний фітнес-центр
          </Typography>
        </Container>
      </Box>

      <Container>
        <Box className={styles.section}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Наша історія
          </Typography>
          <Box className={styles.aboutContainer}>
            <Box className={styles.aboutImageContainer}>
              <img
                src="https://5element.ua/upload/iblock/7c7/7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c.jpg"
                alt="Фітнес-клуб 5 елемент"
                className={styles.aboutImage}
              />
            </Box>
            <Box className={styles.aboutContent}>
              <Typography variant="h4" className={styles.aboutTitle}>
                Елітний сімейний фітнес-центр
              </Typography>
              <Box className={styles.aboutDivider} />
              <Typography className={styles.aboutText}>
                Фітнес-клуб "5 елемент" - це унікальний комплекс площею 21 000 м², який включає:
              </Typography>
              <Typography className={styles.aboutText}>
                • Два спортивні басейни по 25 метрів
                <br />
                • Дитячий басейн
                <br />
                • Джакузі
                <br />
                • Літній басейн під відкритим небом
                <br />
                • Двоповерховий тренажерний зал (2000 м²)
                <br />
                • 18 обладнаних студій для різних видів тренувань
                <br />• Сквош та тенісні корти
              </Typography>
              <Typography className={styles.aboutText}>
                Наш клуб знаходиться в зручному місці: 10 хвилин від центру міста, 5 хвилин від
                Оболоні та 20 хвилин від Конча-Заспи.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className={styles.section}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Наші можливості
          </Typography>
          <Box className={styles.featuresContainer}>
            {features.map((feature, index) => (
              <Box key={index} className={styles.featureCardWrapper}>
                <Card className={styles.featureCard}>
                  <CardContent>
                    <Typography variant="h1" className={styles.featureIcon}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" className={styles.featureTitle}>
                      {feature.title}
                    </Typography>
                    <Typography className={styles.featureDescription}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.section}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Галерея клубу
          </Typography>
          <Box className={styles.galleryContainer}>
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
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
        </Box>

        <Box className={styles.section}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Контактна інформація
          </Typography>
          <Box className={styles.contactContainer}>
            <Box className={styles.contactCardWrapper}>
              <Card className={styles.contactCard}>
                <Typography variant="h5" className={styles.contactTitle}>
                  Наші контакти
                </Typography>
                <Box className={styles.contactInfo}>
                  <Box className={styles.contactItem}>
                    <LocationOn className={styles.contactIcon} />
                    <Box>
                      <Typography variant="subtitle1">Адреса</Typography>
                      <Typography>вул. Електриків, 29а, м. Київ</Typography>
                    </Box>
                  </Box>
                  <Box className={styles.contactItem}>
                    <Phone className={styles.contactIcon} />
                    <Box>
                      <Typography variant="subtitle1">Телефон</Typography>
                      <Typography>+380 (44) 495-95-55</Typography>
                    </Box>
                  </Box>
                  <Box className={styles.contactItem}>
                    <Email className={styles.contactIcon} />
                    <Box>
                      <Typography variant="subtitle1">Email</Typography>
                      <Typography>info@5element.ua</Typography>
                    </Box>
                  </Box>
                  <Box className={styles.contactItem}>
                    <AccessTime className={styles.contactIcon} />
                    <Box>
                      <Typography variant="subtitle1">Графік роботи</Typography>
                      <Typography>Пн-Пт: 7:00 - 22:00</Typography>
                      <Typography>Сб-Нд: 9:00 - 20:00</Typography>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Box>
            <Box className={styles.mapCardWrapper}>
              <Card className={styles.mapCard}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11426.147788493347!2d30.517266964982344!3d50.478119676728404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce220fe0d8d3%3A0xdba5d7c4c3def87c!2z0KTQuNGC0L3QtdGBLdC60LvRg9CxIMKrNSDQrdC70LXQvNC10L3RgsK7OiDQsNCx0L7QvdC10LzQtdC90YLRiyDQsiDRgdC_0L7RgNGC0LfQsNC7LCDQsdCw0YHRgdC10LnQvQ!5e0!3m2!1sru!2sua!4v1746782772875!5m2!1sru!2sua"
                  width="100%"
                  height="600"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Card>
            </Box>
          </Box>
        </Box>

        <Box className={styles.section}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Відгуки наших клієнтів
          </Typography>
          <Box className={styles.testimonialsContainer}>
            <Box className={styles.testimonialCardWrapper}>
              <Card className={styles.testimonialCard}>
                <Typography className={styles.testimonialText}>
                  "Чудовий клуб з сучасним обладнанням та професійними тренерами. Особливо
                  подобається басейн та SPA-зона. Рекомендую!"
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography className={styles.authorName}>Олена Петренко</Typography>
                  <Typography className={styles.authorInfo}>Член клубу з 2020 року</Typography>
                </Box>
              </Card>
            </Box>
            <Box className={styles.testimonialCardWrapper}>
              <Card className={styles.testimonialCard}>
                <Typography className={styles.testimonialText}>
                  "Відмінне місце для сімейного відпочинку. Діти в захваті від дитячої зони, а я від
                  тренажерного залу. Вартість абонементу цілком виправдана."
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography className={styles.authorName}>Андрій Коваленко</Typography>
                  <Typography className={styles.authorInfo}>Член клубу з 2021 року</Typography>
                </Box>
              </Card>
            </Box>
            <Box className={styles.testimonialCardWrapper}>
              <Card className={styles.testimonialCard}>
                <Typography className={styles.testimonialText}>
                  "Професійний підхід до кожного клієнта. Тренер розробив для мене індивідуальну
                  програму тренувань, яка дає чудові результати."
                </Typography>
                <Box className={styles.testimonialAuthor}>
                  <Typography className={styles.authorName}>Марія Сидоренко</Typography>
                  <Typography className={styles.authorInfo}>Член клубу з 2022 року</Typography>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>

        <Box className={styles.joinSection}>
          <Typography variant="h3" className={styles.sectionTitle}>
            Приєднуйтесь до нас
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Почніть свій шлях до здорового способу життя вже сьогодні
          </Typography>
          <Box className={styles.joinButtons}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/trainings')}>
              Переглянути тренування
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/coaches')}>
              Переглянути тренерів
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AboutPage;
