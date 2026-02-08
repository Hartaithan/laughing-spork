export const isVacancyPage = (): boolean => {
  return /^https:\/\/.*\.hh\.ru\/vacancy\/\d+/.test(window.location.href);
};
