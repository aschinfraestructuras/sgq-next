import { useCallback } from 'react';
import pt from '@/locales/pt.json';
import en from '@/locales/en.json';

const translations = {
  pt,
  en,
} as const;

type TranslationsType = typeof translations;
export type Language = keyof TranslationsType;
type PathsToStringProps<T> = T extends string ? [] : {
  [K in keyof T]: [K, ...PathsToStringProps<T[K]>]
}[keyof T];

type Join<T extends string[]> = T extends [] ? never : T extends [infer F] ? F : T extends [infer F, ...infer R] ? F extends string ? `${F}.${Join<Extract<R, string[]>}>` : never : string;

type TranslationKeys = Join<PathsToStringProps<TranslationsType[Language]>>;

export function useTranslation(language: Language = 'pt') {
  const t = useCallback((key: TranslationKeys): string => {
    const keys = key.split('.');
    let current = translations[language];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k as keyof typeof current];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return current as string;
  }, [language]);

  return { t };
} 