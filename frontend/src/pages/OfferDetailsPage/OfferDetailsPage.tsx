import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  useGetAllOffersWithBooksQuery,
  useGetOfferWithBookByIdQuery,
} from '../../app/store/api/OffersApi';

import { FavoriteButton } from './FavoriteButton';
import { BookDetailsCard } from './BookDetailsCard';
import { ConditionBlock } from './ConditionBlock';
import { GenresBlock } from './GenresBlock';
import { DescriptionBlock } from './DescriptionBlock';
import { SellerBlock } from './SellerBlock';

import { BottomNav } from '@/shared/ui/BottomNav';
import { BookSection } from '@/shared/ui/BookSection';
import HeaderTitle from '@/shared/ui/HeaderTitle';

import type { Category } from '@/shared/constants/categories';
import type { OfferWithBook } from '@/types/entities/OfferWithBook';

const OfferDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { offerId } = useParams<{ offerId: string }>();

  const [imgIndex, setImgIndex] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setImgIndex(0);
  }, [offerId]);

  const {
    data: offer,
    isLoading,
    error,
  } = useGetOfferWithBookByIdQuery(offerId || '', { skip: !offerId });

  const similarBooksQuery = useGetAllOffersWithBooksQuery(
    offer?.book?.genres?.length
      ? { genre: offer.book.genres[0] as Category, size: 10 }
      : undefined,
    { skip: !offer?.book?.genres?.length }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error || !offer) return <div>Not found</div>;

  const { book, seller } = offer;

  const images = Array.isArray(book.images) ? book.images : [];

  const currentGenres = book.genres || [];

  const similarBooks =
    similarBooksQuery.data?.content
      ?.filter((item: OfferWithBook) => {
        if (item.id === offer.id) return false;

        return item.book.genres?.some((genre) => currentGenres.includes(genre));
      })
      .slice(0, 10) || [];

  return (
    <>
      <HeaderTitle
        title={t('bookDetails.title')}
        icon={
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => setIsFavorite((v) => !v)}
          />
        }
      />

      <main className="w-full mx-auto lg:max-w-6xl xl:max-w-7xl mb-[80px]">
        <BookDetailsCard
          offer={offer}
          book={book}
          images={images}
          imgIndex={imgIndex}
          setImgIndex={setImgIndex}
        />

        <ConditionBlock condition={offer.book.condition} />

        <GenresBlock genres={book.genres} />

        <DescriptionBlock
          onClick={() => setIsAboutOpen((v) => !v)}
          isOpen={isAboutOpen}
          description={book.description}
        />

        <SellerBlock seller={seller} />

        <BookSection
          offers={similarBooks}
          title={t('bookDetails.similarBooks')}
          isLoading={isLoading}
          showViewAll={false}
        />
      </main>

      <BottomNav />
    </>
  );
};

export { OfferDetailsPage };
