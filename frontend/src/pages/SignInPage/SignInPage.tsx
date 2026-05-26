import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useLoginMutation } from '@app/store/api/AuthApi';
import { useDispatch } from 'react-redux';
import { setCredentials, setCurrentUser } from '@app/store/slices/authSlice';
import { useLazyGetCurrentUserQuery } from '@/app/store/api/UsersApi';
import { BottomNav } from '@/shared/ui/BottomNav';
import { Button } from '@/shared/ui/Button/Button';
import { AlertSvg } from '@/shared/ui/icons/AlertSvg';
import { FormField } from '@/shared/ui/FormField';
import { AuthHeader } from '@/shared/ui/AuthHeader';
import { validators } from '@/shared/helpers/validators';
import { SocialAuthButton } from '@/shared/ui/SocialAuthButton';
import { useTranslation } from 'react-i18next';

interface ValidationError {
  email?: string;
  password?: string;
  form?: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  const clearFieldError = (field: keyof SignInFormData) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof SignInFormData;
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearFieldError(field);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};

    if (!formData.email.trim()) {
      newErrors.email = 'validation.emailRequired';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'validation.emailInvalid';
    }

    if (!formData.password) {
      newErrors.password = 'validation.passwordRequired';
    } else if (!validators.password(formData.password)) {
      newErrors.password = 'validation.passwordMinLength';
    }

    setErrors(newErrors);

    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await login(formData).unwrap();

      if (!result?.token) {
        setErrors({ form: 'validation.authError' });
        return;
      }

      dispatch(setCredentials({ token: result.token }));

      try {
        const user = await getCurrentUser().unwrap();
        dispatch(setCurrentUser(user));
      } catch (err) {
        console.warn('Failed to fetch user data:', err);
      }

      const from = location.state?.from?.pathname || '/';

      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login failed:', err);
      setErrors({ form: 'validation.authError' });
    }
  };

  return (
    <div className="flex flex-col max-h-fit pb-[75px] overflow-x-auto scrollbar-custom">
      <AuthHeader />

      <main className="flex flex-col items-center w-full max-w-md mx-auto px-4">
        <h2 className="mb-5 text-h2m text-text-black">{t('auth.logIn')}</h2>

        <form className="w-full" onSubmit={handleSubmit} noValidate>
          <FormField
            id="email"
            label={t('auth.email')}
            type="email"
            name="email"
            placeholder={t('auth.email')}
            value={formData.email}
            onChange={handleChange}
            error={errors.email ? t(errors.email) : undefined}
            autoComplete="email"
            required
          />

          <FormField
            id="password"
            label={t('auth.password')}
            type="password"
            name="password"
            placeholder={t('auth.password')}
            value={formData.password}
            onChange={handleChange}
            error={errors.password ? t(errors.password) : undefined}
            autoComplete="current-password"
            required
          />

          {/* FORM ERROR */}
          {errors.form && (
            <div className="flex items-center justify-between mb-4 rounded-xl border border-error bg-red-50 p-3 text-sm text-error">
              {t(errors.form)}
              <AlertSvg />
            </div>
          )}

          {/* FORGOT PASSWORD */}
          <div className="mb-5 text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* SUBMIT */}
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? t('auth.signingIn') : t('auth.signIn')}
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mt-6 mb-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-700 tracking-wider">
              {t('auth.or')}
            </span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex flex-col max-w-fit mx-auto">
            <SocialAuthButton
              provider="google"
              onClick={() => console.log('Google auth')}
            />

            <SocialAuthButton
              provider="facebook"
              onClick={() => console.log('Facebook auth')}
            />
          </div>
        </form>

        {/* SIGN UP */}
        <div className="mt-6 mb-6 text-center text-sm">
          <span className="text-text-black">{t('auth.dontHaveAccount')}</span>{' '}
          <Link
            to="/sign-up"
            className="font-bold text-deep-blue hover:text-deep-blue-950"
          >
            {t('auth.signUp')}
          </Link>
        </div>

        {/* TERMS */}
        <p className="mb-4 text-center text-xs text-gray-500">
          {t('auth.acceptance')}{' '}
          <Link to="#" className="font-semibold text-gray-800 underline">
            {t('auth.terms')}
          </Link>{' '}
          {t('auth.and')}{' '}
          <Link to="#" className="font-semibold text-gray-800 underline">
            {t('auth.privacy')}
          </Link>
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export { SignInPage };
