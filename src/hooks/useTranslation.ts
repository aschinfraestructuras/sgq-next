import { useCallback } from 'react';
import pt from '@/locales/pt.json';
import en from '@/locales/en.json';

const translations = {
  pt,
  en,
} as const;

type TranslationsType = typeof translations;
export type Language = keyof TranslationsType;

type PathsToStringProps<T> = T extends string | number
  ? []
  : T extends object
    ? { [K in keyof T]: [K, ...PathsToStringProps<T[K]>] }[keyof T]
    : never;

type Join<T extends any[]> = T extends []
  ? never
  : T extends [infer Only]
    ? Only
    : T extends [infer First, ...infer Rest]
      ? First extends string | number
        ? Rest extends (string | number)[]
          ? `${First}.${Join<Rest>}`
          : never
        : never
      : string;

export type TranslationKeys = Join<PathsToStringProps<TranslationsType[Language]>>;

export function useTranslation(language: Language = 'pt') {
  const t = useCallback((key: TranslationKeys | string): string => {
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