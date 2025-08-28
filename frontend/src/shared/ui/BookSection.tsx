import { useNavigate } from 'react-router';

interface BookCardProps {
  condition?: 'new' | 'used';
}

function BookCard({ condition }: BookCardProps) {
  return (
    <div className="bg-gray-200 rounded-lg aspect-[3/4] min-w-[120px] flex-shrink-0 relative">
      {/* Book image placeholder */}
      <div className="w-full h-full rounded-lg bg-gray-200"></div>
      
      {/* Book condition badge */}
      {condition && (
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-black border">
          {condition === 'new' ? 'NEW' : 'USED'}
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
  viewAllDestination 
}: BookSectionProps) {
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockBooks: BookCardProps[] = books.length > 0 ? books : [
    { condition: 'new' },    // First book is new
    { condition: 'new' },    // Second book is new  
    {},                      // Third book without badge
    {},                      // Fourth book without badge
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-5">
          {/* Section header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg font-bold text-black">{title}</h3>
            {showViewAll && (
              <button 
                onClick={handleViewAllClick}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                View all
              </button>
            )}
          </div>
          
          {/* Horizontal scrollable books list */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2">
            {mockBooks.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
