import type { OfferStatus } from '@/types/entities/Offer';
import { useTranslation } from 'react-i18next';

export const StatusSwitch = ({
  status,
  onToggle,
}: {
  status: OfferStatus;
  onToggle: () => void;
}) => {
  const isOpen = status === 'OPEN';
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-2 mb-2">
      <label className="inline-block relative w-10 h-5">
        <input
          type="checkbox"
          className="peer w-0 h-0 opacity-0"
          checked={isOpen}
          onChange={onToggle}
        />
        <span
          className="absolute cursor-pointer inset-0  border-2 border-aquamarine-700 rounded-full transition-all duration-300
        peer-checked:bg-aquamarine-700 peer-checked:before:bg-white
          before:content-[''] before:absolute before:left-[2px] before:bottom-[2px] before:h-3 before:w-3 before:bg-aquamarine-700 before:rounded-full before:transition-all before:duration-300
          peer-checked:before:translate-x-5"
        ></span>
      </label>
      <span className="text-xs font-medium text-text-black">
        {isOpen
          ? t('myAnnouncements.availableBook')
          : t('myAnnouncements.unavailableBook')}
      </span>
    </div>
  );
};
