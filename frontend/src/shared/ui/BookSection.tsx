import { Link } from 'react-router-dom';
import type { OfferWithBook } from '@/types/entities/OfferWithBook';
import noImages from '@/assest/images/noImage.jpg';
import { Badge } from './icons/Badge';
import { Spinner } from './Spinner';

interface BookCardProps {
  condition?: 'new' | 'used';
  offer: OfferWithBook;
}

function getAuthorName(authors: unknown): string {
  if (Array.isArray(authors) && authors.length > 0) {
    const author = authors[0];
    return typeof author === 'string' ? author : 'Unknown';
  }
  return 'Unknown';
}

function BookCard({ condition, offer }: BookCardProps) {
  // Validate book data structure exists
  if (!offer?.book) {
    return null;
  }

  // Extract and validate data with defensive checks
  const bookImage = offer.book.images?.[0] || noImages;
  const bookTitle = offer.book?.title || 'Unknown Title';
  const authorName = getAuthorName(offer.book?.authors);
  const bookPrice = offer.price?.toFixed(2) || '0.00';

  return (
    <Link
      to={`/offers/${offer.id}`}
      className="relative flex flex-col w-[108px] sm:w-[140px] lg:w-[160px] flex-shrink-0 focus-visible:border-grass-500 focus-visible:border-2 outline-0 rounded-lg overflow-hidden"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={bookImage}
          alt={bookTitle}
          className="w-full h-full object-cover"
        />
        {condition === 'new' && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 lg:bottom-4 lg:right-4">
            <Badge className="w-6 sm:w-7 lg:w-8 h-auto" />
          </div>
        )}
      </div>
      <div className="bg-white pt-2 sm:pt-2.5 flex-1 flex flex-col">
        <p className="text-h5m font-medium text-text-black truncate">
          {bookTitle}
        </p>
        <p className="text-captionm font-normal text-gray-600 truncate mt-1">
          {`by ${authorName}`}
        </p>
        <p className="text-sm sm:text-base font-semibold text-text-black mt-1">
          {`${bookPrice} UAH`}
        </p>
      </div>
    </Link>
  );
}

interface BookSectionProps {
  title: string;
  offers?: OfferWithBook[];
  isLoading: boolean;
  error?: unknown;
  showViewAll?: boolean;
  viewAllDestination?: string; // Added for flexible navigation
}

export function BookSection({
  title,
  offers = [],
  isLoading,
  error,
  showViewAll = true,
  viewAllDestination,
}: BookSectionProps) {
  const hasError = Boolean(error);
  const viewAllLink =
    viewAllDestination ??
    `/search?q=${encodeURIComponent(title.toLowerCase())}`;

  return (
    <section className="bg-white w-full border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="px-4 py-2.5 mt-2.5 border border-aquamarine-500 bg-aquamarine-50 rounded-[12px]">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-text-black">
              {title}
            </h3>
            {showViewAll && (
              <Link
                to={viewAllLink}
                className="text-sm sm:text-base font-extralight text-gray-800 hover:bg-grass-100 hover:text-text-black focus-visible:bg-grass-100 outline-grass-500 focus-visible:text-text-black transition-colors px-1.5 py-0.5 rounded-[8px]"
              >
                View all
              </Link>
            )}
          </div>

          {isLoading && (
            <div className="py-6 text-center">
              <Spinner size="md" />
            </div>
          )}

          {hasError && (
            <div className="py-6 text-center text-red-600">
              Failed to load books.
            </div>
          )}

          {!isLoading && !hasError && offers.length === 0 && (
            <div className="py-6 text-center text-gray-600">
              No books available.
            </div>
          )}

          {!isLoading && !error && offers.length > 0 && (
            <div className="flex gap-5 overflow-x-auto scrollbar-custom pb-3">
              {offers.map((offer) => {
                // Validate book condition exists before accessing
                const condition =
                  offer.book?.condition?.toLowerCase() === 'new'
                    ? 'new'
                    : 'used';
                return (
                  <BookCard
                    key={offer.id}
                    offer={offer}
                    condition={condition as 'new' | 'used'}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
