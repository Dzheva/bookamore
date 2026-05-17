import React from 'react';
import { useTranslation } from 'react-i18next';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

type SocialProvider = 'google' | 'facebook';

interface SocialAuthButtonProps {
  provider: SocialProvider;
  onClick: () => void;
}

const providerConfig = {
  google: {
    icon: <FcGoogle className="h-5 w-5" />,
    label: 'Google',
  },

  facebook: {
    icon: <FaFacebook className="h-5 w-5 text-[#1877F2]" />,
    label: 'Facebook',
  },
};

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  onClick,
}) => {
  const { t } = useTranslation();
  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 flex w-full items-center rounded-full border border-[#747775] p-2.5 text-sm font-medium text-[#1F1F1F] hover:bg-gray-50"
    >
      <span className="mr-2 flex items-center">{config.icon}</span>
      {t('auth.continueWith')} {config.label}
    </button>
  );
};

export { SocialAuthButton };
