import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { useGetOfferWithBookByIdQuery } from '../../app/store/api/OffersApi';
import { BottomNav } from '../../shared/ui/BottomNav';
import {
  getOfferWithBookById,
  createMockOfferResponse,
  getOffersByGenre,
  getSellerById,
} from '../../shared/mocks/mockData';
import noImages from '@/assest/images/noImage.jpg';
import HeaderTitle from '@/shared/ui/HeaderTitle';
import { FavoritesSvg } from '@/shared/ui/bottomNavImg/FavoritesSvg';
import {
  ArrowLeft,
  ArrowRight,
  SynchronizeArrows,
  ArrowUp,
  ArrowDown,
} from '../../../public/svg/Arrow';

function Dots({
  count,
  active,
  onPick,
}: {
  count: number;
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPick(i)}
          className={`w-2.5 h-2.5 rounded-full border ${
            i === active
              ? 'bg-gray-800 border-gray-800'
              : 'bg-white border-gray-400'
          }`}
          aria-label={`go to image ${i + 1}`}
        />
      ))}
    </div>
  );
}

const OfferDetailsPage: React.FC = () => {
  const { offerId } = useParams<{ offerId: string }>();
  const navigate = useNavigate();
  // const [isFavorite, setIsFavorite] = useState(false);
  const [, setIsFavorite] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  // Try API first, fallback to mocks only on error
  const apiResult = useGetOfferWithBookByIdQuery(offerId || '', {
    skip: !offerId,
  });

  // Determine which data source to use with proper typing
  let finalData: typeof apiResult.data = apiResult.data;
  let isLoading = apiResult.isLoading;
  let error = apiResult.error;

  // Fallback to mocks only if API call has an error and offerId exists
  if (error && offerId && !finalData) {
    const mockOffer = getOfferWithBookById(offerId);
    if (mockOffer) {
      finalData = createMockOfferResponse(mockOffer) as typeof apiResult.data;
      isLoading = false;
      error = undefined;
    }
  }

  const offer = finalData;

  const handleFavoriteToggle = () => setIsFavorite((v) => !v);
  const handleContact = () => console.log('Contact seller for offer:', offerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-600">Book not found</p>
      </div>
    );
  }

  const { book } = offer;
  const images: string[] =
    Array.isArray(book.images) && book.images.length ? book.images : [];
  const hasMultipleImages = images.length > 1;
  const onPrev = () => setImgIndex((p) => (p > 0 ? p - 1 : images.length - 1));
  const onNext = () => setImgIndex((p) => (p < images.length - 1 ? p + 1 : 0));

  // Get similar books based on genres
  const getSimilarBooks = () => {
    if (!book.genres?.length) return [];

    // Get books from the same genres, excluding the current book
    const similarOffers = getOffersByGenre(book.genres[0])
      .filter((similarOffer) => similarOffer.id !== offer.id)
      .slice(0, 4); // Limit to 4 books

    return similarOffers;
  };

  const similarBooks = getSimilarBooks();

  // Get seller information
  const seller = getSellerById(offer.sellerId) || {
    id: 0,
    name: 'Unknown Seller',
    avatar: '',
  };

  return (
    <div className="min-h-screen">
      <HeaderTitle
        title="Detail Book"
        icon={<FavoritesSvg />}
        onIconClick={handleFavoriteToggle}
      />

      <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl xl:">
        <div className="px-4 sm:px-6 md:px-0  ">
          <div
            className="flex flex-col  lg:gap-8 items-center
            py-5 px-4
          bg-[#FFF8EB]
            border-[1px]  border-none rounded-[24px]
            w-full"
          >
            <div className="flex items-center flex-col mb-1 sm:mb-2">
              <h2 className=" font-h3m flex items-center text-black">
                {book.title}
              </h2>
              <p className="font-h6m text-[#676767] ">
                {book.authors?.join(', ')}
              </p>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="w-32 sm:w-40 lg:w-full flex-shrink-0 h-44 sm:h-56 lg:h-80 rounded-xl   flex items-center justify-center mx-auto lg:mx-0">
                {images.length > 0 && images[imgIndex] ? (
                  <img
                    src={images[imgIndex]}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <img
                    src={noImages}
                    alt="no Image"
                    className="rounded-[10px] "
                  />
                )}

                {/* then remove */}
                <div
                  className="absolute
                flex justify-between
                min-w-[243px]
                "
                >
                  <button onClick={onPrev} className="cursor-pointer">
                    <ArrowLeft />
                  </button>
                  <Dots
                    count={images.length}
                    active={imgIndex}
                    onPick={setImgIndex}
                  />
                  <button onClick={onNext} className="cursor-pointer">
                    <ArrowRight />
                  </button>
                </div>
              </div>

              {hasMultipleImages && (
                <div
                  className="absolute
                flex justify-between
                min-w-[243px]
                "
                >
                  <button onClick={onPrev} className="cursor-pointer">
                    <ArrowLeft />
                  </button>
                  <Dots
                    count={images.length}
                    active={imgIndex}
                    onPick={setImgIndex}
                  />
                  <button onClick={onNext} className="cursor-pointer">
                    <ArrowRight />
                  </button>
                </div>
              )}

              {/* {hasMultipleImages && (
                <div className="mt-3 lg:mt-4 flex items-center justify-center lg:justify-start gap-2">
                  <button
                    onClick={onPrev}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"
                    aria-label="previous image"
                  >
                    <ArrowLeft />
                  </button>
                  <Dots
                    count={images.length}
                    active={imgIndex}
                    onPick={setImgIndex}
                  />
                  <button
                    onClick={onNext}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black"
                    aria-label="next image"
                  >
                    <ArrowRight />
                  </button>
                </div>
              )} */}
            </div>

            <div className="flex-1 flex flex-col mt-4 lg:mt-0">
              <div className="flex items-center justify-evenly  mb-4 lg:mb-4">
                <p className="text-xl sm:text-2xl lg:text-3xl font-h5m ">
                  {offer.price} UAH
                </p>
                {(offer.type === 'SELL_EXCHANGE' ||
                  offer.type === 'EXCHANGE') && (
                  <div
                    className="flex items-center gap-[6px]
                  text-sm lg:text-base text-gray-600 bg-gray-50 
                  px-2 py-1 lg:px-3 lg:py-2 rounded
                  font-captionm"
                  >
                    <SynchronizeArrows />
                    Exchange
                  </div>
                )}
              </div>

              <button
                onClick={handleContact}
                className="w-full lg:w-auto lg:px-8 py-3 lg:py-4 rounded-[12px] bg-[#033F63] text-white font-semibold hover:bg-black transition-colors text-sm sm:text-base lg:text-lg"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center ">
              <h3 className="mr-4 font-h4m font-medium text-black ">
                Condition
              </h3>
              <p
                className="font-h6m text-gray-700
              border-[1px] border-solid border-[#F0FBFB] rounded-[12px] px-2 py-1
              "
              >
                Used
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-base lg:text-lg font-semibold text-gray-800 w-24 lg:w-32 mt-1">
                Category
              </span>
              <div className="flex flex-wrap gap-4">
                {(book.genres?.length
                  ? book.genres
                  : ['Fantasy', 'Fantasy']
                ).map((g: string, i: number) => (
                  <span
                    key={`${g}-${i}`}
                    className="px-3 py-1 lg:px-4 lg:py-2 bg-[#F0FBFB] rounded-full text-sm lg:text-base font-h6m text-gray-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6
        bg-[#F7F8F2]  "
        >
          <button
            onClick={() => setIsAboutOpen((v) => !v)}
            className="w-full flex items-center justify-between"
          >
            <h2
              className="text-base lg:text-lg
            mb-4
            font-h3m font-medium text-gray-800"
            >
              About the book
            </h2>
            {isAboutOpen ? <ArrowUp /> : <ArrowDown />}
          </button>

          {isAboutOpen && (
            <div className=" text-sm lg:text-base text-[#153037]  ">
              <p>
                {book.description || 'No description available for this book.'}
              </p>
              <p className="text-xs lg:text-sm font-h6m text-[#153037] mt-4 ">
                Date added: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>
          )}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <h2
            className="font-h4m font-medium mb-1
          "
          >
            The Owner
          </h2>

          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-sm lg:text-base font-medium text-gray-500">
                  {seller.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              )}
            </div>
            <p className="font-h6m ">{seller.name}</p>
          </div>
        </div>

        <div
          className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6
        bg-[#F0FBFB]
        "
        >
          <h2 className="font-h3m mb-[28px] "> Similar books</h2>
          <div className="flex gap-3 lg:gap-4 -mx-4 px-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 xl:grid-cols-6 lg:overflow-visible lg:mx-0 lg:px-0">
            {similarBooks.length > 0
              ? similarBooks.map((similarOffer) => (
                  <div
                    key={similarOffer.id}
                    className="w-24 lg:w-full flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/offers/${similarOffer.id}`)}
                  >
                    <div className="w-full h-32 lg:h-40 xl:h-48 rounded-lg flex items-center justify-center mb-1 lg:mb-2">
                      {similarOffer.book.images?.length > 0 &&
                      similarOffer.book.images[0] ? (
                        <img
                          src={similarOffer.book.images[0]}
                          alt={similarOffer.book.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src={noImages}
                          alt="no Image"
                          className="rounded-[10px] "
                        />
                      )}
                    </div>
                  </div>
                ))
              : [1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-24 lg:w-full flex-shrink-0">
                    <div className="w-full h-32 lg:h-40 xl:h-48 rounded-lg bg-gray-100" />
                  </div>
                ))}
          </div>
        </div>

        <div className="h-24" />
      </div>

      <BottomNav />
    </div>
  );
};

export { OfferDetailsPage };
