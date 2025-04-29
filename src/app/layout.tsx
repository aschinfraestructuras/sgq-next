import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from 'react-hot-toast';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'SGQ NEXT - Sistema Global de Gestão da Qualidade',
  description: 'Plataforma completa para gestão de qualidade, ensaios, documentação e conformidade.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} antialiased`}>
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
      </body>
    </html>
  );
} 