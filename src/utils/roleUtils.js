export const ROLES = {
  ADMIN: 'admin',
  COACH: 'coach',
  USER: 'user',
};

export const checkUserRole = (user) => {
  if (!user) return null;
  return user.role || ROLES.USER;
};

export const isAdmin = (user) => checkUserRole(user) === ROLES.ADMIN;
export const isCoach = (user) => checkUserRole(user) === ROLES.COACH;
export const isUser = (user) => checkUserRole(user) === ROLES.USER;

export const canEditTraining = (user, training) => {
  if (!user || !training) return false;
  return isAdmin(user) || (isCoach(user) && training.coachId === user?.coach?._id);
};

export const canEditCoach = (user, coach) => {
  if (!user || !coach) return false;
  return isAdmin(user) || (isCoach(user) && coach.userId === user?.coach?._id);
};
