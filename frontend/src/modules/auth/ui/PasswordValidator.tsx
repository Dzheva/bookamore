import React from 'react';
import { ValidationRequirement } from '@/shared/ui/ValidationRequirement'; // компонент, який ми обговорювали раніше

interface PasswordValidatorProps {
  password: string;
}

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password }) => {
  // Логіка перевірки збігається з вашим Backend (@Pattern)
  const requirements = [
    { 
      label: "At least 6 characters", 
      isValid: password.length >= 6 
    },
    { 
      label: "At least 1 uppercase letter (A-Z)", 
      isValid: /[A-Z]/.test(password) 
    },
    { 
      label: "At least 1 lowercase letter (a-z)", 
      isValid: /[a-z]/.test(password) 
    },
    // Можна додати спецсимволи, якщо вирішите їх вимагати пізніше
    { 
      label: "Supports special characters (!@#$%)", 
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password) 
    },
  ];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 rounded-lg bg-gray-50 p-3 border border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Security requirements
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