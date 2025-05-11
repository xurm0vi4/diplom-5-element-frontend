import React from 'react';
import { Container, Typography, IconButton, Box } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube } from '@mui/icons-material';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            '@media (max-width: 600px)': {
              flexDirection: 'column',
            },
          }}>
          <Box
            sx={{
              flex: '1 1 300px',
              minWidth: '300px',
            }}>
            <Typography variant="h6" className={styles.footerTitle}>
              Контакти
            </Typography>
            <Typography className={styles.footerText}>
              Адреса: вул. Електриків, 29а, м. Київ
              <br />
              Телефон: +380 (44) 495-95-55
              <br />
              Email: info@5element.ua
            </Typography>
            <Box className={styles.socialLinks}>
              <IconButton className={styles.iconButton} href="https://www.facebook.com/5elementua">
                <Facebook />
              </IconButton>
              <IconButton
                className={styles.iconButton}
                href="https://www.instagram.com/5element.ua">
                <Instagram />
              </IconButton>
              <IconButton className={styles.iconButton} href="https://www.youtube.com/5elementua">
                <YouTube />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              flex: '1 1 300px',
              minWidth: '300px',
            }}>
            <Typography variant="h6" className={styles.footerTitle}>
              Слідкуйте за нами
            </Typography>
            <Typography className={styles.footerText}>
              Підпишіться на наші соціальні мережі, щоб бути в курсі останніх новин, акцій та подій
              у нашому клубі.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.footerBottom}>
          <Typography className={styles.copyright}>
            © {currentYear} Елітний сімейний фітнес-центр "5 елемент". Всі права захищені.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
