import { useCallback } from 'react';
import pt from '@/locales/pt.json';
import en from '@/locales/en.json';

const translations = {
  pt,
  en,
} as const;

type TranslationsType = typeof translations;
export type Language = keyof TranslationsType;

type PathsToStringProps<T> = T extends string 
  ? [] 
  : { [K in keyof T]: [K, ...PathsToStringProps<T[K]>] }[keyof T];

type Join<T> = T extends []
  ? never
  : T extends [string]
    ? T[0]
    : T extends [string, ...infer Rest]
      ? `${T[0]}.${Join<Rest>}`
      : never;

type TranslationKeys = Join<PathsToStringProps<TranslationsType[Language]>>;

export function useTranslation(language: Language = 'pt') {
  const t = useCallback((key: TranslationKeys): string => {
    const keys = key.split('.');
    let current: any = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof current !== 'string') {
      console.warn(`Translation value is not a string: ${key}`);
      return key;
    }
    
    return current;
  }, [language]);

  return { t };
} 