import { Link } from 'react-router-dom';
import { LogoSvg } from '@/shared/ui/LogoSvg/LogoSvg';
import { LanguageSwitch } from '@/shared/components/LanguageSwitch/LanguageSwitch';
import { NotFoundImage } from './Image/NotFoundImage';
import { Button } from '@/shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-screen mx-auto lg:max-w-6xl xl:max-w-7xl text-center overflow-x-hidden">
      <header className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between py-4 px-[10px]">
          <Link to="/">
            <LogoSvg />
          </Link>
          <LanguageSwitch />
        </div>
      </header>

      <main className="h-[calc(100vh-63px)] flex flex-col justify-between pt-[115px] pb-[74px]">
        <NotFoundImage
          className="
            w-full h-auto mx-auto scale-105
            xs:w-[475px]
            sm:w-[600px] sm:scale-100
          "
        />

        <div className="max-w-[276px] sm:max-w-[343px] mx-auto space-y-3.5 text-text-black">
          <p className="text-h2m sm:text-[24px]">{t('notFound.title')}</p>
          <p className="text-h6m sm:text-[16px]">{t('notFound.description')}</p>
        </div>

        <Link to="/" className="w-[343px] block mx-auto">
          <Button variant="primary">{t('notFound.backToHome')}</Button>
        </Link>
      </main>
    </div>
  );
};
