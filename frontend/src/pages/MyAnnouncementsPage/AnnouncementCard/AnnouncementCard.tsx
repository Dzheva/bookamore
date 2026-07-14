import { useEffect, useState, useRef } from 'react';
import { FaEdit } from 'react-icons/fa';
import { OfferStatus, type OfferType } from '@/types/entities/Offer';
import type { Book } from '@/types/entities/Book';
import { StatusSwitch } from '@/pages/MyAnnouncementsPage/AnnouncementCard/StatusSwitch/StatusSwitch';
import { DeleteOfferButton } from '@/pages/MyAnnouncementsPage/AnnouncementCard/DeleteOfferButton/DeleteOfferButton';
import noImages from '@/assest/images/noImage.jpg';
import { SynchronizeArrows } from '@/shared/ui/icons/Arrows';
import { useTranslation } from 'react-i18next';

const IMAGE_HOST = import.meta.env.VITE_IMAGE_HOST || '';

export interface Announcement {
  id: string;
  price: number;
  status: OfferStatus;
  type: OfferType;
  description?: string;
  book: Book;
}

interface AnnouncementCardProps {
  offer: Announcement;
  onToggleStatus: (offerId: string, currentStatus: OfferStatus) => void;
  onDeleteRequest: (offerId: string) => void;
}

export const AnnouncementCard = ({
  offer,
  onToggleStatus,
  onDeleteRequest,
}: AnnouncementCardProps) => {
  const [localStatus, setLocalStatus] = useState<OfferStatus>(offer.status);
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);
  const switchTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLocalStatus(offer.status);
  }, [offer.status]);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        clearTimeout(switchTimerRef.current);
      }
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const cardColor =
    localStatus === 'OPEN'
      ? 'border-[#A1D9D6] bg-[#F2FBFB]'
      : 'border-[#FFD9A1] bg-[#FFF9F2]';
  const accentColor =
    localStatus === 'OPEN' ? 'text-[#008080]' : 'text-[#E68A00]';
  const btnBorderColor =
    localStatus === 'OPEN' ? 'border-[#A1D9D6]' : 'border-[#FFD9A1]';

  const handleToggle = () => {
    const nextStatus =
      localStatus === OfferStatus.OPEN ? OfferStatus.CLOSED : OfferStatus.OPEN;
    setLocalStatus(nextStatus);

    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    switchTimerRef.current = window.setTimeout(() => {
      setExiting(true);

      exitTimerRef.current = window.setTimeout(() => {
        onToggleStatus(offer.id, offer.status);
      }, 300);
    }, 300);
  };

  const animationClasses = `transition-all duration-300 will-change-transform will-change-opacity ${
    exiting
      ? 'opacity-0 translate-x-6 scale-95'
      : entered
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 -translate-y-2'
  }`;

  return (
    <div className={`flex flex-col ${animationClasses}`}>
      {/* Кнопки над карткою */}
      <div className="flex mb-[-1px]">
        <DeleteOfferButton offer={offer} onDeleteRequest={onDeleteRequest} />
        <button
          className={`flex items-center gap-2 px-6 py-2 border ${btnBorderColor} border-b-white rounded-t-xl ${accentColor} text-sm font-medium bg-white`}
        >
          <FaEdit size={14} /> {t('myAnnouncements.change')}
        </button>
      </div>

      {/* Основне тіло картки */}
      <div
        className={`flex gap-4 p-4 border-2 ${cardColor} rounded-r-2xl rounded-bl-2xl shadow-sm`}
      >
        {/* Обкладинка */}
        <div className="w-28 h-40 shrink-0 shadow-md overflow-hidden rounded-md border border-gray-200">
          <img
            src={
              offer.book.images?.[0]?.path
                ? `${IMAGE_HOST}${offer.book.images?.[0]?.path}`
                : noImages
            }
            alt={offer.book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Інформація */}
        <div className="flex flex-col flex-1 py-1">
          {/* Перемикач статусу */}
          <StatusSwitch status={localStatus} onToggle={handleToggle} />

          <h3 className="text-xl font-bold text-text-black">
            {offer.book.title}
          </h3>
          <p className="text-sm text-text-black italic">
            {`${t('common.by')} ${offer.book.authors}`}
          </p>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-text-black">
              <span className="font-medium">{t('titles.condition')}:</span>{' '}
              <span className="capitalize">
                {t(`condition.${offer.book.condition}`)}
              </span>
            </p>
            <p className="text-sm text-text-black">
              <span className="font-medium">{t('titles.price')}:</span>
            </p>
            <div className="flex align-center justify-between">
              <p className="text-lg font-bold text-text-black">{`${offer.price} UAH`}</p>
              {offer.type === 'EXCHANGE' ||
                (offer.type === 'SELL_EXCHANGE' && (
                  <div
                    className="
                    flex items-center gap-[6px]
                    px-1 py-0.5 rounded-[12px]
                    text-[12px] md:text-[14px] lg:text-base
                  text-gray-600 bg-aquamarine-50"
                  >
                    <SynchronizeArrows />
                    {t('common.exchange')}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
