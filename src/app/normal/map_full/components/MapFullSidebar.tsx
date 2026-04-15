"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Clock, MapPin, ChevronRight, Navigation, Loader2 } from 'lucide-react';

interface SidebarItemProps {
  name: string;
  address: string;
  time?: string;
  onClick: () => void;
  type: 'search' | 'history';
}

const SidebarItem: React.FC<SidebarItemProps> = ({ name, address, time, onClick, type }) => (
  <button 
    onClick={onClick}
    className="w-full p-4 bg-(--color-bg) dark:bg-(--color-surface)/50 rounded-2xl border border-(--color-border) flex gap-3 hover:bg-(--color-bg-secondary) dark:hover:bg-(--color-surface) transition-colors cursor-pointer group mb-3 shadow-(--shadow-sm) text-left"
  >
    <div className={`p-2 rounded-full h-fit flex-shrink-0 ${type === 'search' ? 'bg-(--color-primary-bg)' : 'bg-(--color-bg-secondary)'}`}>
      {type === 'search' ? (
        <MapPin className="text-(--color-primary)" size={18} />
      ) : (
        <Clock className="text-(--color-text-muted)" size={16} />
      )}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-sm font-bold text-(--color-text-primary) m-0 truncate">{name}</p>
      <p className="text-[11px] text-(--color-text-secondary) m-0 truncate mt-0.5">{address}</p>
      {time && <p className="text-[10px] text-(--color-text-muted) m-0 mt-1">{time}</p>}
    </div>
    <ChevronRight size={16} className="text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors self-center flex-shrink-0" />
  </button>
);

interface MapFullSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: 'search' | 'history';
  setActiveTab: (tab: 'search' | 'history') => void;
  history: any[];
}

export default function MapFullSidebar({ 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  setActiveTab, 
  history 
}: MapFullSidebarProps) {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (text: string) => {
    if (!text || text.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/vietmap-autocomplete?text=${encodeURIComponent(text)}&focus=10.762622,106.660172&display_type=5`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error("Autocomplete search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const onInputChange = (val: string) => {
    setSearchQuery(val);
    setActiveTab('search');
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(val);
    }, 500);
  };

  const handleSelectResult = async (result: any) => {
    try {
      // 1. Fetch detailed place info to get coordinates
      const placeRes = await fetch(`/api/vietmap-place?refid=${result.ref_id}`);
      if (placeRes.ok) {
        const placeDetail = await placeRes.json();
        const coords = { lat: placeDetail.lat, lng: placeDetail.lng };
        
        // 2. Dispatch event to update map and other components
        window.dispatchEvent(new CustomEvent("vietmap_location_details_found", {
          detail: {
            type: 'to', // Default to 'to' for general search
            coords,
            info: placeDetail
          }
        }));
        
        // Clean up search
        setSearchResults([]);
        setSearchQuery(placeDetail.display || result.display || result.name);
      }
    } catch (error) {
      console.error("Error selecting search result:", error);
    }
  };

  return (
    <aside className="w-full lg:w-96 bg-(--color-surface) border-r border-(--color-border) flex flex-col z-20 shadow-(--shadow-md)">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-(--color-primary) rounded-lg">
             <Navigation className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-(--color-text-primary) tracking-tight">
            {t('mapFull.title')}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" size={18} />
          <input 
            type="text"
            placeholder={t('mapFull.search.placeholder')}
            value={searchQuery}
            onChange={(e) => onInputChange(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-(--color-bg) border-none rounded-xl text-sm focus:ring-2 focus:ring-(--color-primary) transition-all outline-none text-(--color-text-primary)"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="animate-spin text-(--color-primary)" size={18} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-(--color-border) mb-4">
          <button 
            onClick={() => setActiveTab('search')}
            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'search' ? 'text-(--color-primary)' : 'text-(--color-text-muted)'}`}
          >
            {t('mapFull.search.results')}
            {activeTab === 'search' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary) rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-2 text-sm font-bold transition-colors relative ${activeTab === 'history' ? 'text-(--color-primary)' : 'text-(--color-text-muted)'}`}
          >
            {t('mapFull.search.history')}
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-primary) rounded-full" />}
          </button>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-hide">
        {activeTab === 'search' ? (
           <div className="space-y-1">
             {searchResults.length > 0 ? (
               searchResults.map((result, idx) => (
                 <SidebarItem 
                   key={result.ref_id || idx}
                   name={result.name}
                   address={result.address}
                   onClick={() => handleSelectResult(result)} 
                   type="search" 
                 />
               ))
             ) : searchQuery && !isSearching ? (
                <p className="text-center text-(--color-text-muted) text-sm mt-10">
                  {t('mapFull.search.noResults') || "No results found"}
                </p>
             ) : (
                <p className="text-center text-(--color-text-muted) text-sm mt-10">
                  {t('mapFull.search.startTyping') || "Start typing to search..."}
                </p>
             )}
           </div>
        ) : (
           <div className="space-y-1">
             {history.length > 0 ? history.map(item => (
               <SidebarItem 
                 key={item.id}
                 name={item.name}
                 address={item.address}
                 time={item.time}
                 onClick={() => {}}
                 type="history"
               />
             )) : (
               <p className="text-center text-(--color-text-muted) text-sm mt-10">
                 {t('mapFull.history.empty')}
               </p>
             )}
           </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-(--color-border) bg-(--color-surface)">
         <button className="w-full py-3 bg-(--color-primary) text-white rounded-xl font-bold text-sm shadow-(--shadow-md) hover:brightness-110 transition-all active:scale-[0.98]">
            {t('mapFull.actions.startNavigation')}
         </button>
      </div>
    </aside>
  );
}
