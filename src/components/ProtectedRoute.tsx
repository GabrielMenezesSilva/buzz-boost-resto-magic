import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, activeEmployee, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Force onboarding if not completed AND not already on the onboarding page
  if (profile && profile.onboarding_completed === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Prevent accessing onboarding again if already completed
  if (profile && profile.onboarding_completed === true && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check roles if allowedRoles is provided
  if (allowedRoles) {
    const effectiveRole = activeEmployee?.role || profile?.role || 'user';
    if (!allowedRoles.includes(effectiveRole)) {
      // Se for garçom e tentar acessar algo indevido, volta pro POS, senão dashboard
      return <Navigate to={effectiveRole === 'waiter' ? '/pos' : '/dashboard'} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;