"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Design Pattern Hooks & Components
import { useVietmapFacade, LocationModel } from "../hooks/useVietmapFacade";
import { useLocationMediator, LocationState } from "../hooks/useLocationMediator";
import { useLocationCommands } from "../hooks/useLocationCommands";
import { RouteBuilder } from "../hooks/RouteBuilder";
import { StandardLocationFactory } from "./LocationComponentFactory";

const VietMap = dynamic(() => import("./VietMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[350px] flex items-center justify-center bg-(--color-bg) rounded-3xl border border-(--color-border)">
      <Loader2 size={32} className="animate-spin text-(--color-primary)" />
    </div>
  ),
});

export type LocationInfo = LocationModel;

export type LocationSelectorData = {
  personal?: LocationInfo | null;
  origin?: LocationInfo | null;
  destination?: LocationInfo | null;
  routeData?: any;
};

type LocationSelectorProps = {
  mode: "business" | "personal";
  initialData?: LocationSelectorData;
  onSelectionChange: (data: LocationSelectorData) => void;
};

export default function LocationSelector({ mode, initialData, onSelectionChange }: LocationSelectorProps) {
  const { t } = useTranslation();
  
  const { searchLocations, getPlaceDetail, reverseGeocode, isSearching: isGlobalSearching } = useVietmapFacade();
  
  const { state, setLocation, setRouteData } = useLocationMediator({
    personal: initialData?.personal || null,
    origin: initialData?.origin || null,
    destination: initialData?.destination || null,
    routeData: initialData?.routeData || null,
  });

  const { clearLocation } = useLocationCommands(setLocation, reverseGeocode);
  const uiFactory = useMemo(() => new StandardLocationFactory(), []);

  const [activeSelection, setActiveSelection] = useState<'personal' | 'origin' | 'destination'>(
    mode === 'personal' ? 'personal' : 'origin'
  );
  const [searchResults, setSearchResults] = useState<LocationModel[]>([]);
  const [searchQuery, setSearchQuery] = useState({
    personal: initialData?.personal?.address || "",
    origin: initialData?.origin?.address || "",
    destination: initialData?.destination?.address || "",
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLocationSearch = useCallback(async (text: string, type: 'personal' | 'origin' | 'destination') => {
    setSearchQuery(prev => ({ ...prev, [type]: text }));
    setActiveSelection(type);

    if (!text || text.length < 2) {
      setSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(text);
      setSearchResults(results);
    }, 500);
  }, [searchLocations]);

  const handleSelectResult = useCallback(async (result: LocationModel) => {
    const type = activeSelection;
    setSearchResults([]);
    
    const detail = await getPlaceDetail(result.ref_id || "");
    if (detail) {
      const info: LocationInfo = { 
        lat: detail.lat, 
        lng: detail.lng, 
        address: detail.display || result.display || result.name || "" 
      };
      
      setLocation(type, info);
      setSearchQuery(prev => ({ ...prev, [type]: info.address }));
      
      if (mode === 'business' && type === 'origin' && !state.destination) {
        setActiveSelection('destination');
      }
    }
  }, [activeSelection, getPlaceDetail, setLocation, mode, state.destination]);

  const handleMapAction = useCallback(async (lat: number, lng: number, typeOverride?: 'personal' | 'origin' | 'destination') => {
    const type = typeOverride || activeSelection;
    const address = await reverseGeocode(lat, lng);
    const info = { lat, lng, address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}` };
    
    setLocation(type, info);
    setSearchQuery(prev => ({ ...prev, [type]: info.address }));
    
    if (mode === 'business' && type === 'origin' && !state.destination && !typeOverride) {
      setActiveSelection('destination');
    }
  }, [activeSelection, reverseGeocode, setLocation, mode, state.destination]);

  // Cập nhật lấy thêm distance
  useEffect(() => {
    if (mode === 'business' && state.origin && state.destination) {
      const fetchRoute = async () => {
        try {
          const params = RouteBuilder.create()
            .addPoint(state.origin!.lat, state.origin!.lng)
            .addPoint(state.destination!.lat, state.destination!.lng)
            .setPointsEncoded(false)
            .build();

          const res = await fetch(`/api/vietmap-route?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.paths?.[0]) {
              const routeGeo = {
                type: "Feature",
                geometry: { type: "LineString", coordinates: data.paths[0].points.coordinates },
                properties: {}
              };
              // Lấy khoảng cách (chuyển đổi từ mét sang km)
              const distanceKm = data.paths[0].distance ? data.paths[0].distance / 1000 : 0;
              
              const enhancedRouteData = { geoJson: routeGeo, distance: distanceKm };
              setRouteData(enhancedRouteData);
              
              onSelectionChange({ 
                origin: state.origin, 
                destination: state.destination, 
                routeData: enhancedRouteData 
              });
            }
          }
        } catch (err) {
          console.error("Route fetch error:", err);
        }
      };
      fetchRoute();
    } else if (mode === 'business') {
      setRouteData(null);
      onSelectionChange({ origin: state.origin, destination: state.destination, routeData: null });
    } else {
      onSelectionChange({ personal: state.personal });
    }
  }, [state.origin, state.destination, state.personal, mode, onSelectionChange, setRouteData]);

  useEffect(() => {
    if (initialData) {
      if (mode === 'personal' && initialData.personal) {
        setSearchQuery(p => ({ ...p, personal: initialData.personal?.address || "" }));
      } else if (mode === 'business') {
        setSearchQuery(p => ({ 
          ...p, 
          origin: initialData.origin?.address || "", 
          destination: initialData.destination?.address || "" 
        }));
      }
    }
  }, [initialData, mode]);

  return (
    <div className="space-y-6">
      {mode === 'personal' ? (
        <div className="relative">
          {uiFactory.createSearchInput({
            value: searchQuery.personal,
            onChange: (val: string) => handleLocationSearch(val, 'personal'),
            onFocus: () => setActiveSelection('personal'),
            isSearching: isGlobalSearching && activeSelection === 'personal',
            placeholder: t("home.favorite.addModal.searchPlaceholder"),
            label: t("home.favorite.addModal.addressLabel"),
            active: activeSelection === 'personal'
          })}
          {activeSelection === 'personal' && uiFactory.createResultDropdown({
            results: searchResults,
            onSelect: handleSelectResult
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['origin', 'destination'] as const).map((type) => (
            <div key={type} className="relative">
              {uiFactory.createSearchInput({
                value: searchQuery[type],
                onChange: (val: string) => handleLocationSearch(val, type),
                onFocus: () => setActiveSelection(type),
                isSearching: isGlobalSearching && activeSelection === type,
                placeholder: t(`sidebar.${type}Placeholder`),
                label: t(`sidebar.${type}`),
                active: activeSelection === type
              })}
              {activeSelection === type && uiFactory.createResultDropdown({
                results: searchResults,
                onSelect: handleSelectResult
              })}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-(--color-text-muted) ml-1">
          {t("home.favorite.addModal.selectLocation")}
        </label>
        <div className="h-[350px] rounded-3xl overflow-hidden border border-(--color-border) bg-(--color-bg) shadow-inner relative group/map">
          <VietMap
            routeData={state.routeData?.geoJson || state.routeData} // Truyền đúng geoJson vào VietMap
            selectedLocation={mode === 'personal' ? state.personal : null}
            originCoords={mode === 'business' ? state.origin : null}
            destCoords={mode === 'business' ? state.destination : null}
            onOriginChange={(ll) => handleMapAction(ll.lat, ll.lng, 'origin')}
            onDestChange={(ll) => handleMapAction(ll.lat, ll.lng, 'destination')}
            onLocationChange={(ll) => handleMapAction(ll.lat, ll.lng, 'personal')}
            onClick={(ll) => handleMapAction(ll.lat, ll.lng)}
            hideViz={true}
            hideZoomToBounds={true}
          />
        </div>
      </div>
    </div>
  );
}