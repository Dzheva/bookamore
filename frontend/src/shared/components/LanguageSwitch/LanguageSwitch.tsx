import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const LANGUAGES = [
  {
    code: 'en',
    label: 'Eng',
    ariaKey: 'languageSwitcher.english',
    lang: 'en',
  },
  {
    code: 'ua',
    label: 'Ua',
    ariaKey: 'languageSwitcher.ukrainian',
    lang: 'uk',
  },
] as const;

export const LanguageSwitch: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { i18n, t } = useTranslation();

  const currentLng = i18n.language;

  const changeLanguage = (lng: string) => {
    if (lng === currentLng) return;

    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const buttonClass = (isActive: boolean) =>
    clsx(
      'text-[14px] rounded-sm px-1 transition-colors outline-grass-500 focus-visible:outline-2 focus-visible:outline-offset-2',
      isActive
        ? 'font-bold cursor-default text-text-black'
        : 'font-medium cursor-pointer text-gray-500 hover:text-gray-800'
    );

  return (
    <div
      className={className}
      role="group"
      aria-label={t('languageSwitcher.label')}
    >
      {LANGUAGES.map((language, index) => {
        const isActive = currentLng === language.code;

        return (
          <div key={language.code} className="inline-flex items-center">
            <button
              type="button"
              onClick={() => changeLanguage(language.code)}
              className={buttonClass(isActive)}
              aria-pressed={isActive}
              aria-label={t(language.ariaKey)}
              lang={language.lang}
              disabled={isActive}
            >
              {language.label}
            </button>

            {index < LANGUAGES.length - 1 && (
              <span className="mx-1" aria-hidden="true">
                |
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
