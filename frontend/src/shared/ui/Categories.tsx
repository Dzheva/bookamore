interface CategoryButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function CategoryButton({ label, isActive = false, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
        ${isActive 
          ? 'bg-gray-800 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}

export function Categories() {
  const categories = [
    { id: 'all', label: 'All', active: true },
    { id: 'sci-fi', label: 'Sci-fi', active: false },
    { id: 'romantic', label: 'Romantic', active: false },
    { id: 'historical', label: 'Historical', active: false },
    { id: 'detective', label: 'Detective', active: false },
    { id: 'fantasy', label: 'Fantasy', active: false },
    { id: 'biography', label: 'Biography', active: false },
    { id: 'horror', label: 'Horror', active: false },
    { id: 'comedy', label: 'Comedy', active: false },
    { id: 'drama', label: 'Drama', active: false },
    { id: 'adventure', label: 'Adventure', active: false },
    { id: 'children', label: 'Children', active: false },
    { id: 'psychology', label: 'Psychology', active: false },
  ];

  return (
    <div className="bg-white w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-0">
          <h3 className="text-lg font-bold text-black mb-3">Categories</h3>
          
          {/* Scrollable categories */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.label}
                isActive={category.active}
                onClick={() => {
                  // TODO: Додати логіку вибору категорії
                  console.log(`Selected category: ${category.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
