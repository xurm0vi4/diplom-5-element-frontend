import React from 'react';
import { Container, Grid, Typography, IconButton, Box } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Про нас
            </Typography>
            <Typography className={styles.footerText}>
              Наш спортивний клуб - це сучасний комплекс, який пропонує широкий вибір тренувань для
              всіх вікових груп. Ми прагнемо створити комфортне середовище для вашого фізичного
              розвитку та здорового способу життя.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Контакти
            </Typography>
            <Typography className={styles.footerText}>
              Адреса: вул. Спортивна, 123, м. Київ
              <br />
              Телефон: +380 (44) 123-45-67
              <br />
              Email: info@sportclub.com
            </Typography>
            <Box className={styles.socialLinks}>
              <IconButton className={styles.iconButton}>
                <Facebook />
              </IconButton>
              <IconButton className={styles.iconButton}>
                <Instagram />
              </IconButton>
              <IconButton className={styles.iconButton}>
                <Twitter />
              </IconButton>
              <IconButton className={styles.iconButton}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Слідкуйте за нами
            </Typography>
            <Typography className={styles.footerText}>
              Підпишіться на наші соціальні мережі, щоб бути в курсі останніх новин, акцій та подій
              у нашому клубі.
            </Typography>
          </Grid>
        </Grid>

        <Box className={styles.footerBottom}>
          <Typography className={styles.copyright}>
            © {currentYear} Спортивний клуб. Всі права захищені.
          </Typography>
          <Box className={styles.footerLinks}>
            <Typography component="a" href="/privacy" className={styles.footerLink}>
              Політика конфіденційності
            </Typography>
            <Typography component="a" href="/terms" className={styles.footerLink}>
              Умови використання
            </Typography>
          </Box>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
