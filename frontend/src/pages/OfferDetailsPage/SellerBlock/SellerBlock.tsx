import { useTranslation } from 'react-i18next';
import type { Seller } from '@/types/entities/OfferWithBook';

export const SellerBlock = ({ seller }: { seller: Seller }) => {
  const { t } = useTranslation();
  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
      <h2 className="mb-1 text-base lg:text-lg font-medium text-text-black">
        {t('bookDetails.seller')}
      </h2>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center">
          {seller.avatar ? (
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-sm lg:text-base font-medium text-gray-500 uppercase">
              {seller.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
          )}
        </div>
        <p className="text-sm lg:text-base text-text-black capitalize">
          {seller.name}
        </p>
      </div>
    </section>
  );
};
