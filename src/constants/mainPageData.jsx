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
    url: 'https://5element.ua/upload/iblock/7c7/7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c.jpg',
    title: 'Тренажерний зал',
  },
  {
    url: 'https://5element.ua/upload/iblock/8d8/8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d8d.jpg',
    title: 'Басейн',
  },
  {
    url: 'https://5element.ua/upload/iblock/9e9/9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e9e.jpg',
    title: 'SPA-зона',
  },
  {
    url: 'https://5element.ua/upload/iblock/0f0/0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f.jpg',
    title: 'Тенісний корт',
  },
  {
    url: 'https://5element.ua/upload/iblock/1g1/1g1g1g1g1g1g1g1g1g1g1g1g1g1g1g1g.jpg',
    title: 'Дитяча зона',
  },
  {
    url: 'https://5element.ua/upload/iblock/2h2/2h2h2h2h2h2h2h2h2h2h2h2h2h2h2h2h.jpg',
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
