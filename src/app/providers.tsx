'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </LanguageProvider>
    </ThemeProvider>
  );
} 