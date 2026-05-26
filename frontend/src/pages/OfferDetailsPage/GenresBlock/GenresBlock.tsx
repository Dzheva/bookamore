import { useTranslation } from 'react-i18next';

export const GenresBlock = ({ genres }: { genres: string[] }) => {
  const { t } = useTranslation();
  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex items-center py-3 gap-6">
        <span className="text-base lg:text-lg font-medium text-text-black">
          {t('titles.category')}
        </span>
        <div className="flex items-center gap-4 flex-wrap">
          {genres?.map((g: string) => (
            <span
              key={g}
              className="text-sm lg:text-base px-2 py-1 bg-aquamarine-50 rounded-[12px] text-text-black"
            >
              {t(`categories.${g.toLowerCase()}`)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
