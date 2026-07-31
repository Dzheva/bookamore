import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCredentials, setCurrentUser } from '@app/store/slices/authSlice';
import { useLazyGetCurrentUserQuery } from '@/app/store/api/UsersApi';
import { Spinner } from '@/shared/ui/Spinner';

/**
 * Lands here after the OAuth2 provider redirects back through the backend:
 * `${CLIENT_URL}/oauth2/callback?token=...` on success, `?error=...` on failure.
 */
const OAuth2CallbackPage: React.FC = () => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  // StrictMode mounts effects twice in dev — the token must be consumed only once
  const isHandled = useRef(false);

  useEffect(() => {
    if (isHandled.current) return;
    isHandled.current = true;

    const token = searchParams.get('token');

    if (!token) {
      navigate('/sign-in', { replace: true, state: { oauthError: true } });
      return;
    }

    dispatch(setCredentials({ token }));

    const finishLogin = async () => {
      try {
        const user = await getCurrentUser().unwrap();
        dispatch(setCurrentUser(user));
      } catch (err) {
        console.warn('Failed to fetch user data:', err);
      }

      navigate('/', { replace: true });
    };

    void finishLogin();
  }, [searchParams, dispatch, getCurrentUser, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-700">{t('auth.signingIn')}</p>
    </div>
  );
};

export { OAuth2CallbackPage };
