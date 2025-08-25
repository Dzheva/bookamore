import { useEffect, useRef, useState } from "react";
import { FiChevronUp } from "react-icons/fi";

export type SortOption = "relevance" | "lowest-price" | "highest-price";

interface SortDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: "relevance" as const, label: "Relevance" },
  { value: "lowest-price" as const, label: "Lowest Price" },
  { value: "highest-price" as const, label: "Highest Price" },
];

export function SortDropdown({
  isOpen,
  onClose,
  selectedSort,
  onSortChange,
}: SortDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("right-0");

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Adjust dropdown position based on screen space
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If dropdown goes off screen to the right, position it to the left
      if (rect.right > viewportWidth - 16) {
        setDropdownPosition("right-0");
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
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      // Handle both mouse and touch events for better mobile support
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full ${dropdownPosition} mt-2 w-48 sm:w-52 bg-white border border-gray-200 rounded-3xl shadow-xl z-50 ${
        isMobile ? "max-w-[calc(100vw-2rem)]" : ""
      }`}
      role="menu"
      aria-orientation="vertical"
    >
      {/* Arrow pointing up */}
      <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
        <span className="text-sm font-medium text-gray-900">Sort by</span>
        <FiChevronUp size={16} className="text-gray-400" />
      </div>

      {/* Sort options */}
      <div className="py-2">
        {sortOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className={`
              w-full text-left px-4 py-3 text-sm transition-colors flex items-center
              ${isMobile ? "min-h-[44px]" : "py-2"} 
              ${isMobile ? "active:bg-gray-100" : "hover:bg-gray-50"}
              ${
                selectedSort === option.value
                  ? "text-gray-900 font-medium bg-gray-50"
                  : "text-gray-700"
              }
              ${index === sortOptions.length - 1 ? "rounded-b-3xl" : ""}
            `}
            role="menuitem"
          >
            <div
              className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedSort === option.value
                  ? "border-gray-800"
                  : "border-gray-300"
              }`}
            >
              {selectedSort === option.value && (
                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
              )}
            </div>
            <span className={`${isMobile ? "text-base" : "text-sm"}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
