import React from 'react';
import RootLayout from '@/components/layout/RootLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
} 