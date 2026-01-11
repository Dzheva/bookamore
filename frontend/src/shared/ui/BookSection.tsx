import { useNavigate } from "react-router";
import type { OfferWithBook } from "@/types/entities/OfferWithBook";
import noImages from "@/assest/images/noImage.jpg";

interface BookCardProps {
  condition?: "new" | "used";
  offer?: OfferWithBook;
}

function BookCard({ condition, offer }: BookCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (offer) {
      navigate(`/offers/${offer.id}`);
    }
  };

  return (
    <div
      className=" rounded-lg aspect-[3/4] min-w-[100px] sm:min-w-[120px] lg:min-w-[140px]  relative cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
    >
      {/* Book image */}
      {offer?.previewImage ? (
        <img
          src={offer.previewImage}
          alt={offer.book.title}
          className="w-full h-full rounded-lg object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-lg ">
          <img src={noImages} alt="no Image" />
        </div>
      )}

      {/* Book condition badge */}
      {condition && (
        <div className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm font-bold text-black border shadow-sm">
          {condition === "new" ? "NEW" : "USED"}
        </div>
      )}
    </div>
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
          { condition: "new" }, // First book is new
          { condition: "new" }, // Second book is new
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
    <div className="bg-white w-full border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="py-4 sm:py-5 lg:py-6">
          {/* Section header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              {title}
            </h3>
            {showViewAll && (
              <button
                onClick={handleViewAllClick}
                className="text-sm sm:text-base text-gray-500 hover:text-gray-700 transition-colors font-medium"
              >
                View all
              </button>
            )}
          </div>

          {/* Horizontal scrollable books list */}
          <div className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-2">
            {mockBooks.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>

          {/* Scroll indicator for mobile */}
          <div className="flex justify-center mt-3 lg:hidden">
            <div className="w-8 h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
