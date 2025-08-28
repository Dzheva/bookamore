import { FiSearch, FiFilter, FiBarChart2 } from "react-icons/fi";
import { SortDropdown } from "@shared/ui/dropdowns/SortDropdown";
import { FilterDropdown } from "@shared/ui/dropdowns/FilterDropdown";
import { useState } from "react";
import { useNavigate } from "react-router";
import type { SortOption } from "@shared/ui/dropdowns/SortDropdown";
import type { FilterState } from "@shared/ui/dropdowns/FilterDropdown";


export function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    condition: 'any',
    categories: []
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as React.FormEvent);
    }
  };

  const handleSortClick = () => {
    setIsSortModalOpen(prev => !prev);
    // Close filter dropdown if it's open
    if (isFilterDropdownOpen) {
      setIsFilterDropdownOpen(false);
    }
  };

  const handleFilterClick = () => {
    setIsFilterDropdownOpen(prev => !prev);
    // Close sort dropdown if it's open
    if (isSortModalOpen) {
      setIsSortModalOpen(false);
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'relevance': return 'Sort';
      case 'lowest-price': return 'Price ↑';
      case 'highest-price': return 'Price ↓';
      default: return 'Sort';
    }
  };

  const getFilterLabel = () => {
    const activeFiltersCount = 
      (filters.condition !== 'any' ? 1 : 0) + 
      filters.categories.length;
    
    return activeFiltersCount > 0 ? `Filter (${activeFiltersCount})` : 'Filter';
  };

  return (
    <header className="bg-white w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top row - Logo */}
        <div className="flex items-center justify-between py-3 ml-2">
          <h1 className="text-xl font-bold text-black">BookAmore</h1>
        </div>

        {/* Search Bar */}
        <div className="pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search: name, author, seller"
              className="w-full bg-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm text-black outline-none border-none placeholder-gray-500"
            />
            <button 
              type="submit"
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FiSearch size={20} />
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="pb-4 flex items-center justify-between flex-wrap">
          <label className="flex items-center gap-2 text-sm cursor-pointer ml-3">
            <input
              type="checkbox"
              className="w-4 h-4 accent-black cursor-pointer"
            />
            <span className="text-black">Exchange only</span>
          </label>

          <div className="flex items-center gap-3 mr-3">
            {/* Filter button with dropdown */}
            <div className="relative">
              <button 
                onClick={handleFilterClick}
                className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-black bg-white hover:bg-gray-50 transition-colors"
              >
                <FiFilter size={16} />
                <span>{getFilterLabel()}</span>
              </button>

              {/* Filter Dropdown */}
              <FilterDropdown
                isOpen={isFilterDropdownOpen}
                onClose={() => setIsFilterDropdownOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            {/* Sort button with dropdown */}
            <div className="relative">
              <button 
                onClick={handleSortClick}
                className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-black bg-white hover:bg-gray-50 transition-colors"
              >
                <FiBarChart2 size={16} className="transform rotate-90" />
                <span>{getSortLabel(selectedSort)}</span>
              </button>

              {/* Sort Dropdown */}
              <SortDropdown
                isOpen={isSortModalOpen}
                onClose={() => setIsSortModalOpen(false)}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
