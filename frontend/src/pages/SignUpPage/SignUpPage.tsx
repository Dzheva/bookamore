import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router';
import { useRegisterMutation } from '@app/store/api/AuthApi';
import { PasswordValidator } from '../../modules/auth/ui/PasswordValidator';
import { Button } from '@/shared/ui/Button/Button';
import { BottomNav } from '@/shared/ui/BottomNav';
import { LogoSvg } from '@/shared/ui/LogoSvg/LogoSvg';
import { AlertSvg } from '@/shared/ui/icons/AlertSvg';
import { FormField } from '@/shared/ui/FormField';

interface ValidationError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

const REGISTER_ERROR = 'Registration failed. Please try again.';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationError>({});

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof ValidationError];
      delete newErrors.form;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        setErrors({ form: 'Email is already in use' });
      } else {
        setErrors({ form: REGISTER_ERROR });
      }
    } catch (err) {
      setErrors({ form: REGISTER_ERROR });
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="flex flex-col max-h-[calc(100vh-65px)] overflow-x-auto scrollbar-custom">
      <header className="flex justify-center py-5">
        <Link to="/">
          <LogoSvg className="text-deep-blue" />
        </Link>
      </header>

      <main className="flex flex-col items-center max-w-md w-full mx-auto px-4">
        <div>
          <h2 className="mb-5 text-h2m text-text-black">Create account</h2>
        </div>

        <form className="w-full" onSubmit={handleSubmit} noValidate>
          <FormField
            id="name"
            label="Name"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            required
          />

          {formData.password && !errors.password && (
            <div className="-mt-2 mb-4">
              <PasswordValidator password={formData.password} />
            </div>
          )}

          <FormField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          {/* FORM ERROR */}
          {errors.form && (
            <div className="flex items-center justify-between mb-4 rounded-xl border border-error bg-red-50 p-3 text-sm text-error">
              {errors.form}
              <AlertSvg />
            </div>
          )}

          {/* SUBMIT */}
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mt-6 mb-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-700 tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex flex-col max-w-fit mx-auto">
            {/* Facebook */}
            <button
              type="button"
              onClick={() => console.log('Facebook auth not implemented')}
              className="flex mb-4 w-full items-center justify-left rounded-full border border-[#747775] p-2.5 text-sm font-medium text-[#1F1F1F] hover:bg-gray-50"
            >
              <FaFacebook className="mr-2 h-5 w-5 text-[#1877F2]" />
              Continue with Facebook
            </button>
            {/* GOOGLE */}
            <button
              type="button"
              onClick={() => console.log('Google auth not implemented')}
              className="flex w-full items-center justify-left rounded-full border border-[#747775] p-2.5 text-sm font-medium text-[#1F1F1F] hover:bg-gray-50"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </button>
          </div>
        </form>

        {/* SIGN IN */}
        <div className="mt-6 mb-6 text-center text-sm">
          <span className="text-text-black">Already have an account?</span>{' '}
          <Link
            to="/sign-in"
            className="font-bold text-deep-blue hover:text-deep-blue-950"
          >
            Log in
          </Link>
        </div>

        {/* TERMS */}
        <p className="mb-4 text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link to="#" className="font-semibold text-gray-800 underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="#" className="font-semibold text-gray-800 underline">
            Privacy Policy
          </Link>
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export { SignUpPage };
