import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { IoSearchOutline, IoClose } from 'react-icons/io5';
import { useGetAllOffersWithBooksQuery } from '../../app/store/api/OffersApi';
import { BookCard } from '../../shared/ui/BookCard';
import { BottomNav } from '../../shared/ui/BottomNav';
import {
  applyFiltersAndSort,
  createMockResponse,
} from '../../shared/mocks/mockData';
import type { QueryParams } from '../../types/entities/QueryParams';
import BackButton from '@/shared/ui/BackButton';

// Mock mode flag - set to true to use mocks instead of API
const USE_MOCKS = true;

// Page Header Component with search bar
interface PageHeaderProps {
  searchQuery: string;
  onBack: () => void;
}

function PageHeader({ searchQuery }: PageHeaderProps) {
  const navigate = useNavigate();
  const isSpecialFilter = searchQuery === 'recommended';
  const displayQuery = isSpecialFilter ? '' : searchQuery;
  const [localSearchQuery, setLocalSearchQuery] = useState(displayQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top header */}
      <div className="flex items-center px-4 sm:px-6 lg:px-8 py-3">
        <BackButton />

        <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex-1 text-center">
          BookAmore
        </h1>
        <div className="w-6 sm:w-8"></div>
      </div>

      {/* Search bar */}
      <div className="px-4 sm:px-6 lg:px-8 pb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-2xl mx-auto lg:max-w-4xl"
        >
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
          />
          <IoSearchOutline className="absolute left-3 top-2.5 sm:top-3 lg:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </form>
      </div>
    </div>
  );
}

// Filter Chip Component with close icon
interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function FilterChip({ label, isActive = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-colors
        ${
          isActive
            ? 'bg-gray-800 text-white shadow-sm hover:bg-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      <span>{label}</span>
      {isActive && <IoClose className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
    </button>
  );
}

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all filter parameters from URL
  const searchQuery = searchParams.get('q') || '';
  const currentCondition = searchParams.get('condition') as
    | 'new'
    | 'used'
    | null;
  const exchange = searchParams.get('exchange');
  const sort = searchParams.get('sort');
  const categories = searchParams.get('categories');

  // Build filter object for our new function
  const filters = {
    query: searchQuery || undefined,
    condition: currentCondition || undefined,
    exchange:
      exchange === 'true' ? true : exchange === 'false' ? false : undefined,
    sort: sort || undefined,
    categories: categories ? categories.split(',') : undefined,
  };

  // Build API query parameters
  const queryParams: QueryParams = {
    search: searchQuery || undefined,
    condition: currentCondition || undefined,
    page: 0,
    size: 20,
  };

  // Mock data logic using new filter function
  const getMockData = () => {
    const filteredOffers = applyFiltersAndSort(filters);
    return createMockResponse(filteredOffers);
  };

  // Use mocks or real API
  const mockResult = USE_MOCKS
    ? {
        data: getMockData(),
        isLoading: false,
        error: undefined,
      }
    : null;

  const apiResult = useGetAllOffersWithBooksQuery(
    queryParams,
    { skip: USE_MOCKS } // Skip API call when using mocks
  );

  // Choose data source
  const {
    data: offersResponse,
    isLoading,
    error,
  } = USE_MOCKS ? mockResult! : apiResult;

  const handleBack = () => {
    navigate(-1);
  };

  const handleConditionFilter = (condition: 'new' | 'used' | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (condition) {
      newParams.set('condition', condition);
    } else {
      newParams.delete('condition');
    }

    setSearchParams(newParams);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader searchQuery={searchQuery} onBack={handleBack} />
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading search results...</p>
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
        <PageHeader searchQuery={searchQuery} onBack={handleBack} />
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load search results</p>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const offers = offersResponse?.content || [];

  // Helper to get display title for special filters
  const getDisplayTitle = (query: string) => {
    switch (query) {
      case 'recommended':
        return 'Recommended Books';
      default:
        return `Results for "${query}":`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <PageHeader searchQuery={searchQuery} onBack={handleBack} />

      <div className="w-full max-w-md mx-auto lg:max-w-4xl xl:max-w-6xl">
        {/* Results info and active filters */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 border-gray-200">
          {searchQuery && (
            <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-4">
              {getDisplayTitle(searchQuery)}
            </h2>
          )}

          {/* Show only active filters as chips */}
          {currentCondition && (
            <div className="flex gap-2">
              <FilterChip
                label={
                  currentCondition.charAt(0).toUpperCase() +
                  currentCondition.slice(1)
                }
                isActive={true}
                onClick={() => handleConditionFilter(null)}
              />
            </div>
          )}
        </div>

        {/* Books list - responsive grid layout */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 pb-20">
          {offers.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 lg:space-y-0">
              {offers.map((offer) => (
                <BookCard
                  key={offer.id}
                  offer={offer}
                  onContact={() => {
                    console.log('Contact for offer:', offer.id);
                    // TODO: Implement contact functionality
                  }}
                  onFavorite={() => {
                    console.log('Toggle favorite for offer:', offer.id);
                    // TODO: Implement favorite functionality
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <IoSearchOutline className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `No results found for "${searchQuery}". Try a different search term.`
                  : 'Try searching for books, authors, or genres.'}
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
}
