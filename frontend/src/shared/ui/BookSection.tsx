import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import type { OfferWithBook } from '@/types/entities/OfferWithBook';
import noImages from '@/assest/images/noImage.jpg';
import { Badge } from './icons/Badge';

interface BookCardProps {
  condition?: 'new' | 'used';
  offer?: OfferWithBook;
}

function BookCard({ condition, offer }: BookCardProps) {
  if (!offer) return null;

  return (
    <Link
      to={`/offers/${offer.id}`}
      className="relative block aspect-[3/4] w-[108px] sm:w-[140px] lg:w-[160px] flex-shrink-0 focus:border-grass-500 focus:border-2 outline-0 rounded-lg overflow-hidden"
    >
      <img
        src={offer.previewImage || noImages}
        alt={offer.book?.title || 'Book cover'}
        className="w-full h-full rounded-lg object-cover"
      />

      {condition === 'new' && (
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 lg:bottom-4 lg:right-4">
          <Badge className="w-6 sm:w-7 lg:w-8 h-auto" />
        </div>
      )}
    </Link>
  );
}

interface BookSectionProps {
  title: string;
  books?: BookCardProps[];
  showViewAll?: boolean;
  viewAllDestination?: string; // Added for flexible navigation
}

export function BookSection({
  title,
  books = [],
  showViewAll = true,
  viewAllDestination,
}: BookSectionProps) {
  const navigate = useNavigate();

  // Mock data for demonstration when no books provided
  const mockBooks: BookCardProps[] =
    books.length > 0
      ? books
      : [
          { condition: 'new' }, // First book is new
          { condition: 'new' }, // Second book is new
          {}, // Third book without badge
          {}, // Fourth book without badge
        ];

  const handleViewAllClick = () => {
    if (viewAllDestination) {
      navigate(viewAllDestination);
    } else {
      // Default behavior - navigate to search results with the section title as query
      navigate(`/search?q=${encodeURIComponent(title.toLowerCase())}`);
    }
  };

  return (
    <section className="bg-white w-full border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="px-4 py-2.5 mt-2.5 border border-aquamarine-500 bg-aquamarine-50 rounded-[12px]">
          {/* Section header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-normal text-text-black">
              {title}
            </h3>
            {showViewAll && (
              <button
                onClick={handleViewAllClick}
                className="text-sm sm:text-base font-extralight text-gray-800 hover:bg-grass-100 hover:text-text-black focus-visible:bg-grass-100 outline-grass-500 focus-visible:text-text-black transition-colors px-1.5 py-0.5 rounded-[8px] cursor-pointer"
              >
                View all
              </button>
            )}
          </div>

          {/* Horizontal scrollable books list */}
          <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-custom pb-3">
            {mockBooks.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
