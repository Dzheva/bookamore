import { Button } from '@/shared/ui/Button/Button';
import { CrossSvg } from '@/shared/ui/icons/CrossSvg';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({
  isOpen,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-[342px] max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pt-7 pb-6 px-5">
          <p className="text-center text-h4m text-error mb-3">
            {t('deleteModal.warning')}
          </p>
          <p className="text-center text-h6m text-text-black">
            {t('deleteModal.confirmation')}
          </p>
        </div>

        <div className="flex justify-center gap-6 px-7 pb-7">
          <Button type="button" onClick={onConfirm} disabled={isLoading}>
            {t('deleteModal.confirmButton')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('deleteModal.cancelButton')}
          </Button>
        </div>

        <button
          className="absolute right-2 top-2 p-1 cursor-pointer hover:bg-grass-100 rounded-full outline-grass-500 focus:bg-grass-100"
          onClick={onClose}
          aria-label="Close"
        >
          <CrossSvg className="text-icons-black" />
        </button>
      </div>
    </div>
  );
};
