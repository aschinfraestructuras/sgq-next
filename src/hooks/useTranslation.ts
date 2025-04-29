import { useLanguage } from './useLanguage';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.pt) => {
    return translations[language][key];
  };

  return { t };
}; 