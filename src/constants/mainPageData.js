import {
  FitnessCenter,
  SportsGymnastics,
  Pool,
  SportsMartialArts,
  SportsTennis,
} from '@mui/icons-material';

// Переваги клубу
export const advantages = [
  {
    title: 'Професійні тренери',
    description: 'Наші тренери мають багаторічний досвід та сертифікати',
    icon: 'fitness_center',
  },
  {
    title: 'Сучасне обладнання',
    description: 'Новітнє спортивне обладнання для ефективних тренувань',
    icon: 'sports_gymnastics',
  },
  {
    title: 'Басейн',
    description: 'Олімпійський басейн з професійними тренерами',
    icon: 'pool',
  },
  {
    title: 'Бойові мистецтва',
    description: 'Різноманітні секції бойових мистецтв для всіх рівнів',
    icon: 'sports_martial_arts',
  },
  {
    title: 'Теніс',
    description: 'Професійні корти та тренування з досвідченими тренерами',
    icon: 'sports_tennis',
  },
];

// Фотографії клубу
export const clubPhotos = [
  { url: 'src/assets/test.jpg', title: 'Тренажерний зал' },
  { url: 'src/assets/test.jpg', title: 'Басейн' },
  { url: 'src/assets/test.jpg', title: 'Тенісний корт' },
  { url: 'src/assets/test.jpg', title: 'Зал бойових мистецтв' },
  { url: 'src/assets/test.jpg', title: 'Групові заняття' },
];

// Категорії тренувань
export const categories = [
  { id: 'fitness', name: 'Фітнес', icon: 'fitness_center' },
  { id: 'yoga', name: 'Йога', icon: 'sports' },
  { id: 'dance', name: 'Танці', icon: 'people' },
  { id: 'martial_arts', name: 'Бойові мистецтва', icon: 'sports' },
  { id: 'swimming', name: 'Плавання', icon: 'sports' },
  { id: 'team_sports', name: 'Командні види спорту', icon: 'people' },
];
