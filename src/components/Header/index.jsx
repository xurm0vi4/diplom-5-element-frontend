import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Container,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon, Person, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/auth';
import styles from './Header.module.scss';
import { isAdmin, isCoach } from '../../utils/roleUtils';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data } = useSelector((state) => state.auth);
  const isAuthenticated = !!data;
  const user = data;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    handleMenuClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleAdminClick = () => {
    handleMenuClose();
    navigate('/admin');
  };

  const handleCoachDashboardClick = () => {
    handleMenuClose();
    navigate('/coach-dashboard');
  };

  return (
    <AppBar position="sticky" className={styles.header}>
      <Container maxWidth="lg">
        <Toolbar className={styles.toolbar}>
          <Typography
            variant="h6"
            component="div"
            className={styles.logo}
            onClick={() => navigate('/')}>
            5 елемент
          </Typography>

          {!isMobile && (
            <Box className={styles.navLinks}>
              <Button color="inherit" onClick={() => navigate('/trainings')}>
                Тренування
              </Button>
              <Button color="inherit" onClick={() => navigate('/coaches')}>
                Тренери
              </Button>
              <Button color="inherit" onClick={() => navigate('/about')}>
                Про нас
              </Button>
              <Button color="inherit" onClick={() => navigate('/contacts')}>
                Контакти
              </Button>
            </Box>
          )}

          <Box className={styles.authButtons}>
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenuOpen} className={styles.avatarButton}>
                  <Avatar
                    alt={user?.firstName || 'Користувач'}
                    src={user?.avatar}
                    className={styles.avatar}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  className={styles.menu}>
                  <MenuItem onClick={handleProfileClick}>
                    <Person fontSize="small" className={styles.menuIcon} />
                    Профіль
                  </MenuItem>
                  {isAdmin(user) && (
                    <MenuItem onClick={handleAdminClick}>
                      <Person fontSize="small" className={styles.menuIcon} />
                      Панель адміна
                    </MenuItem>
                  )}
                  {isCoach(user) && (
                    <MenuItem onClick={handleCoachDashboardClick}>
                      <Person fontSize="small" className={styles.menuIcon} />
                      Панель тренера
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp fontSize="small" className={styles.menuIcon} />
                    Вийти
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Увійти
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/registration')}>
                  Зареєструватися
                </Button>
              </>
            )}

            {isMobile && (
              <IconButton color="inherit" onClick={handleMenuOpen} className={styles.menuButton}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>

      {isMobile && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className={styles.mobileMenu}>
          <MenuItem
            onClick={() => {
              navigate('/trainings');
              handleMenuClose();
            }}>
            Тренування
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/coaches');
              handleMenuClose();
            }}>
            Тренери
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/about');
              handleMenuClose();
            }}>
            Про нас
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate('/contacts');
              handleMenuClose();
            }}>
            Контакти
          </MenuItem>
          {isAuthenticated && (
            <>
              <MenuItem onClick={handleProfileClick}>
                <Person fontSize="small" className={styles.menuIcon} />
                Профіль
              </MenuItem>
              {isAdmin(user) && (
                <MenuItem onClick={handleAdminClick}>
                  <Person fontSize="small" className={styles.menuIcon} />
                  Панель адміна
                </MenuItem>
              )}
              {isCoach(user) && (
                <MenuItem onClick={handleCoachDashboardClick}>
                  <Person fontSize="small" className={styles.menuIcon} />
                  Панель тренера
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <ExitToApp fontSize="small" className={styles.menuIcon} />
                Вийти
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </AppBar>
  );
};

export default Header;
