import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioBtn } from '@/shared/components/RadioBtn';
import { Checkbox } from '@/shared/components/Checkbox';
import { Button } from '@/shared/ui/Button/Button';
import { CrossSvg } from '../icons/CrossSvg';
import { ChevronUpSvg } from '../icons/ChevronUpSvg';
import { categories } from '@/shared/constants/categories';

export type ConditionFilter = 'new' | 'used' | 'asNew' | 'any';
export type TypeOfDealFilter = 'purchaseOnly' | 'exchangeOnly' | 'both';

interface ConditionOption {
  value: ConditionFilter;
  label: string;
}

interface typeOfDealOptions {
  value: TypeOfDealFilter;
  label: string;
}

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
  const { t } = useTranslation();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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

  const conditionOptions: ConditionOption[] = [
    { value: 'new', label: t('condition.NEW') },
    { value: 'asNew', label: t('condition.AS_NEW') },
    { value: 'used', label: t('condition.USED') },
    { value: 'any', label: t('condition.ANY') },
  ];

  const typeOfDealOptions: typeOfDealOptions[] = [
    { value: 'purchaseOnly', label: t('typeOfDeal.purchaseOnly') },
    { value: 'exchangeOnly', label: t('typeOfDeal.exchangeOnly') },
    { value: 'both', label: t('typeOfDeal.both') },
  ];

  const handleConditionChange = (condition: ConditionFilter) => {
    setLocalFilters((prev) => ({
      ...prev,
      condition,
    }));
  };

  const handleTypeOfDealChange = (typeOfDeal: TypeOfDealFilter) => {
    setLocalFilters((prev) => ({
      ...prev,
      typeOfDeal,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      condition: 'any',
      categories: [],
      typeOfDeal: 'both',
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
      className="absolute top-full right-0 mt-2 bg-white rounded-xl w-72 sm:w-80 lg:w-96 max-h-[78svh] flex flex-col shadow-lg border border-gray-500 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-300">
        <h2 className="text-h2m text-text-black">{t('titles.filter')}</h2>

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
                {t('titles.condition')}
              </h3>

              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${
                  isConditionExpanded ? 'rotate-180' : 'rotate-90'
                }`}
              />
            </div>

            {isConditionExpanded && (
              <div className="space-y-1.5 lg:space-y-0 mt-2">
                {conditionOptions.map((option) => (
                  <RadioBtn
                    key={option.value}
                    name="condition"
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
                {t('titles.typeOfDeal')}
              </h3>

              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${
                  isTypeOfDealExpanded ? 'rotate-180' : 'rotate-90'
                }`}
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
                {t('titles.category')}
              </h3>

              <ChevronUpSvg
                className={`text-icons-black transition-transform duration-200 ${
                  isCategoryExpanded ? 'rotate-180' : 'rotate-90'
                }`}
              />
            </div>

            {isCategoryExpanded && (
              <div className="space-y-1.5 lg:space-y-0 mt-2">
                {categories.map((category) => (
                  <Checkbox
                    key={category}
                    isChecked={localFilters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    label={t(`categories.${category}`)}
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
        <Button type="button" onClick={handleApply}>
          {t('common.apply')}
        </Button>

        <Button type="button" variant="secondary" onClick={handleReset}>
          {t('common.reset')}
        </Button>
      </div>
    </div>
  );
}
