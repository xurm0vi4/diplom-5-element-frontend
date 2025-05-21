import {
  FitnessCenter,
  Pool,
  Spa,
  Restaurant,
  LocalParking,
  Security,
  SportsTennis,
  ChildCare,
  LocalLibrary,
  LocalHospital,
  SportsMartialArts,
  SportsGymnastics,
} from '@mui/icons-material';

import gym1 from '../assets/gym4.jpg';
import swimmingPool from '../assets/swimming-pool.jpg';
import spaZone from '../assets/spa-zone.jpg';
import tennisCourt from '../assets/tennis-court.jpg';
import childzone from '../assets/childzone.JPG';
import restaurant from '../assets/restaurant.jpg';

export const advantages = [
  {
    icon: <FitnessCenter fontSize="large" />,
    title: 'Сучасне обладнання',
    description:
      'Двоповерховий тренажерний зал площею 2000 м² з найновішим обладнанням від провідних виробників',
  },
  {
    icon: <Pool fontSize="large" />,
    title: 'Басейни',
    description:
      'Два спортивні басейни по 25 метрів, дитячий басейн, джакузі та літній басейн під відкритим небом',
  },
  {
    icon: <Spa fontSize="large" />,
    title: 'SPA-зона',
    description: 'Сучасна SPA-зона з сауною, хамамом та зоною відпочинку для повного релаксу',
  },
  {
    icon: <Restaurant fontSize="large" />,
    title: 'Здорове харчування',
    description:
      'Ресторан з меню від професійних дієтологів та смузі-бар для відновлення після тренувань',
  },
  {
    icon: <LocalParking fontSize="large" />,
    title: 'Паркування',
    description: "Безкоштовне паркування для членів клубу та зручна транспортна розв'язка",
  },
  {
    icon: <Security fontSize="large" />,
    title: 'Безпека',
    description: 'Цілодобова охорона та система контролю доступу для максимальної безпеки',
  },
  {
    icon: <SportsTennis fontSize="large" />,
    title: 'Теніс та сквош',
    description: 'Професійні тенісні корти та сквош-корт з сучасним покриттям',
  },
  {
    icon: <ChildCare fontSize="large" />,
    title: 'Дитяча зона',
    description: 'Окрема дитяча зона з кваліфікованими вихователями та розвиваючими заняттями',
  },
  {
    icon: <LocalLibrary fontSize="large" />,
    title: 'Бібліотека',
    description: 'Бібліотека з літературою про здорове харчування та фітнес',
  },
  {
    icon: <LocalHospital fontSize="large" />,
    title: 'Медичний центр',
    description: 'Медичний центр з досвідченими лікарями та сучасним обладнанням',
  },
];

export const clubPhotos = [
  {
    url: gym1,
    title: 'Тренажерний зал',
  },
  {
    url: swimmingPool,
    title: 'Басейн',
  },
  {
    url: spaZone,
    title: 'SPA-зона',
  },
  {
    url: tennisCourt,
    title: 'Тенісний корт',
  },
  {
    url: childzone,
    title: 'Дитяча зона',
  },
  {
    url: restaurant,
    title: 'Ресторан',
  },
];

export const iconMap = {
  fitness: <FitnessCenter />,
  yoga: <SportsGymnastics />,
  dance: <SportsTennis />,
  martial_arts: <SportsMartialArts />,
  swimming: <Pool />,
  team_sports: <SportsTennis />,
};
