import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { EmployeeLoginModal } from './pos/EmployeeLoginModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeEmployee } = useAuth();

  // We only run useEmployees if user is logged in
  const { employees, isLoading: loadingEmployees } = useEmployees();

  // Hide header/footer on certain pages
  const isAuthPage = location.pathname === '/auth';
  const isPublicForm = location.pathname.startsWith('/form/') || location.pathname.startsWith('/print/');
  const isPosPage = location.pathname === '/pos';

  const isPublicRoute = ['/', '/plans', '/support', '/privacy', '/terms', '/auth'].includes(location.pathname) || isPublicForm;

  if (isAuthPage || isPublicForm) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  // Global PIN Lock: if user is logged in, has employees, isn't on a public route, and hasn't entered PIN
  const activeEmployeesList = employees?.filter(emp => emp.active) || [];
  const needsPin = user && activeEmployeesList.length > 0 && !activeEmployee && !isPublicRoute;

  // Prevent UI flash while loading employees for protected routes
  if (user && loadingEmployees && !isPublicRoute) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando permissões...</div>;
  }

  if (needsPin) {
    return (
      <div className="min-h-screen bg-muted/10 flex flex-col items-center justify-center">
        <EmployeeLoginModal
          isOpen={true}
          onClose={() => {
            navigate('/'); // go to home if they close the PIN modal without logging in
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isPosPage && <AppHeader />}
      <main className={`flex-grow w-full ${!isPosPage ? "max-w-[1600px] mx-auto xl:px-8" : ""}`}>
        {children}
      </main>
      {!isPosPage && <AppFooter />}
    </div>
  );
};

export default Layout;