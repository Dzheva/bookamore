import { useEffect, useState, useRef } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

export type ConditionFilter = 'new' | 'used' | 'any';

export interface FilterState {
  condition: ConditionFilter;
  categories: string[];
}

interface FilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const conditionOptions = [
  { value: 'new' as const, label: 'New' },
  { value: 'used' as const, label: 'Used' },
  { value: 'any' as const, label: 'Any' },
];

const categoryOptions = [
  'Fantasy',
  'Science',
  'Romantic',
  'Children',
  'Historical',
  'Detective',
  'Biography',
  'Horror',
  'Comedy',
  'Drama',
  'Adventure',
  'Psychology',
];

export function FilterDropdown({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}: FilterDropdownProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isConditionExpanded, setIsConditionExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('right-0');

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Adjust dropdown position based on screen space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If dropdown goes off screen to the right, position it to the left
      if (rect.right > viewportWidth - 16) {
        setDropdownPosition('right-0');
      } else {
        setDropdownPosition('left-1/2 transform -translate-x-1/2');
      }
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Handle both mouse and touch events for better mobile support
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleConditionChange = (condition: ConditionFilter) => {
    setLocalFilters((prev) => ({ ...prev, condition }));
  };

  const handleCategoryToggle = (category: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      condition: 'any',
      categories: [],
    };
    setLocalFilters(resetFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full ${dropdownPosition} mt-1 bg-white rounded-xl w-72 sm:w-80 lg:w-96 max-h-[90vh] flex flex-col shadow-lg border border-gray-200 z-50 overflow-hidden ${
        isMobile ? 'max-w-[calc(100vw-2rem)]' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">Filter</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Condition Filter */}
        <div className="mb-3">
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setIsConditionExpanded(!isConditionExpanded)}
            >
              <h3 className="text-sm font-medium text-gray-900">Condition</h3>
              <FiChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${
                  isConditionExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </div>
            {isConditionExpanded && (
              <div className="space-y-1.5">
                {conditionOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={option.value}
                      checked={localFilters.condition === option.value}
                      onChange={() => handleConditionChange(option.value)}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-1">
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
            >
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <FiChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${
                  isCategoryExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </div>
            {isCategoryExpanded && (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {categoryOptions.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={localFilters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2.5 space-y-2 mt-auto">
        <button
          onClick={handleReset}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="w-full px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
