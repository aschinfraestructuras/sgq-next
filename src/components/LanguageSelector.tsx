import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageIcon } from '@heroicons/react/24/outline';
import type { Language } from '@/types/i18n';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <LanguageIcon className="h-5 w-5 text-gray-500" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 