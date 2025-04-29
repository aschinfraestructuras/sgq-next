import { useCallback } from 'react';
import { useRouter } from 'next/router';

type TranslationKey = string;

export function useTranslation() {
  const { locale } = useRouter();

  const t = useCallback((key: TranslationKey, params?: Record<string, string>) => {
    // TODO: Implement proper translation logic
    // For now, return the key as is
    return key;
  }, [locale]);

  return { t };
} 