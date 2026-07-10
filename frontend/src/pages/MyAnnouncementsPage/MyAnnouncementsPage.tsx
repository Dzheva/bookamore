import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useGetCurrentUserQuery } from '@/app/store/api/UsersApi.ts';
import {
  useGetAllOffersWithBooksQuery,
  useUpdateOfferByIdMutation,
} from '@/app/store/api/OffersApi.ts';

import { BottomNav } from '@/shared/ui/BottomNav';
import { Button } from '@/shared/ui/Button/Button.tsx';
import HeaderTitle from '@/shared/ui/HeaderTitle.tsx';

import {
  AnnouncementCard,
  type Announcement,
} from '@/pages/MyAnnouncementsPage/AnnouncementCard/AnnouncementCard.tsx';

import { OfferStatus } from '@/types/entities/Offer';

const MyAnnouncementsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateOfferById] = useUpdateOfferByIdMutation();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const { data: offersWithBooks, isSuccess } = useGetAllOffersWithBooksQuery(
    currentUser?.id
      ? {
          sellerId: currentUser.id,
          size: 10,
        }
      : undefined,
    {
      skip: !currentUser?.id,
    }
  );

  useEffect(() => {
    if (offersWithBooks?.content) {
      setAnnouncements(offersWithBooks.content);
    }
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
        offer: {
          status: nextStatus,
        },
      }).unwrap();
    } catch {
      setAnnouncements((prev) =>
        prev.map((offer) =>
          offer.id === offerId ? { ...offer, status: currentStatus } : offer
        )
      );
    }
  };

  const availableBooks = announcements.filter(
    (offer) => offer.status === OfferStatus.OPEN
  );

  const unavailableBooks = announcements.filter(
    (offer) => offer.status !== OfferStatus.OPEN
  );

  const hasAnnouncements = (offersWithBooks?.content?.length ?? 0) > 0;

  return (
    <>
      <HeaderTitle title={t('myAnnouncements.title')} className="mb-4" />

      <main className="mx-auto mb-[80px] w-full space-y-5 lg:max-w-6xl xl:max-w-7xl">
        <section className="px-4 sm:px-6 lg:px-8 xl:px-12">
          <Button onClick={() => navigate('/offers/new')}>
            {t('myAnnouncements.add')}
          </Button>
        </section>

        {isSuccess && !hasAnnouncements && (
          <section className="space-y-5 px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-center text-h3m font-bold text-slate-800 md:text-xl xl:text-2xl">
              {t('myAnnouncements.noAnnouncements')}
            </h2>
          </section>
        )}

        {availableBooks.length > 0 && (
          <section className="space-y-5 px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-2xl font-bold text-slate-800">
              {t('myAnnouncements.available')}
            </h2>

            <div className="space-y-5">
              {availableBooks.map((offer) => (
                <AnnouncementCard
                  key={offer.id}
                  offer={offer}
                  onToggleStatus={handleStatusToggle}
                />
              ))}
            </div>
          </section>
        )}

        {unavailableBooks.length > 0 && (
          <section className="space-y-5 px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-2xl font-bold text-slate-800">
              {t('myAnnouncements.unavailable')}
            </h2>

            <div className="space-y-5">
              {unavailableBooks.map((offer) => (
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
