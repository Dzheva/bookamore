import { useTranslation } from 'react-i18next';

export const ConditionBlock = ({ condition }: { condition: string }) => {
  const { t } = useTranslation();
  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex items-center py-3 gap-6">
        <h3 className="text-base lg:text-lg font-medium text-text-black">
          {t('titles.condition')}
        </h3>
        <p className="text-sm lg:text-base px-2 py-1 border border-aquamarine-100 rounded-[12px] text-text-black">
          {t(`condition.${condition}`)}
        </p>
      </div>
    </section>
  );
};
