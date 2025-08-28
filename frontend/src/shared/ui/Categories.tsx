import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  
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

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      // Navigate to home or all offers page
      navigate('/');
    } else {
      // Navigate to genre results page
      navigate(`/genres/${categoryId}`);
    }
  };

  return (
    <div className="bg-white w-full border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="py-3 sm:py-4">
          <h3 className="text-lg font-bold text-black mb-3">Categories</h3>
          
          {/* Scrollable categories */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                label={category.label}
                isActive={category.active}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
