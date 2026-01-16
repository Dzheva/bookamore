import { FiSearch, FiFilter, FiBarChart2 } from 'react-icons/fi';
import { SortDropdown } from '@shared/ui/dropdowns/SortDropdown';
import { FilterDropdown } from '@shared/ui/dropdowns/FilterDropdown';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import type { SortOption } from '@shared/ui/dropdowns/SortDropdown';
import type { FilterState } from '@shared/ui/dropdowns/FilterDropdown';

export function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    condition: 'any',
    categories: [],
  });
  const [exchangeOnly, setExchangeOnly] = useState(false);

  // Initialize state from URL params
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const sort = (searchParams.get('sort') as SortOption) || 'relevance';
    const condition =
      (searchParams.get('condition') as FilterState['condition']) || 'any';
    const categories =
      searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const exchange = searchParams.get('exchange') === 'true';

    setSearchQuery(query);
    setSelectedSort(sort);
    setFilters({ condition, categories });
    setExchangeOnly(exchange);
  }, [searchParams]);

  const updateURLParams = (
    updates: Partial<{
      q: string;
      sort: SortOption;
      condition: string;
      categories: string[];
      exchange: boolean;
    }>
  ) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (key === 'sort' && value === 'relevance') ||
        (key === 'condition' && value === 'any') ||
        (key === 'exchange' && value === false)
      ) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(','));
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page if not already there
      if (location.pathname !== '/search') {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        // Just update URL params if already on search page
        updateURLParams({ q: searchQuery.trim() });
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e as React.FormEvent);
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    updateURLParams({ sort });
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURLParams({
      condition: newFilters.condition,
      categories: newFilters.categories,
    });
  };

  const handleExchangeOnlyChange = (checked: boolean) => {
    setExchangeOnly(checked);
    updateURLParams({ exchange: checked });
  };

  const handleSortClick = () => {
    setIsSortModalOpen((prev) => !prev);
    // Close filter dropdown if it's open
    if (isFilterDropdownOpen) {
      setIsFilterDropdownOpen(false);
    }
  };

  const handleFilterClick = () => {
    setIsFilterDropdownOpen((prev) => !prev);
    // Close sort dropdown if it's open
    if (isSortModalOpen) {
      setIsSortModalOpen(false);
    }
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'relevance':
        return 'Sort';
      case 'lowest-price':
        return 'Price ↑';
      case 'highest-price':
        return 'Price ↓';
      default:
        return 'Sort';
    }
  };

  const getFilterLabel = () => {
    const activeFiltersCount =
      (filters.condition !== 'any' ? 1 : 0) + filters.categories.length;

    return activeFiltersCount > 0 ? `Filter (${activeFiltersCount})` : 'Filter';
  };

  return (
    <header className="bg-white w-full">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Top row - Logo */}
        <div className="flex items-center justify-between py-3 ml-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
            BookAmore
          </h1>
        </div>

        {/* Search Bar */}
        <div className="pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative max-w-2xl lg:max-w-4xl"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="Search: name, author, seller"
              className="w-full bg-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm sm:text-base text-black outline-none border-none placeholder-gray-500 lg:py-3"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FiSearch size={20} className="sm:w-6 sm:h-6" />
            </button>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="pb-4 flex items-center justify-between flex-wrap gap-2">
          <label className="flex items-center gap-2 text-sm sm:text-base cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={exchangeOnly}
              onChange={(e) => handleExchangeOnlyChange(e.target.checked)}
              className="w-4 h-4 sm:w-5 sm:h-5 accent-black cursor-pointer"
            />
            <span className="text-black">Exchange only</span>
          </label>

          <div className="flex items-center gap-2 sm:gap-3 mr-3">
            {/* Filter button with dropdown */}
            <div className="relative">
              <button
                onClick={handleFilterClick}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-black bg-white hover:bg-gray-50 transition-colors"
              >
                <FiFilter size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">{getFilterLabel()}</span>
                <span className="xs:hidden">Filter</span>
              </button>

              {/* Filter Dropdown */}
              <FilterDropdown
                isOpen={isFilterDropdownOpen}
                onClose={() => setIsFilterDropdownOpen(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Sort button with dropdown */}
            <div className="relative">
              <button
                onClick={handleSortClick}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-black bg-white hover:bg-gray-50 transition-colors"
              >
                <FiBarChart2
                  size={16}
                  className="transform rotate-90 sm:w-5 sm:h-5"
                />
                <span className="hidden xs:inline">
                  {getSortLabel(selectedSort)}
                </span>
                <span className="xs:hidden">Sort</span>
              </button>

              {/* Sort Dropdown */}
              <SortDropdown
                isOpen={isSortModalOpen}
                onClose={() => setIsSortModalOpen(false)}
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
