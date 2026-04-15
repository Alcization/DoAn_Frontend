"use client";

import React from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { LocationModel } from "../hooks/useVietmapFacade";

/**
 * Abstract Factory Interface for Location Components
 */
export interface LocationComponentFactory {
  createSearchInput(props: {
    value: string;
    onChange: (val: string) => void;
    onFocus: () => void;
    isSearching: boolean;
    placeholder: string;
    label: string;
    active: boolean;
  }): React.ReactNode;

  createResultDropdown(props: {
    results: any[];
    onSelect: (result: any) => void;
  }): React.ReactNode;
}

/**
 * Concrete Factory for Standard Mode (Theme Aware)
 */
export class StandardLocationFactory implements LocationComponentFactory {
  createSearchInput({ value, onChange, onFocus, isSearching, placeholder, label, active }: any) {
    return (
      <div className="space-y-2 relative">
        <label className="text-xs font-black uppercase tracking-widest text-(--color-text-muted) ml-1">
          {label}
        </label>
        <div className="relative group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-muted) group-focus-within:text-(--color-primary) transition-colors" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            placeholder={placeholder}
            className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border bg-(--color-bg) text-(--color-text-primary) focus:ring-4 focus:ring-(--color-primary)/10 outline-none transition-all font-bold ${
              active ? 'border-(--color-primary) shadow-sm' : 'border-(--color-border)'
            }`}
          />
          {isSearching && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-(--color-primary)" />}
        </div>
      </div>
    );
  }

  createResultDropdown({ results, onSelect }: any) {
    if (results.length === 0) return null;
    return (
      <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[1050] bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2">
        {results.map((r: any, i: number) => (
          <button
            key={i}
            onClick={() => onSelect(r)}
            className="w-full px-5 py-3 text-left hover:bg-(--color-bg-secondary) flex items-center gap-3 border-b border-(--color-border) last:border-none group cursor-pointer"
          >
            <MapPin size={16} className="text-(--color-text-muted) group-hover:text-(--color-primary)" />
            <div className="truncate">
              <p className="text-sm font-bold text-(--color-text-primary) truncate">{r.name}</p>
              <p className="text-[10px] text-(--color-text-muted) truncate">{r.address}</p>
            </div>
          </button>
        ))}
      </div>
    );
  }
}

/**
 * Concrete Factory for High Contrast / Minimalist Mode (Optional Pattern Demo)
 */
export class MinimalistLocationFactory extends StandardLocationFactory {
  // Can override specific methods to provide a different look
}
