import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Hide header/footer on auth page
  if (location.pathname === '/auth') {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // Hide header/footer on public forms if accessed via QR
  if (location.pathname.startsWith('/form/')) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <main className="flex-grow w-full max-w-[1600px] mx-auto xl:px-8">
        {children}
      </main>
      <AppFooter />
    </div>
  );
};

export default Layout;