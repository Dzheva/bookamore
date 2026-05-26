import React, { useState } from 'react';
import { Eye, EyeSlash } from '@/shared/ui/icons/Eye';
import { AlertSvg } from '../icons/AlertSvg';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  name: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  name,
  placeholder,
  value,
  error,
  onChange,
  autoComplete,
  required = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-2 ml-3.5 block text-sm font-normal text-text-black"
      >
        {label}
        {required && '*'}
      </label>

      <div
        className={`relative group ${isPasswordField ? 'relative' : undefined}`}
      >
        <input
          id={id}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-xl border-1 py-2.5 px-3 text-text-black text-sm transition-colors focus:outline-none border-gray-300 focus:border-blue-500 group-hover:border-gray-500"
          aria-invalid={!!error}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            aria-pressed={isPasswordVisible}
            className="absolute inset-y-0 right-0 flex items-center px-2.5 rounded-xl text-gray-700 hover:text-icons-black focus-active:outline-grass-500 focus-active:text-icons-black cursor-pointer"
          >
            {isPasswordVisible ? <Eye /> : <EyeSlash />}
          </button>
        )}
        {error && (
          <AlertSvg
            className={`absolute top-1/2 -translate-y-1/2 ${isPasswordField ? 'right-11' : 'right-2.5'}`}
          />
        )}
      </div>

      {error && <p className="mt-1 ml-3 text-sm text-error">{error}</p>}
    </div>
  );
};

export { FormField };
