import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RadioBtn } from '@/shared/components/RadioBtn';
import { CrossSvg } from '../icons/CrossSvg';

export type SortOption = 'relevance' | 'lowest-price' | 'highest-price';

interface SortDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortDropdown({
  isOpen,
  onClose,
  selectedSort,
  onSortChange,
}: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const sortOptions = [
    { value: 'relevance' as const, label: t('sortOptions.relevance') },
    { value: 'lowest-price' as const, label: t('sortOptions.lowestPrice') },
    { value: 'highest-price' as const, label: t('sortOptions.highestPrice') },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
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

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-gray-500 bg-white shadow-xl sm:w-52"
      role="menu"
      aria-orientation="vertical"
    >
      {/* Arrow */}
      <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 border-l border-t border-gray-500 bg-white" />

      {/* Header */}
      <div className="flex items-center justify-between rounded-t-3xl border-b border-gray-300 p-3">
        <span className="text-h3m text-text-black lg:text-h2m">
          {t('titles.sortBy')}
        </span>

        <button
          onClick={onClose}
          className="rounded-full p-1 outline-grass-500 transition-colors hover:bg-grass-100 focus:bg-grass-100"
          aria-label={t('close', { ns: 'common' })}
        >
          <CrossSvg className="text-icons-black" />
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3 p-2.5 px-4 lg:space-y-1.5">
        {sortOptions.map(({ value, label }) => (
          <RadioBtn
            key={value}
            name="sort"
            value={value}
            label={label}
            isChecked={selectedSort === value}
            onChange={() => handleSortChange(value)}
          />
        ))}
      </div>
    </div>
  );
}
