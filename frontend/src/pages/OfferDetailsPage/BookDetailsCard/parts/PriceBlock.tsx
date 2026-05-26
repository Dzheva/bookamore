import { SynchronizeArrows } from '@/shared/ui/icons/Arrows';

export const PriceBlock = ({
  price,
  showExchange,
  t,
}: {
  price: number;
  showExchange: boolean;
  t: (key: string) => string;
}) => (
  <div className="flex items-center gap-[100px]">
    <p className="text-h5m md:text-[16px] lg:text-[18px] xl:text-[20px] text-text-black">
      {price} UAH
    </p>

    {showExchange && (
      <div
        className="
          flex items-center gap-[6px]
          px-2 py-1 lg:px-3 lg:py-2 rounded
          text-[12px] md:text-[14px] lg:text-base
          text-gray-600 bg-aquamarine-50"
      >
        <SynchronizeArrows />
        {t('common.exchange')}
      </div>
    )}
  </div>
);
