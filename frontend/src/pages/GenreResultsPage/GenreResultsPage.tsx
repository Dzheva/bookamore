import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { IoChevronBack } from 'react-icons/io5';
import { useGetAllOffersWithBooksQuery } from '@app/store/api/OffersApi';
import { BookCard } from '@shared/ui/BookCard';
import { BottomNav } from '@shared/ui/BottomNav';
import { 
  getOffersByGenre,
  createMockResponse 
} from '../../shared/mocks/mockData';
import type { OfferWithBook } from '@/types/entities/OfferWithBook';

// Mock mode flag - set to true to use mocks instead of API
const USE_MOCKS = true;

// Local header component
function PageHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center p-4 bg-white">
      <button 
        onClick={onBack} 
        className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
      >
        <IoChevronBack className="w-6 h-6 text-gray-600" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900 flex-1">
          BookAmore
        </h1>
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
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
      <span>{label}</span>
      <button 
        onClick={onRemove}
        className="text-gray-500 hover:text-gray-700"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </div>
  );
}

const GenreResultsPage: React.FC = () => {
  const { genre } = useParams<{ genre: string }>();
  const navigate = useNavigate();
  const [condition, setCondition] = useState<string | null>(null);

  // Mock data logic
  const getMockData = () => {
    if (!genre) return createMockResponse([]);
    let filteredOffers = getOffersByGenre(genre);
    
    // Apply condition filter if set
    if (condition) {
      filteredOffers = filteredOffers.filter(offer => 
        offer.book.condition.toLowerCase() === condition.toLowerCase()
      );
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
    {
      genre: genre,
      condition: condition,
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
    setCondition(null);
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
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Error loading results</div>
      </div>
    );
  }

  const offers = data?.content || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <PageHeader onBack={handleBack} />
      
      {/* Filters */}
      <div className="px-4 py-3 bg-white">
        {condition && (
          <FilterChip 
            label={condition} 
            onRemove={handleRemoveConditionFilter} 
          />
        )}
      </div>

      {/* Results */}
      <div className="px-4 sm:px-6 py-4 pb-20">
        <h2 className="text-lg font-bold mb-4">
          Results for "{genre}":
        </h2>
        
        {/* Results grid */}
        {offers.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
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
          <div className="text-center py-8">
            <p className="text-gray-500">No results found for "{genre}"</p>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export { GenreResultsPage };

