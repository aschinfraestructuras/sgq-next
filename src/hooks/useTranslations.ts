import { useRouter } from 'next/router';
import translations from '@/i18n/translations';
import { Language } from '@/i18n/translations';

export function useTranslations() {
  const router = useRouter();
  const locale = (router.locale || 'pt') as Language;

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      if (!value || typeof value !== 'object') return key;
      value = value[k];
    }

    if (typeof value !== 'string') return key;

    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, param) => {
        return String(params[param] ?? `{${param}}`);
      });
    }

    return value;
  };

  return t;
}

export default useTranslations; 