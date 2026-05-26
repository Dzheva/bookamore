import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAppSelector } from '@app/store/hooks';
import { selectIsAuthenticated } from '@app/store/slices/authSlice';
import { AuthPrompt } from '@shared/ui/AuthPrompt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  showPrompt?: boolean; // Показувати AuthPrompt замість перенаправлення
}

/**
 * Компонент для захисту маршрутів, які потребують авторизації
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  showPrompt = false,
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    if (showPrompt) {
      return <AuthPrompt isOpen={true} onClose={() => {}} />;
    }

    // Перенаправляємо на сторінку входу зі збереженням поточного маршруту
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
