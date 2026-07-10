import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '@/app/store/api/UsersApi.ts';
import {
  useGetAllOffersWithBooksQuery,
  useUpdateOfferByIdMutation,
} from '@/app/store/api/OffersApi.ts';
import { BottomNav } from '@/shared/ui/BottomNav';
import { OfferStatus } from '@/types/entities/Offer';
import { Button } from '@/shared/ui/Button/Button.tsx';
import HeaderTitle from '@/shared/ui/HeaderTitle.tsx';
import {
  AnnouncementCard,
  type Announcement,
} from '@/pages/MyAnnouncementsPage/AnnouncementCard/AnnouncementCard.tsx';
import { useTranslation } from 'react-i18next';

const MyAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateOfferById] = useUpdateOfferByIdMutation();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { t } = useTranslation();

  const { data: offersWithBooks } = useGetAllOffersWithBooksQuery(
    currentUser?.id ? { sellerId: currentUser.id, size: 10 } : undefined,
    { skip: !currentUser?.id }
  );

  useEffect(() => {
    setAnnouncements(offersWithBooks?.content ?? []);
  }, [offersWithBooks]);

  const handleStatusToggle = async (
    offerId: string,
    currentStatus: OfferStatus
  ) => {
    const nextStatus =
      currentStatus === OfferStatus.OPEN
        ? OfferStatus.CLOSED
        : OfferStatus.OPEN;

    setAnnouncements((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, status: nextStatus } : offer
      )
    );

    try {
      await updateOfferById({
        id: offerId,
        offer: { status: nextStatus },
      }).unwrap();
    } catch {
      setAnnouncements((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: currentStatus } : offer
        )
      );
    }
  };

  const availableBooks =
    announcements.filter((offer) => offer.status === OfferStatus.OPEN) || [];

  const unavailableBooks =
    announcements.filter((offer) => offer.status !== OfferStatus.OPEN) || [];

  return (
    <>
      {/* Header */}
      <HeaderTitle title={t('myAnnouncements.title')} className="mb-4" />
      <main className="w-full mx-auto lg:max-w-6xl xl:max-w-7xl mb-[80px] space-y-5">
        {/* Кнопка додавання нової книги */}
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <Button
            onClick={() => navigate('/offers/new')}
            // className="px-4 sm:px-6 lg:px-8 xl:px-12 mb-4"
          >
            {t('myAnnouncements.add')}
          </Button>
        </section>

        {announcements.length === 0 && (
          <section className="px-4 sm:px-6 lg:px-8 xl:px-12 space-y-5">
            <h2 className="text-h3m md:text-xl xl:text-2xl font-bold text-slate-800 text-center">
              {t('myAnnouncements.noAnnouncements')}
            </h2>
          </section>
        )}
        {/* Секція Available */}
        {availableBooks.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-2xl font-bold text-slate-800">
              {t('myAnnouncements.available')}
            </h2>
            <div className="space-y-5">
              {availableBooks?.map((offer) => (
                <AnnouncementCard
                  key={offer.id}
                  offer={offer}
                  onToggleStatus={handleStatusToggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Секція Unavailable */}
        {unavailableBooks.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 xl:px-12 space-y-5">
            <h2 className="text-2xl font-bold text-slate-800">
              {t('myAnnouncements.unavailable')}
            </h2>
            <div className="space-y-5">
              {unavailableBooks?.map((offer) => (
                <AnnouncementCard
                  key={offer.id}
                  offer={offer}
                  onToggleStatus={handleStatusToggle}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default MyAnnouncementsPage;
