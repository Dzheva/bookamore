import { useEffect, useState, useRef } from 'react';
import { RadioBtn } from '@/shared/components/RadioBtn';
import { Checkbox } from '@/shared/components/Checkbox';
import { CrossSvg } from '../icons/CrossSvg';
import { ChevronUpSvg } from '../icons/ChevronUpSvg';

export type ConditionFilter = 'new' | 'used' | 'any';
export type TypeOfDealFilter = 'purchase only' | 'Exchange only' | 'Both';

export interface FilterState {
  condition: ConditionFilter;
  categories: string[];
  typeOfDeal: TypeOfDealFilter;
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

const typeOfDealOptions = [
  { value: 'purchase only' as const, label: 'Purchase Only' },
  { value: 'Exchange only' as const, label: 'Exchange Only' },
  { value: 'Both' as const, label: 'Both' },
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
  const [isTypeOfDealExpanded, setIsTypeOfDealExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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

  const handleTypeOfDealChange = (typeOfDeal: TypeOfDealFilter) => {
    setLocalFilters((prev) => ({ ...prev, typeOfDeal }));
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
      typeOfDeal: 'Both',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 bg-white rounded-xl w-72 sm:w-80 lg:w-96 max-h-[78svh] flex flex-col shadow-lg border border-gray-500 z-50 overflow-hidden `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300">
        <h2 className="text-h2m text-text-black">Filter</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-grass-100 rounded-full outline-grass-500 focus:bg-grass-100"
        >
          <CrossSvg className="text-icons-black" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-custom">
        {/* Condition Filter */}
        <div className="mb-3">
          <div className="border border-gray-500 rounded-lg p-2.5">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsConditionExpanded(!isConditionExpanded)}
            >
              <h3 className="text-h3m lg:text-h2m font-medium text-text-black">
                Condition
              </h3>
              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${isConditionExpanded ? 'rotate-180' : 'rotate-90'}`}
              />
            </div>
            {isConditionExpanded && (
              <div className="space-y-1.5 lg:space-y-0 mt-2">
                {conditionOptions.map((option) => (
                  <RadioBtn
                    name="condition"
                    key={option.value}
                    value={option.value}
                    isChecked={localFilters.condition === option.value}
                    label={option.label}
                    onChange={() => handleConditionChange(option.value)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Type of Deal Filter */}
        <div className="mb-3">
          <div className="border border-gray-500 rounded-lg p-2.5">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsTypeOfDealExpanded(!isTypeOfDealExpanded)}
            >
              <h3 className="text-h3m lg:text-h2m font-medium text-text-black">
                Type of deal
              </h3>
              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${isTypeOfDealExpanded ? 'rotate-180' : 'rotate-90'}`}
              />
            </div>
            {isTypeOfDealExpanded && (
              <div className="space-y-1.5 lg:space-y-0 mt-2">
                {typeOfDealOptions.map((option) => (
                  <RadioBtn
                    key={option.value}
                    name="typeOfDeal"
                    value={option.value}
                    isChecked={localFilters.typeOfDeal === option.value}
                    label={option.label}
                    onChange={() => handleTypeOfDealChange(option.value)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-1">
          <div className="border border-gray-500 rounded-lg p-2.5">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
            >
              <h3 className="text-h3m lg:text-h2m font-medium text-text-black">
                Category
              </h3>
              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${isCategoryExpanded ? 'rotate-180' : 'rotate-90'}`}
              />
            </div>
            {isCategoryExpanded && (
              <div className="space-y-1.5 lg:space-y-0 mt-2">
                {categoryOptions.map((category) => (
                  <Checkbox
                    key={category}
                    isChecked={localFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    label={category}
                    size={16}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 p-2.5 space-y-2 mt-auto">
        <button
          onClick={handleApply}
          className="w-full px-3 py-2 bg-deep-blue text-white rounded-lg text-sm font-medium hover:bg-[#022F4F] active:bg-[#022F4F] transition-colors cursor-pointer"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="w-full px-3 py-2 border border-deep-blue rounded-lg text-sm font-medium text-text-black bg-white hover:bg-[#DDF3FF] active:bg-[#DDF3FF] hover:text-deep-blue transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
