export const isVacancyPage = (): boolean => {
  return /^https:\/\/.*\.hh\.ru\/vacancy\/\d+/.test(window.location.href);
};

export const getVacancyContent = (): string => {
  const element = document.querySelector('div[data-qa="vacancy-description"]');
  return element?.textContent?.trim() || "";
};
