"use client";

import { useTranslation } from "react-i18next";
import { Clock, Navigation, Search, MapPin, Loader2, Car, Bike, Truck, Locate, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SAVED_ROUTES_MOCK } from "../../../context/services/mock/normal/shared/map";

// Design Pattern Hooks
import { useVietmapFacade, LocationModel } from "../hooks/useVietmapFacade";
import { useRoutingStrategy } from "../hooks/useRoutingStrategy";
import { useLocationMediator } from "../hooks/useLocationMediator";
import { useLocationCommands } from "../hooks/useLocationCommands";
import { RouteBuilder } from "../hooks/RouteBuilder";
import { StandardLocationFactory } from "./LocationComponentFactory";

export default function LocationInputs() {
  const { t } = useTranslation();
  
  // 1. Facade Pattern
  const { searchLocations, getPlaceDetail, reverseGeocode, isSearching } = useVietmapFacade();
  
  // 2. Mediator/State Pattern
  const { state, setLocation, setRouteData, swapRoute } = useLocationMediator();

  // 3. Command Pattern
  const { setCurrentLocation } = useLocationCommands(setLocation, reverseGeocode);
  
  // 4. Strategy Pattern
  const { findRoute } = useRoutingStrategy();

  // 5. Abstract Factory (UI)
  const uiFactory = useMemo(() => new StandardLocationFactory(), []);

  // Vehicle Strategy State
  const [vehicle, setVehicle] = useState<"car" | "motorcycle" | "truck">("car");
  const [truckCapacity, setTruckCapacity] = useState<string>("2000");

  // UI State
  const [activeInput, setActiveInput] = useState<"origin" | "destination" | null>(null);
  const [searchResults, setSearchResults] = useState<LocationModel[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Sync address strings for inputs
  const [searchQuery, setSearchQuery] = useState({
    origin: "",
    destination: ""
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync inputs with mediator state
  useEffect(() => {
    setSearchQuery({
      origin: state.origin?.address || "",
      destination: state.destination?.address || ""
    });
  }, [state.origin, state.destination]);

  const handleSearch = useCallback(async (text: string, type: "origin" | "destination") => {
    setSearchQuery(prev => ({ ...prev, [type]: text }));
    setActiveInput(type);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(text);
      setSearchResults(results);
    }, 500);
  }, [searchLocations]);

  const handleSelectResult = useCallback(async (result: LocationModel) => {
    const type = activeInput;
    if (!type) return;

    setActiveInput(null);
    setSearchResults([]);
    
    const detail = await getPlaceDetail(result.ref_id || "");
    if (detail) {
      const info = { 
        lat: detail.lat, 
        lng: detail.lng, 
        address: detail.display || result.display || result.name || "" 
      };
      setLocation(type, info);
    }
  }, [activeInput, getPlaceDetail, setLocation]);

  const handleGetCurrent = async (type: "origin" | "destination") => {
    setIsGettingLocation(true);
    try {
      await setCurrentLocation(type);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleFindRoute = async () => {
    if (!state.origin || !state.destination) {
      alert("Please select both origin and destination.");
      return;
    }

    try {
      // 6. Builder Pattern Flow
      const params = RouteBuilder.create()
        .addPoint(state.origin.lat, state.origin.lng)
        .addPoint(state.destination.lat, state.destination.lng)
        .setVehicle(vehicle)
        .setTruckCapacity(truckCapacity)
        .build();

      const response = await fetch(`/api/vietmap-route?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setRouteData(data);
      }
    } catch (err: any) {
      alert(`Error finding route: ${err.message}`);
    }
  };

  return (
    <div className="bg-(--color-surface) rounded-[24px] p-4 sm:p-6 shadow-(--shadow-md) flex flex-col gap-4 border border-(--color-border) relative">
      <div className="flex items-center gap-3 relative">
        <div className="flex-1 flex flex-col gap-4">
          {(["origin", "destination"] as const).map((type, idx) => (
            <div key={type} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-[12px] text-white font-bold flex items-center justify-center shrink-0 ${
                  idx === 0 ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {idx === 0 ? "A" : "B"}
              </div>
              <div className="relative flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery[type]}
                    onChange={(e) => handleSearch(e.target.value, type)}
                    onFocus={() => {
                      setActiveInput(type);
                      if (!idx && !searchQuery.origin) setShowHistory(true);
                    }}
                    className="w-full pl-10 pr-24 py-3 rounded-[12px] border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:border-(--color-primary) outline-none transition-colors text-sm"
                    placeholder={t(`map.inputs.${idx === 0 ? 'from' : 'to'}`)}
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-secondary)" size={18} />
                  
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {isSearching && activeInput === type && (
                      <Loader2 className="text-(--color-primary) animate-spin" size={18} />
                    )}
                    <button
                      onClick={() => handleGetCurrent(type)}
                      className="p-1.5 hover:bg-(--color-bg) rounded-full text-(--color-primary) transition-colors cursor-pointer"
                      title={t("map.inputs.currentLocation")}
                    >
                      {isGettingLocation ? <Loader2 className="animate-spin" size={18} /> : <Locate size={18} />}
                    </button>
                  </div>
                </div>

                {/* Abstract Factory renders results */}
                {activeInput === type && uiFactory.createResultDropdown({
                  results: searchResults,
                  onSelect: handleSelectResult
                })}

                {/* History Dropdown */}
                {showHistory && idx === 0 && SAVED_ROUTES_MOCK.length > 0 && !searchResults.length && searchQuery.origin === "" && (
                  <div className="absolute z-10 w-full mt-1 bg-(--color-surface) border border-(--color-border) rounded-[12px] shadow-lg max-h-60 overflow-y-auto">
                    <p className="px-4 py-2 text-xs font-bold text-(--color-text-secondary) border-b border-(--color-border) uppercase">
                      {t("map.inputs.recentRoutes") || "Recent"}
                    </p>
                    {SAVED_ROUTES_MOCK.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => {
                          handleSearch(route.from, 'origin');
                          handleSearch(route.to, 'destination');
                          setShowHistory(false);
                          setActiveInput(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-(--color-bg) border-b border-(--color-border) last:border-b-0 cursor-pointer"
                      >
                        <p className="font-semibold text-sm text-(--color-text-primary) m-0">
                          {route.from} → {route.to}
                        </p>
                        <p className="text-xs text-(--color-text-secondary) m-0 flex items-center gap-1">
                          <Clock size={12} /> {route.time}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={swapRoute}
          className="shrink-0 w-10 h-10 rounded-full bg-(--color-surface) border border-(--color-border) flex items-center justify-center text-(--color-primary) hover:bg-(--color-primary) hover:text-white transition-all shadow-md cursor-pointer"
        >
          <ArrowUpDown size={18} />
        </button>
      </div>

      {/* Strategy Selector (Vehicle) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-3 border-t border-b border-(--color-border) border-dashed">
        <div className="flex flex-wrap gap-2">
          {(["car", "motorcycle", "truck"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVehicle(v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-[12px] transition-all whitespace-nowrap cursor-pointer ${
                vehicle === v ? "bg-(--color-primary) text-white" : "bg-(--color-bg) text-(--color-text-secondary) hover:bg-(--color-border)"
              }`}
            >
              {v === "car" && <Car size={18} />}
              {v === "motorcycle" && <Bike size={18} />}
              {v === "truck" && <Truck size={18} />}
              <span className="text-sm font-medium">{t(`map.inputs.vehicle.${v}`)}</span>
            </button>
          ))}
        </div>

        {vehicle === "truck" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-(--color-text-secondary)">{t("map.inputs.capacity")}:</span>
            <input
              type="number"
              value={truckCapacity}
              onChange={(e) => setTruckCapacity(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-[8px] border border-(--color-border) bg-(--color-bg) text-sm outline-none focus:border-(--color-primary)"
            />
          </div>
        )}
      </div>

      <button onClick={handleFindRoute} className="w-full py-3 rounded-[12px] bg-linear-to-r from-(--color-primary-strong) to-(--color-primary) text-white font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer">
        {t("map.inputs.findRoute")}
      </button>

      {(activeInput || showHistory) && (
        <div className="fixed inset-0 z-5" onClick={() => { setActiveInput(null); setShowHistory(false); }} />
      )}
    </div>
  );
}
