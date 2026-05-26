import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useRegisterMutation } from '@app/store/api/AuthApi';
import { PasswordValidator } from '../../modules/auth/ui/PasswordValidator';
import { Button } from '@/shared/ui/Button/Button';
import { BottomNav } from '@/shared/ui/BottomNav';
import { AlertSvg } from '@/shared/ui/icons/AlertSvg';
import { FormField } from '@/shared/ui/FormField';
import { AuthHeader } from '@/shared/ui/AuthHeader';
import { validators } from '@/shared/helpers/validators';
import { SocialAuthButton } from '@/shared/ui/SocialAuthButton';
import { useTranslation } from 'react-i18next';

interface ValidationError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const clearFieldError = (field: keyof SignUpFormData) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      form: undefined,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof SignUpFormData;
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearFieldError(field);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};

    if (!formData.name.trim()) {
      newErrors.name = 'validation.nameRequired';
    } else if (!validators.name(formData.name)) {
      newErrors.name = 'validation.nameInvalid';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'validation.confirmPassword';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'validation.passwordsDoNotMatch';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result?.message && result?.status !== 409) {
        navigate('/sign-in');
      } else if (result?.status === 409) {
        setErrors({ form: 'validation.emailInUse' });
      } else {
        setErrors({ form: 'validation.RegisterError' });
      }
    } catch (err) {
      setErrors({ form: 'validation.RegisterError' });
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex flex-col max-h-fit pb-[75px] overflow-x-auto scrollbar-custom">
      <AuthHeader />

      <main className="flex flex-col items-center max-w-md w-full mx-auto px-4">
        <h2 className="mb-5 text-h2m text-text-black">
          {t('auth.createAccount')}
        </h2>

        <form className="w-full" onSubmit={handleSubmit} noValidate>
          <FormField
            id="name"
            label={t('auth.name')}
            type="text"
            name="name"
            placeholder={t('auth.name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name ? t(errors.name) : undefined}
            required
          />

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

          {formData.password && !errors.password && (
            <div className="-mt-2 mb-4">
              <PasswordValidator password={formData.password} />
            </div>
          )}

          <FormField
            id="confirmPassword"
            label={t('auth.confirmPassword')}
            type="password"
            name="confirmPassword"
            placeholder={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={
              errors.confirmPassword ? t(errors.confirmPassword) : undefined
            }
            autoComplete="new-password"
            required
          />

          {/* FORM ERROR */}
          {errors.form && (
            <div className="flex items-center justify-between mb-4 rounded-xl border border-error bg-red-50 p-3 text-sm text-error">
              {t(errors.form)}
              <AlertSvg />
            </div>
          )}

          {/* SUBMIT */}
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? t('auth.signingUp') : t('auth.signUp')}
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

        {/* SIGN IN */}
        <div className="mt-6 mb-6 text-center text-sm">
          <span className="text-text-black">
            {t('auth.alreadyHaveAccount')}
          </span>{' '}
          <Link
            to="/sign-in"
            className="font-bold text-deep-blue hover:text-deep-blue-950"
          >
            {t('auth.signIn')}
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

export { SignUpPage };
