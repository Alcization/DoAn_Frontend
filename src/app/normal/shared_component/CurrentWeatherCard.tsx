"use client";

import { MapPin, Search, Loader2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api-config";

// Design Pattern Hooks
import { useVietmapFacade } from "../hooks/useVietmapFacade";
import { useWeatherAdapter } from "../hooks/useWeatherAdapter";
import { WeatherMetricFactory } from "./WeatherMetricFactory";

// Dynamically import the VietMap component
const VietMap = dynamic(() => import("./VietMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] flex items-center justify-center bg-white/10 rounded-xl border border-white/20">
      <Loader2 size={24} className="animate-spin text-white/50" />
    </div>
  ),
});

// Interface for Weather Data
interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

// Hàm dịch thời tiết sang tiếng Việt để lưu Database
const translateWeatherToVietnamese = (condition: string): string => {
  if (!condition) return "";
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle") || lowerCondition.includes("thunderstorm")) return "Mưa";
  if (lowerCondition.includes("cloud")) return "Nhiều Mây";
  if (lowerCondition.includes("clear")) return "Quang đãng";
  if (lowerCondition.includes("snow")) return "Tuyết";
  return "Bình thường";
};

export default function CurrentWeatherCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  // Design Pattern Hooks
  const { searchLocations, getPlaceDetail, reverseGeocode, isSearching, isReversing } = useVietmapFacade();
  const { adaptCurrentWeather } = useWeatherAdapter();
  
  // UI State
  const [selectedLocation, setSelectedLocation] = useState({ lat: 10.762622, lng: 106.660172 });
  const [address, setAddress] = useState("Q1, TP.HCM");
  
  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Search Map State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ref chống spam gọi API POST lưu lịch sử nhiều lần cho 1 địa điểm
  const lastSavedLocationRef = useRef<string>("");

  // --- Fetch Weather Data Logic ---
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    if (!API_KEY) return;
    
    setIsLoadingWeather(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          condition: data.weather[0].main,
        });
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [API_KEY]);

  // Fetch weather automatically when location changes
  useEffect(() => {
    fetchWeather(selectedLocation.lat, selectedLocation.lng);
  }, [selectedLocation, fetchWeather]);

  // --- LƯU LỊCH SỬ TÌM KIẾM THỜI TIẾT QUA API ---
  useEffect(() => {
    const saveWeatherHistory = async () => {
      // Đảm bảo đã có dữ liệu thời tiết và địa chỉ
      if (!weather || !address) return;

      // Chống spam: Nếu địa điểm và thời tiết này đã vừa được lưu xong thì bỏ qua
      const locationKey = `${address}-${weather.temp}-${weather.condition}`;
      if (lastSavedLocationRef.current === locationKey) return;

      const token = localStorage.getItem("accessToken");
      if (!token) return; // Không lưu nếu user chưa đăng nhập

      try {
        const weatherStatusVN = translateWeatherToVietnamese(weather.condition);
        const payload = {
          location: address,
          weather_status: weatherStatusVN,
          temp: weather.temp
          // Backend sẽ tự sinh ra 'time' theo mô tả API của bạn
        };

        const response = await fetch(`${API_BASE_URL}/routes/weather-history`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          console.log("Đã lưu lịch sử tìm kiếm thời tiết thành công:", address);
          lastSavedLocationRef.current = locationKey; // Đánh dấu đã lưu
        }
      } catch (error) {
        console.error("Lỗi khi lưu lịch sử tìm kiếm thời tiết:", error);
      }
    };

    // Delay 1 giây để chờ UI (địa chỉ, thời tiết) sync hoàn toàn với nhau trước khi gửi
    const timeoutId = setTimeout(saveWeatherHistory, 1000);
    return () => clearTimeout(timeoutId);
  }, [weather, address]);

  // Adapter Pattern: Memoize the metrics based on CURRENT WEATHER DATA
  const weatherMetrics = useMemo(() => adaptCurrentWeather(weather || {}), [adaptCurrentWeather, weather]);

  const updateLocation = useCallback(async (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    const newAddress = await reverseGeocode(lat, lng);
    setAddress(newAddress);
  }, [reverseGeocode]);

  const handleAutocomplete = useCallback(async (text: string) => {
    const results = await searchLocations(text);
    setSearchResults(results);
  }, [searchLocations]);

  const handleSelectResult = useCallback(async (result: any) => {
    const detail = await getPlaceDetail(result.ref_id);
    if (detail) {
      setSelectedLocation({ lat: detail.lat, lng: detail.lng });
      setAddress(detail.display || result.display || result.name);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [getPlaceDetail]);

  const handleInputSearch = (val: string) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => handleAutocomplete(val), 500);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => updateLocation(position.coords.latitude, position.coords.longitude),
        (err) => console.log("Geolocation error:", err)
      );
    }
  }, [updateLocation]);

  return (
    <section className="rounded-[24px] p-6 shadow-(--shadow-lg) bg-(--color-primary-bg) border border-(--color-primary)/10 text-(--color-text-primary) relative overflow-hidden transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-(--color-primary) opacity-5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header with Search */}
      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-start gap-2.5 p-1 -m-1">
              <MapPin size={20} className="shrink-0 mt-1 text-(--color-primary)" />
              <span className="text-[var(--text-base)] font-bold text-left">{address}</span>
            </div>
          </div>
          <span className="text-4xl animate-pulse">
             {/* Simple icon logic based on condition */}
             {weather?.condition?.toLowerCase().includes('rain') ? '🌧️' : 
              weather?.condition?.toLowerCase().includes('cloud') ? '☁️' : '☀️'}
          </span>
        </div>

        {/* Search Bar - Factory Pattern could be applied here for different input types if expanded */}
        {showMap && (
          <div className="relative mt-2 animate-in fade-in slide-in-from-top-2">
            <div className="relative group">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) group-focus-within:text-(--color-primary) transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleInputSearch(e.target.value)}
                placeholder={t("home.favorite.addModal.searchPlaceholder") || "Search location..."}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-primary) placeholder:text-(--color-text-muted) placeholder:opacity-100 focus:ring-4 focus:ring-(--color-primary)/10 outline-none transition-all text-sm shadow-sm"
              />
              {isSearching && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-(--color-primary)" />}
            </div>
            
            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-(--color-surface) border border-(--color-border) rounded-xl shadow-2xl mt-2 overflow-hidden text-(--color-text-primary)">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectResult(r)}
                    className="w-full px-4 py-2.5 text-left hover:bg-(--color-bg-secondary) flex items-center gap-3 border-b border-(--color-border) last:border-none group/item"
                  >
                    <MapPin size={14} className="text-(--color-text-muted) group-hover/item:text-(--color-primary)" />
                    <div className="truncate">
                      <p className="text-sm font-bold truncate">{r.name}</p>
                      <p className="text-[10px] text-(--color-text-muted) truncate">{r.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Implementation - Facade logic handles the updates */}
      <div className={`mb-6 transition-all duration-500 ease-in-out overflow-hidden border border-(--color-border) shadow-inner relative group/map ${showMap ? 'h-[350px] opacity-100 rounded-xl mt-2' : 'h-0 opacity-0 border-none'}`}>
        <div className="h-[350px] w-full relative">
          <VietMap
            selectedLocation={selectedLocation}
            onLocationChange={(pos) => updateLocation(pos.lat, pos.lng)}
            onClick={(pos) => updateLocation(pos.lat, pos.lng)}
            zoom={14}
            hideViz={true}
            hideZoomToBounds={true}
          />
          {(isReversing || isLoadingWeather) && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-10">
              <Loader2 size={24} className="animate-spin text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Weather Info Display */}
      <div className="text-5xl font-black mb-6 text-(--color-text-primary) flex items-baseline gap-1">
        {isLoadingWeather ? <Loader2 className="animate-spin" size={32} /> : (weather?.temp ?? "--")}
        <span className="text-2xl">°C</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {weatherMetrics.map((metric, idx) => 
          WeatherMetricFactory.createMetricCard(metric, `metric-${idx}`)
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 relative z-10 flex flex-row gap-3">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="flex-1 bg-(--color-surface) hover:bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border) active:scale-[0.98] transition-all py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"
        >
          {showMap ? t("common.hideMap") : t("common.showMap")}
        </button>
        <button
          onClick={() => router.push(`/normal/page/weather?location=${encodeURIComponent(address)}`)}
          className="flex-1 bg-(--color-primary) text-white hover:opacity-90 active:scale-[0.98] transition-all py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-1 sm:gap-2 shadow-lg shadow-(--shadow-sm)"
        >
          {t("sidebar.weatherForecast")}
          <ChevronRight size={16} strokeWidth={3} className="hidden sm:block" />
        </button>
      </div>
    </section>
  );
}