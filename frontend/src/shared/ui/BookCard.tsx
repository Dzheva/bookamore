import { useNavigate } from 'react-router';
import type { OfferWithBook } from "@/types/entities/OfferWithBook";

type BookCardProps = {
  offer: OfferWithBook;
  onContact: () => void;
  onFavorite: () => void;
}

export function BookCard({ offer, onContact, onFavorite }: BookCardProps) {
  const { book, price, type } = offer;
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/offers/${offer.id}`);
  };
  
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
    e.stopPropagation(); // Prevent card click when clicking buttons
    callback();
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-200 shadow-sm flex gap-4 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Book image */}
      <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0">
        {book.images?.[0] && (
          <img 
            src={book.images[0]} 
            alt={book.title} 
            className="w-full h-full object-cover rounded" 
          />
        )}
      </div>
      
      {/* Book information and actions */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Book details */}
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-1 truncate">by {book.authors.join(", ")}</p>
          <p className="text-sm text-gray-600 mb-2">Condition: {book.condition}</p>
          
          {/* Price and Exchange */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 mb-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Price:</span>
              <span className="font-bold text-lg">{price} UAH</span>
            </div>
            {type === 'EXCHANGE' && (
              <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Exchange
              </button>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-auto">
          <button 
            onClick={(e) => handleButtonClick(e, onContact)}
            className="flex-1 sm:flex-none sm:w-24 lg:w-28 bg-gray-800 text-white py-2.5 px-4 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-700 transition-colors"
          >
            Contact
          </button>
          <button 
            onClick={(e) => handleButtonClick(e, onFavorite)}
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex-shrink-0 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}