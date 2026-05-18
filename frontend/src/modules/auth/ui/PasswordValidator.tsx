import React from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationRequirement } from '@/shared/ui/ValidationRequirement'; // компонент, який ми обговорювали раніше

interface PasswordValidatorProps {
  password: string;
}

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({
  password,
}) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: 'passwordValidator',
  });
  // Логіка перевірки збігається з вашим Backend (@Pattern)
  const requirements = [
    {
      label: t('minLength'),
      isValid: password.length >= 6,
    },
    {
      label: t('uppercase'),
      isValid: /[A-Z]/.test(password),
    },
    {
      label: t('lowercase'),
      isValid: /[a-z]/.test(password),
    },
    // Можна додати спецсимволи, якщо вирішите їх вимагати пізніше
    {
      label: t('specialChar'),
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3 border border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {t('requirements')}
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {requirements.map((req, index) => (
          <ValidationRequirement
            key={index}
            label={req.label}
            isValid={req.isValid}
          />
        ))}
      </div>
    </div>
  );
};
