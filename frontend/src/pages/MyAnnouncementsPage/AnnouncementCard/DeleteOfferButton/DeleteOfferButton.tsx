import { FaTrashAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface DeleteOfferButtonProps {
  offer: {
    id: string;
  };
  onDeleteRequest: (offerId: string) => void;
  disabled?: boolean;
}

export const DeleteOfferButton = ({
  offer,
  onDeleteRequest,
  disabled = false,
}: DeleteOfferButtonProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => onDeleteRequest(offer.id)}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-2 border border-red-200 border-b-white rounded-t-xl text-red-500 text-sm font-medium bg-white transition-opacity cursor-pointer ${
        disabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-red-50'
      }`}
    >
      <FaTrashAlt size={14} />
      {t('myAnnouncements.delete')}
    </button>
  );
};
