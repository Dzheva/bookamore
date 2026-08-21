import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  setCredentials,
  setCurrentUser,
  clearAuth,
} from '@app/store/slices/authSlice';
import { useLazyGetCurrentUserQuery } from '@/app/store/api/UsersApi';

export const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const handleOAuthCallback = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');

      if (!token) {
        navigate('/sign-in', { replace: true });
        return;
      }

      processedRef.current = true;

      // Убираем JWT из URL
      window.history.replaceState({}, '', '/login');

      // Сохраняем токен и обновляем Redux
      dispatch(setCredentials({ token }));

      try {
        const user = await getCurrentUser().unwrap();

        dispatch(setCurrentUser(user));

        navigate('/', { replace: true });
      } catch (error) {
        console.warn('Failed to fetch user after OAuth authentication:', error);

        dispatch(clearAuth());
        navigate('/sign-in', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [dispatch, getCurrentUser, navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-deep-blue border-t-transparent" />
        <p className="text-sm font-medium text-gray-700">Авторизація...</p>
      </div>
    </div>
  );
};
