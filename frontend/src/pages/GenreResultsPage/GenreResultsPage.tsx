import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { IoChevronBack, IoLibraryOutline, IoClose } from 'react-icons/io5';
import { useGetAllOffersWithBooksQuery } from '@app/store/api/OffersApi';
import { BookCard } from '@shared/ui/BookCard';
import { BottomNav } from '@shared/ui/BottomNav';
import { 
  applyFiltersAndSort,
  createMockResponse 
} from '../../shared/mocks/mockData';
import type { OfferWithBook } from '@/types/entities/OfferWithBook';

// Mock mode flag - set to true to use mocks instead of API
const USE_MOCKS = true;

// Local header component
function PageHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-gray-200">
      <button 
        onClick={onBack} 
        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
      >
        <IoChevronBack className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
      </button>
      <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex-1 text-center">
          BookAmore
        </h1>
      <div className="w-6 sm:w-8"></div>
    </header>
  );
}

// Filter chip component
function FilterChip({ 
  label, 
  onRemove 
}: { 
  label: string; 
  onRemove: () => void; 
}) {
  return (
    <button 
      onClick={onRemove}
      className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-800 text-white rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-colors hover:bg-gray-700"
    >
      <span>{label.charAt(0).toUpperCase() + label.slice(1)}</span>
      <IoClose className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );
}

const GenreResultsPage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get filter parameters from URL
  const filters = {
    genre: genre || undefined,
    condition: searchParams.get('condition') as 'new' | 'used' | null || undefined,
    exchange: searchParams.get('exchange') === 'true' ? true : searchParams.get('exchange') === 'false' ? false : undefined,
    sort: searchParams.get('sort') || undefined,
    categories: searchParams.get('categories')?.split(',') || undefined,
  };

  // Mock data logic using new filter function
  const getMockData = () => {
    if (!genre) return createMockResponse([]);
    const filteredOffers = applyFiltersAndSort(filters);
    return createMockResponse(filteredOffers);
  };

  // Use mocks or real API
  const mockResult = USE_MOCKS ? {
    data: getMockData(),
    isLoading: false,
    error: undefined
  } : null;

  const apiResult = useGetAllOffersWithBooksQuery(
    {
      genre: genre,
      condition: filters.condition,
    },
    { skip: USE_MOCKS } // Skip API call when using mocks
  );

  // Choose data source
  const { data, isLoading, error } = USE_MOCKS ? mockResult! : apiResult;

  // Event handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleRemoveConditionFilter = () => {
    // Remove condition from URL parameters
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('condition');
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const handleContact = (offer: OfferWithBook) => {
    // TODO: Implement contact logic
    console.log('Contact for offer:', offer.id);
  };

  const handleFavorite = (offer: OfferWithBook) => {
    // TODO: Implement favorite logic
    console.log('Add to favorites:', offer.id);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader onBack={handleBack} />
        <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader onBack={handleBack} />
        <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-2 text-sm sm:text-base">Error loading results</p>
              <p className="text-gray-500 text-xs sm:text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const offers = data?.content || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader onBack={handleBack} />
      
      <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Filters */}
        {filters.condition && (
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <FilterChip 
              label={filters.condition} 
              onRemove={handleRemoveConditionFilter} 
            />
          </div>
        )}

        {/* Results */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 pb-20">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-4">
            Results for "{genre}":
          </h2>
          
          {/* Results grid */}
          {offers.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 lg:space-y-0">
              {offers.map((offer) => (
                <BookCard
                  key={offer.id}
                  offer={offer}
                  onContact={() => handleContact(offer)}
                  onFavorite={() => handleFavorite(offer)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12">
              <div className="mb-4">
                <IoLibraryOutline className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                No results found for "{genre}". Try browsing other categories.
              </p>
              <button
                onClick={handleBack}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export { GenreResultsPage };

