import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Box, Typography } from '@mui/material';
import styles from './CategoryCard.module.scss';

export const CategoryCard = ({ id, name, description, iconName }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trainings?category=${id}`);
  };

  return (
    <Card className={styles.card} onClick={handleClick}>
      <CardContent className={styles.content}>
        <Box className={styles.icon}>
          <i className={`fas fa-${iconName}`}></i>
        </Box>
        <Typography variant="h5" component="h3" className={styles.title}>
          {name}
        </Typography>
        <Typography variant="body2" className={styles.description}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
