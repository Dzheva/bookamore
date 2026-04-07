import { useEffect, useRef, useState } from 'react';
import { RadioBtn } from '@/shared/components/RadioBtn';
import { CrossSvg } from '../icons/CrossSvg';

export type SortOption = 'relevance' | 'lowest-price' | 'highest-price';

interface SortDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: 'relevance' as const, label: 'Relevance' },
  { value: 'lowest-price' as const, label: 'Lowest Price' },
  { value: 'highest-price' as const, label: 'Highest Price' },
];

export function SortDropdown({
  isOpen,
  onClose,
  selectedSort,
  onSortChange,
}: SortDropdownProps) {
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

  // Adjust dropdown position based on screen space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If dropdown goes off screen to the right, position it to the left
      if (rect.right > viewportWidth - 16) {
        setDropdownPosition('right-0');
      }
    }
  }, [isOpen]);

  const handleSortChange = (sortValue: SortOption) => {
    onSortChange(sortValue);
    onClose(); // Close dropdown after selection
  };

  // Handle clicks/touches outside dropdown
  useEffect(() => {
    const handleOutsideClick = (event: Event) => {
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
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full ${dropdownPosition} mt-2 w-48 sm:w-52 bg-white border border-gray-500 rounded-xl shadow-xl z-50 ${
        isMobile ? 'max-w-[calc(100vw-2rem)]' : ''
      }`}
      role="menu"
      aria-orientation="vertical"
    >
      {/* Arrow pointing up */}
      <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-500 transform rotate-45"></div>

      {/* Header */}
      <div className="p-3 border-b border-gray-300 flex items-center justify-between rounded-t-3xl">
        <span className="text-h3m lg:text-h2m text-text-black">Sort by</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-grass-100 rounded-full transition-colors"
        >
          <CrossSvg className="text-icons-black" />
        </button>
      </div>

      {/* Sort options */}
      <div className="space-y-3 lg:space-y-1.5 p-2.5 px-4">
        {sortOptions.map((option) => (
          <RadioBtn
            key={option.value}
            name="sort"
            value={option.value}
            label={option.label}
            isChecked={selectedSort === option.value}
            onChange={() => handleSortChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
}
