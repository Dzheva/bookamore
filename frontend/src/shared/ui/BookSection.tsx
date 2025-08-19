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
}

export function BookSection({ title, books = [], showViewAll = true }: BookSectionProps) {
  // Mock data for demonstration
  const mockBooks: BookCardProps[] = books.length > 0 ? books : [
    { condition: 'new' },    // First book is new
    { condition: 'new' },    // Second book is new  
    {},                      // Third book without badge
    {},                      // Fourth book without badge
  ];

  return (
    <div className="bg-white w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-black">{title}</h3>
            {showViewAll && (
              <button className="text-sm text-gray-500 hover:text-gray-700">
                View all
              </button>
            )}
          </div>
          
          {/* Horizontal scrollable books list */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {mockBooks.map((book, index) => (
              <BookCard key={index} {...book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
