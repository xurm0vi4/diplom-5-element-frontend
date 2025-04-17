import React from 'react';
import { Box, Typography, Grid, Container, Paper, Divider, Button } from '@mui/material';
import {
  FitnessCenter,
  People,
  Sports,
  Pool,
  SportsMartialArts,
  SportsTennis,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from './AboutPage.module.scss';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FitnessCenter fontSize="large" />,
      title: 'Сучасне обладнання',
      description: 'Наш клуб оснащений найновішим спортивним обладнанням від провідних виробників',
    },
    {
      icon: <People fontSize="large" />,
      title: 'Професійні тренери',
      description:
        'Наші тренери мають багаторічний досвід та регулярно проходять підвищення кваліфікації',
    },
    {
      icon: <Sports fontSize="large" />,
      title: 'Різноманітність тренувань',
      description: 'Широкий вибір тренувань для всіх рівнів підготовки та вікових груп',
    },
    {
      icon: <Pool fontSize="large" />,
      title: 'Бассейн',
      description: 'Сучасний басейн з системою очищення та контролю температури',
    },
    {
      icon: <SportsMartialArts fontSize="large" />,
      title: 'Бойові мистецтва',
      description: 'Спеціалізовані зали для тренувань з бойових мистецтв',
    },
    {
      icon: <SportsTennis fontSize="large" />,
      title: 'Тенісний корт',
      description: 'Професійний тенісний корт з синтетичним покриттям',
    },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero секція */}
      <Box className={styles.heroSection}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" className={styles.heroTitle}>
            Про наш клуб
          </Typography>
          <Typography variant="h5" className={styles.heroSubtitle}>
            Дізнайтеся більше про наш спортивний клуб та його можливості
          </Typography>
        </Container>
      </Box>

      {/* Історія клубу */}
      <Container maxWidth="lg" className={styles.section}>
        <Grid container spacing={4} alignItems="center">
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
              <Typography variant="h4" component="h2" className={styles.aboutTitle}>
                Наша історія
              </Typography>
              <Divider className={styles.aboutDivider} />
              <Typography variant="body1" className={styles.aboutText}>
                Наш спортивний клуб був заснований у 2010 році з метою створення місця, де кожен
                може досягти своїх фітнес-цілей. За ці роки ми розширилися з невеликого залу до
                повноцінного спортивного комплексу з усіма необхідними зручностями.
              </Typography>
              <Typography variant="body1" className={styles.aboutText}>
                Ми гордимося тим, що допомагаємо нашим клієнтам стати кращими версіями себе. Наші
                тренери - це справжні професіонали, які допоможуть вам досягти бажаних результатів
                незалежно від вашого початкового рівня підготовки.
              </Typography>
              <Box className={styles.aboutButtons}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/trainings')}>
                  Переглянути тренування
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Наші можливості */}
      <Box className={styles.featuresSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
            Наші можливості
          </Typography>
          <Typography variant="h6" className={styles.sectionSubtitle}>
            Що ми пропонуємо нашим клієнтам
          </Typography>

          <Grid container spacing={3} className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper className={styles.featureCard}>
                  <Box className={styles.featureIcon}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" className={styles.featureTitle}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className={styles.featureDescription}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Наша команда */}
      <Container maxWidth="lg" className={styles.section}>
        <Typography variant="h3" component="h2" className={styles.sectionTitle}>
          Наша команда
        </Typography>
        <Typography variant="h6" className={styles.sectionSubtitle}>
          Професіонали, які допоможуть вам досягти ваших цілей
        </Typography>

        <Grid container spacing={3} className={styles.teamGrid}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.teamCard}>
              <Box className={styles.teamImageContainer}>
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Тренер"
                  className={styles.teamImage}
                />
              </Box>
              <Box className={styles.teamInfo}>
                <Typography variant="h6" component="h3" className={styles.teamName}>
                  Олександр Петренко
                </Typography>
                <Typography variant="body2" className={styles.teamPosition}>
                  Головний тренер
                </Typography>
                <Typography variant="body2" className={styles.teamDescription}>
                  Майстер спорту з важкої атлетики, сертифікований тренер з 10-річним досвідом
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.teamCard}>
              <Box className={styles.teamImageContainer}>
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Тренер"
                  className={styles.teamImage}
                />
              </Box>
              <Box className={styles.teamInfo}>
                <Typography variant="h6" component="h3" className={styles.teamName}>
                  Марія Коваленко
                </Typography>
                <Typography variant="body2" className={styles.teamPosition}>
                  Тренер з йоги
                </Typography>
                <Typography variant="body2" className={styles.teamDescription}>
                  Сертифікований інструктор з йоги та пілатесу, досвід роботи 8 років
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={styles.teamCard}>
              <Box className={styles.teamImageContainer}>
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Тренер"
                  className={styles.teamImage}
                />
              </Box>
              <Box className={styles.teamInfo}>
                <Typography variant="h6" component="h3" className={styles.teamName}>
                  Андрій Іваненко
                </Typography>
                <Typography variant="body2" className={styles.teamPosition}>
                  Тренер з бойових мистецтв
                </Typography>
                <Typography variant="body2" className={styles.teamDescription}>
                  Чемпіон України з кікбоксингу, сертифікований тренер з 5-річним досвідом
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Приєднуйтесь до нас */}
      <Box className={styles.joinSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" className={styles.sectionTitle}>
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
              endIcon={<ArrowForward />}
              onClick={() => navigate('/registration')}>
              Зареєструватися
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/trainings')}>
              Переглянути тренування
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default AboutPage;
