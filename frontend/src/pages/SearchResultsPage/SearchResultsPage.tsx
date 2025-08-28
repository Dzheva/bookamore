import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { IoChevronBack } from 'react-icons/io5';
import { useGetAllOffersWithBooksQuery } from '../../app/store/api/OffersApi';
import { BookCard } from '../../shared/ui/BookCard';
import { BottomNav } from '../../shared/ui/BottomNav';
import { 
  getOffersBySearch,
  getOffersByCondition,
  createMockResponse 
} from '../../shared/mocks/mockData';
import type { QueryParams } from '../../types/entities/QueryParams';

// Mock mode flag - set to true to use mocks instead of API
const USE_MOCKS = true;

// Page Header Component with search bar
interface PageHeaderProps {
  searchQuery: string;
  onBack: () => void;
}

function PageHeader({ searchQuery, onBack }: PageHeaderProps) {
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top header */}
      <div className="flex items-center gap-4 px-4 py-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <IoChevronBack className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1">
          BookAmore
        </h1>
      </div>
      
      {/* Search bar */}
      <div className="px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </form>
      </div>
    </div>
  );
}

// Filter Chip Component
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
        px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
        ${isActive 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get search query from URL params
  const searchQuery = searchParams.get('q') || '';
  const currentCondition = searchParams.get('condition') as 'new' | 'used' | null;
  
  // Build API query parameters
  const queryParams: QueryParams = {
    search: searchQuery || undefined,
    condition: currentCondition || undefined,
    page: 0,
    size: 20,
  };
  
  // Mock data logic
  const getMockData = () => {
    let filteredOffers = searchQuery ? getOffersBySearch(searchQuery) : [];
    
    // Apply condition filter if set
    if (currentCondition && filteredOffers.length > 0) {
      filteredOffers = getOffersByCondition(filteredOffers, currentCondition);
    }
    
    return createMockResponse(filteredOffers);
  };

  // Use mocks or real API
  const mockResult = USE_MOCKS ? {
    data: getMockData(),
    isLoading: false,
    error: undefined
  } : null;

  const apiResult = useGetAllOffersWithBooksQuery(
    queryParams,
    { skip: USE_MOCKS } // Skip API call when using mocks
  );

  // Choose data source
  const { data: offersResponse, isLoading, error } = USE_MOCKS ? mockResult! : apiResult;

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
        <PageHeader 
          searchQuery={searchQuery} 
          onBack={handleBack} 
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader 
          searchQuery={searchQuery} 
          onBack={handleBack} 
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Failed to load search results</p>
            <p className="text-gray-500 text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  const offers = offersResponse?.content || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <PageHeader 
        searchQuery={searchQuery} 
        onBack={handleBack} 
      />

      {/* Results info and active filters */}
      <div className="bg-white px-4 sm:px-6 py-3 border-b border-gray-200">
        <p className="text-sm text-gray-600 mb-2">
          Results for "{searchQuery}":
        </p>
        
        {/* Show only active filters as chips */}
        {currentCondition && (
          <div className="flex gap-2">
            <FilterChip
              label={currentCondition.charAt(0).toUpperCase() + currentCondition.slice(1)}
              isActive={true}
              onClick={() => handleConditionFilter(null)}
            />
          </div>
        )}
      </div>

      {/* Books list - vertical layout like in mockup */}
      <div className="px-4 sm:px-6 py-4 pb-20">
        {offers.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
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
              <svg 
                className="w-16 h-16 text-gray-300 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No results found for "${searchQuery}". Try a different search term.`
                : 'Try searching for books, authors, or genres.'
              }
            </p>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

