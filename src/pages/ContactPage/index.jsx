import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';
import styles from './ContactPage.module.scss';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSnackbar({
      open: true,
      message: 'Ваше повідомлення успішно надіслано!',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box className={styles.contactPage}>
      {/* Hero секція */}
      <Box className={styles.heroSection}>
        <Container>
          <Typography variant="h1" className={styles.heroTitle}>
            Зв'яжіться з нами
          </Typography>
          <Typography variant="h5" className={styles.heroSubtitle}>
            Ми завжди раді відповісти на ваші запитання
          </Typography>
        </Container>
      </Box>

      <Container>
        <Grid container spacing={4}>
          {/* Контактна інформація */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} className={styles.contactInfo}>
              <Typography variant="h5" className={styles.contactInfoTitle}>
                Контактна інформація
              </Typography>

              <Box className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <Box>
                  <Typography variant="h6">Телефон</Typography>
                  <Typography>+380 (44) 123-45-67</Typography>
                </Box>
              </Box>

              <Box className={styles.contactItem}>
                <Email className={styles.contactIcon} />
                <Box>
                  <Typography variant="h6">Email</Typography>
                  <Typography>info@sportclub.com</Typography>
                </Box>
              </Box>

              <Box className={styles.contactItem}>
                <LocationOn className={styles.contactIcon} />
                <Box>
                  <Typography variant="h6">Адреса</Typography>
                  <Typography>
                    вул. Спортивна, 1
                    <br />
                    м. Київ, 01001
                  </Typography>
                </Box>
              </Box>

              <Box className={styles.socialLinks}>
                <IconButton className={styles.socialIcon}>
                  <Facebook />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <Instagram />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <Twitter />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Paper>
          </Grid>

          {/* Форма зворотного зв'язку */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} className={styles.contactForm}>
              <Typography variant="h5" className={styles.formTitle}>
                Напишіть нам
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ваше ім'я"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Тема"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Повідомлення"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      className={styles.submitButton}>
                      Надіслати повідомлення
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Карта */}
        <Box className={styles.mapSection}>
          <Typography variant="h5" className={styles.mapTitle}>
            Наше розташування
          </Typography>
          <Box className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.827871535617!2d30.519922776891713!3d50.44999997947554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce50f8b7e8c3%3A0x7c1c1c1c1c1c1c1c!2z0JrQuNGX0LI!5e0!3m2!1suk!2sua!4v1620000000000!5m2!1suk!2sua"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </Box>
        </Box>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
