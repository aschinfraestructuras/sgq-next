import { useState, useEffect } from 'react';
import { Language } from '../types/i18n';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    // Aqui você pode adicionar lógica para carregar o idioma salvo
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return { language, toggleLanguage };
}; 