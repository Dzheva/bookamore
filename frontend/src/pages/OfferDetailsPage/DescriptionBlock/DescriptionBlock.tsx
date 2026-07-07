import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowUp } from '@/shared/ui/icons/Arrows';

export const DescriptionBlock = ({
  onClick,
  isOpen,
  description,
}: {
  onClick: () => void;
  isOpen: boolean;
  description: string;
}) => {
  const { t } = useTranslation();

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-4 bg-[#F7F8F2]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-lg lg:text-xl font-medium text-text-black">
          {t('bookDetails.description')}
        </h2>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </button>

      {isOpen && (
        <div className="text-sm lg:text-base mt-3 text-[#153037]">
          <p>{description || 'No description available for this book.'}</p>
          <p className="text-xs lg:text-sm font-h6m text-[#153037] mt-4 ">
            {t('bookDetails.dateAdded')}{' '}
            {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
      )}
    </section>
  );
};
