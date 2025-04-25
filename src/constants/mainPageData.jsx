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
    icon: <FitnessCenter />,
  },
  {
    title: 'Сучасне обладнання',
    description: 'Новітнє спортивне обладнання для ефективних тренувань',
    icon: <SportsGymnastics />,
  },
  {
    title: 'Басейн',
    description: 'Олімпійський басейн з професійними тренерами',
    icon: <Pool />,
  },
  {
    title: 'Бойові мистецтва',
    description: 'Різноманітні секції бойових мистецтв для всіх рівнів',
    icon: <SportsMartialArts />,
  },
  {
    title: 'Теніс',
    description: 'Професійні корти та тренування з досвідченими тренерами',
    icon: <SportsTennis />,
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
  { id: 'fitness', name: 'Фітнес', icon: <FitnessCenter /> },
  { id: 'yoga', name: 'Йога', icon: <SportsGymnastics /> },
  { id: 'dance', name: 'Танці', icon: <SportsTennis /> },
  { id: 'martial_arts', name: 'Бойові мистецтва', icon: <SportsMartialArts /> },
  { id: 'swimming', name: 'Плавання', icon: <Pool /> },
  { id: 'team_sports', name: 'Командні види спорту', icon: <SportsTennis /> },
];

export const iconMap = {
  fitness: <FitnessCenter />,
  yoga: <SportsGymnastics />,
  dance: <SportsTennis />,
  martial_arts: <SportsMartialArts />,
  swimming: <Pool />,
  team_sports: <SportsTennis />,
};
