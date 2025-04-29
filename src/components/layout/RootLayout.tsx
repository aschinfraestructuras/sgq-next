import AppLayout from './AppLayout';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return <AppLayout>{children}</AppLayout>;
};

export default RootLayout; 