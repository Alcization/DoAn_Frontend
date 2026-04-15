"use client";

import { useTranslation } from "react-i18next";
import { LucideIcon } from "lucide-react";
import { LocationModel } from "@/app/normal/hooks/useVietmapFacade";

interface RiskLocationInputProps {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  placeholder: string;
  isSearching: boolean;
  showResults: boolean;
  results: LocationModel[];
  onSearch: (text: string) => void;
  onFocus: () => void;
  onSelect: (location: LocationModel) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const RiskLocationInput = ({
  id,
  label,
  icon: Icon,
  value,
  placeholder,
  isSearching,
  showResults,
  results,
  onSearch,
  onFocus,
  onSelect,
  containerRef,
}: RiskLocationInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-(--text-sm) font-semibold text-(--color-text-secondary) flex items-center gap-2">
        <Icon size={16} /> {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={onFocus}
          className="w-full px-3.5 py-3 rounded-xl border border-(--color-border) text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) focus:border-(--color-primary) transition-all outline-none"
        />
        {isSearching && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-(--color-surface) border border-(--color-border) rounded-xl shadow-(--shadow-lg) animate-in fade-in slide-in-from-top-2">
          {results.map((result, idx) => (
            <button
              key={`${result.ref_id || idx}-${idx}`}
              onClick={() => onSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-(--color-bg) transition-colors border-b last:border-0 border-(--color-border) flex flex-col gap-0.5"
            >
              <span className="text-(--text-sm) font-medium text-(--color-text-primary)">
                {result.name || result.display}
              </span>
              <span className="text-(--text-xs) text-(--color-text-secondary) line-clamp-1">
                {result.address}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
