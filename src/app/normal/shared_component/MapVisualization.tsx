"use client";

import { useTranslation } from "react-i18next";
import { AlertTriangle, Activity, Cloud } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ROUTE_SEGMENTS_MOCK } from "../../../context/services/mock/normal/shared/map";
import { decodePolyline } from "@/util/polyline";
import { API_BASE_URL } from "@/services/api-config";

// Design Pattern Infrastructure
import { 
  VisualizationProcessor, 
  TrafficStrategy, 
  WeatherStrategy, 
  VisualizationStrategy 
} from "../hooks/VisualizationStrategy";

// Dynamic import for VietMap
const VietMap = dynamic(() => import("./VietMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-(--color-bg-secondary) text-(--color-text-secondary)">Loading Map...</div>
});

// --- API FETCHING LOGIC ---

type WeatherLabel = "sunny" | "cloudy" | "rainy" | "clear";

export interface SegmentWeatherData {
  weather: WeatherLabel;
  temperatureC: number | null;
}

const normalizeWeather = (condition?: string, isDayTime: boolean = true): WeatherLabel => {
  const normalized = (condition || "").toLowerCase();

  if (["rain", "drizzle", "thunderstorm", "squall"].includes(normalized)) return "rainy";
  if (["clouds", "mist", "fog", "haze", "smoke", "dust", "sand", "ash", "tornado"].includes(normalized)) return "cloudy";
  if (normalized === "clear") return isDayTime ? "sunny" : "clear";
  return isDayTime ? "sunny" : "clear";
};

// Hàm dịch thời tiết sang tiếng Việt để lưu Database
const translateWeatherToVietnamese = (weather: string): string => {
  switch (weather) {
    case "sunny": return "Nắng";
    case "cloudy": return "Nhiều Mây";
    case "rainy": return "Mưa";
    case "clear": return "Quang đãng";
    default: return "Bình thường";
  }
};

const fetchWeatherData = async (lat: number, lon: number, apiKey?: string) => {
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      console.warn("OpenWeather request failed:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Loi lay du lieu thoi tiet:", error);
    return null;
  }
};

export default function MapVisualization() {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useStatic, setUseStatic] = useState(false);
  const [locationDetails, setLocationDetails] = useState<{
    from: any;
    to: any;
  }>({ from: null, to: null });
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    time: number;
    points?: string;
  } | null>(null);
  
  const [weatherBySegment, setWeatherBySegment] = useState<SegmentWeatherData[]>([]);
  const openWeatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  const lastSavedRouteRef = useRef<string>("");

  const [vizMode, setVizMode] = useState<'traffic' | 'weather'>('traffic');
  const strategy: VisualizationStrategy = useMemo(() => 
    vizMode === 'traffic' 
      ? new TrafficStrategy() 
      : new WeatherStrategy(weatherBySegment) 
  , [vizMode, weatherBySegment]);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadWeatherAlongRoute = async () => {
      if (!routeInfo?.points) {
        setWeatherBySegment([]);
        return;
      }

      const fullCoords = decodePolyline(routeInfo.points);
      if (fullCoords.length < 2) {
        setWeatherBySegment([]);
        return;
      }

      const segmentCount = 4;
      const partLen = Math.max(1, Math.floor(fullCoords.length / segmentCount));
      const sampleCoords: Array<[number, number]> = [];

      for (let i = 0; i < segmentCount; i++) {
        const start = i * partLen;
        const end = i === segmentCount - 1 ? fullCoords.length : Math.min(fullCoords.length, (i + 1) * partLen + 1);
        const segmentCoords = fullCoords.slice(start, end);

        if (segmentCoords.length > 0) {
          sampleCoords.push(segmentCoords[Math.floor(segmentCoords.length / 2)]);
        }
      }

      if (!openWeatherApiKey) {
        if (!isCancelled) {
          setWeatherBySegment(sampleCoords.map(() => ({ weather: "sunny", temperatureC: null })));
        }
        return;
      }

      const weatherResponses = await Promise.all(
        sampleCoords.map(async ([lng, lat]) => {
          const weatherData = await fetchWeatherData(lat, lng, openWeatherApiKey);
          const weatherMain = weatherData?.weather?.[0]?.main;
          const icon = weatherData?.weather?.[0]?.icon as string | undefined;
          const temperatureK = weatherData?.main?.temp as number | undefined;
          const isDayTime = icon ? icon.endsWith("d") : true;

          return {
            weather: normalizeWeather(weatherMain, isDayTime),
            temperatureC: typeof temperatureK === "number" ? Number((temperatureK - 273.15).toFixed(1)) : null
          };
        })
      );

      if (!isCancelled) {
        setWeatherBySegment(weatherResponses);
      }
    };

    loadWeatherAlongRoute();

    return () => {
      isCancelled = true;
    };
  }, [routeInfo?.points, openWeatherApiKey]);

  useEffect(() => {
    const saveRouteHistory = async () => {
      if (!locationDetails.from || !locationDetails.to) {
        return;
      }

      const originName = locationDetails.from.name || locationDetails.from.address;
      const destinationName = locationDetails.to.name || locationDetails.to.address;
      const routeKey = `${originName}-${destinationName}`;

      if (lastSavedRouteRef.current === routeKey) {
        console.log("=> [Dừng]: Tuyến đường này đã được lưu vào lịch sử rồi (chống spam).");
        return;
      }
      const token = localStorage.getItem("accessToken");

      const midPointIndex = Math.floor(weatherBySegment.length / 2);
      const representativeWeather = weatherBySegment[midPointIndex]?.weather || "sunny";
      const weatherStatusVN = translateWeatherToVietnamese(representativeWeather);

      const payload = {
        origin: originName,
        destination: destinationName,
        weather_status: weatherStatusVN
      };

      try {
        const response = await fetch(`${API_BASE_URL}/routes/history`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => null);

        if (response.ok) {
          lastSavedRouteRef.current = routeKey;
        } else {
          console.error("=> LƯU THẤT BẠI. Server trả về lỗi:", response.status, result);
        }
      } catch (error) {
        console.error("=> LỖI FETCH API (Có thể do sai cổng kết nối, sập server hoặc CORS):", error);
      }
    };

    saveRouteHistory();
  }, [locationDetails, weatherBySegment]);


  const visualization = useMemo(() => {
    if (!routeInfo?.points) return null;
    const fullCoords = decodePolyline(routeInfo.points);
    return VisualizationProcessor.processRoute(fullCoords, strategy);
  }, [routeInfo?.points, strategy]);

  const routeData = useMemo(() => visualization?.geoJson || null, [visualization]);

  useEffect(() => {
    const handleRouteFound = (event: any) => {
      const data = event.detail;
      if (data?.paths?.[0]) {
        const path = data.paths[0];
        setRouteInfo({ distance: path.distance, time: path.time, points: path.points });
        // lastSavedRouteRef.current = ""; 
      }
    };

    const handleLocationDetails = (event: any) => {
      const { type, info } = event.detail;
      setLocationDetails(prev => {
        if (prev[type as 'from' | 'to']?.name !== info?.name) {
          lastSavedRouteRef.current = ""; 
        }
        return { ...prev, [type]: info };
      });
    };

    window.addEventListener("vietmap_route_found", handleRouteFound);
    window.addEventListener("vietmap_location_details_found", handleLocationDetails);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener("vietmap_route_found", handleRouteFound);
      window.removeEventListener("vietmap_location_details_found", handleLocationDetails);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_VIETMAP_MAP_API_KEY || process.env.NEXT_PUBLIC_VIETMAP_API_KEY;

  return (
    <div className="relative w-full h-full" ref={mapContainerRef}>
      <div className={`relative w-full z-1 ${isFullscreen ? 'h-screen' : 'h-96 sm:h-[500px] lg:h-[600px]'}`}>
        {useStatic ? (
          <StaticMapPreview apiKey={apiKey} center={locationDetails.to} />
        ) : (
          <VietMap routeData={routeData} vizMode={vizMode} />
        )}

        {/* Floating Viz Toggles (Strategy Switcher) */}
        {!useStatic && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {[
              { id: 'traffic', Icon: Activity, title: 'Traffic Status' },
              { id: 'weather', Icon: Cloud, title: 'Weather Status' }
            ].map(({ id, Icon, title }) => (
              <button 
                key={id}
                onClick={() => setVizMode(id as any)}
                className={`p-2.5 rounded-xl shadow-lg border transition-all active:scale-95 ${
                  vizMode === id 
                    ? 'bg-(--color-primary) text-white border-transparent' 
                    : 'bg-(--color-surface) text-(--color-text-secondary) border-(--color-border) hover:text-(--color-primary)'
                }`}
                title={title}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 bg-(--color-surface) rounded-[20px] p-6 shadow-lg border border-(--color-border)">
        {/* Route Stats Facade */}
        <RouteStatsFacade routeInfo={routeInfo} t={t} />
        
        {/* Location Details Facade */}
        <LocationDetailsFacade details={locationDetails} />

        {/* Route Segment Progress */}
        <div className="mb-4">
          <p className="text-(--text-sm) font-bold text-(--color-text-primary) mb-3 m-0">
            {t("map.visualization.routeStatus")}
          </p>
          <div className="flex gap-1.5 mt-2">
            {(visualization?.segments || []).map((segment, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: `var(--color-${segment.color})` }}
                className="flex-1 h-2.5 rounded-full transition-all"
              />
            ))}
          </div>
          <div className="flex justify-between text-(--text-xs) font-medium text-(--color-text-secondary) mt-2">
            <span>0km</span>
            <span>{routeInfo ? (routeInfo.distance / 1000).toFixed(1) : "--"}km</span>
          </div>
        </div>

        {/* Advisory Section */}
        <div className="mb-6 p-4 bg-(--color-primary-bg) border border-(--color-primary)/20 rounded-[16px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-(--color-primary)" />
            <span className="text-(--text-sm) font-bold text-(--color-primary)">
              {t("map.visualization.advision")}:
            </span>
          </div>
          <span className="text-(--text-sm) font-bold text-(--color-primary)">
            {t("map.visualization.startAfter", { minutes: 15 })}
          </span>
        </div>

        {/* Alerts (Flyweight Pattern usage - shared mock alerts) */}
        {ROUTE_SEGMENTS_MOCK.find((s) => s.alert) && (
          <div className="p-4 rounded-[16px] bg-(--color-warning-bg) border border-(--color-warning)/20 text-(--color-warning) flex gap-3 items-center">
            <AlertTriangle size={20} className="shrink-0" />
            <span className="text-(--text-sm) font-medium">
               {t(`map.visualization.${ROUTE_SEGMENTS_MOCK.find((s) => s.alert)?.alert}`)} at km {ROUTE_SEGMENTS_MOCK.find((s) => s.alert)?.km} (15:30)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Facade for Route Statistics
 */
function RouteStatsFacade({ routeInfo, t }: { routeInfo: any, t: any }) {
  const stats = useMemo(() => [
    {
      label: t("map.visualization.time"),
      value: routeInfo 
        ? (routeInfo.time / 60000 > 60
            ? `${Math.floor(routeInfo.time / 3600000)}h ${Math.floor((routeInfo.time % 3600000) / 60000)}m`
            : `${Math.round(routeInfo.time / 60000)} ${t("common.minutes") || "min"}`)
        : "-- min",
      color: "text-(--color-primary)"
    },
    {
      label: t("map.visualization.distance"),
      value: routeInfo 
        ? (routeInfo.distance > 1000 
            ? `${(routeInfo.distance / 1000).toFixed(1)} km` 
            : `${Math.round(routeInfo.distance)} m`)
        : "-- km",
      color: "text-(--color-text-primary)"
    },
    {
      label: t("map.visualization.status"),
      value: routeInfo ? t("map.visualization.safe") : t("map.visualization.clear"),
      color: routeInfo ? "text-(--color-success)" : "text-(--color-text-muted)"
    }
  ], [routeInfo, t]);

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {stats.map((s, i) => (
        <div key={i}>
          <p className="text-(--text-xs) uppercase font-bold tracking-wider text-(--color-text-secondary) mb-1 m-0">
            {s.label}
          </p>
          <p className={`text-(--text-xl) font-black m-0 ${s.color}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Facade for Location Details
 */
function LocationDetailsFacade({ details }: { details: any }) {
  if (!details.from && !details.to) return null;

  return (
    <div className="mb-6 p-4 bg-(--color-bg) rounded-[16px] border border-(--color-border)">
      <div className="space-y-4">
        {['from', 'to'].map((type) => {
          const loc = details[type];
          if (!loc) return null;
          return (
            <div key={type} className={`flex gap-3 ${type === 'to' && details.from ? 'border-t border-(--color-border) pt-4' : ''}`}>
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${type === 'from' ? 'bg-(--color-success)' : 'bg-(--color-danger)'}`} />
              <div>
                <p className="text-(--text-sm) font-bold text-(--color-text-primary) m-0">{loc.name}</p>
                <p className="text-(--text-xs) text-(--color-text-secondary) m-0">{loc.address}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {loc.boundaries?.map((b: any) => (
                    <span key={b.id} className="px-2 py-0.5 bg-(--color-bg-secondary) rounded-md text-[10px] text-(--color-text-secondary) border border-(--color-border)">
                      {b.full_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Proxy/Adapter for Static Map
 */
function StaticMapPreview({ apiKey, center }: { apiKey?: string, center: any }) {
  const coords = center?.lat ? center : { lat: 10.762622, lng: 106.660172 };
  return (
    <div className="w-full h-full flex items-center justify-center bg-(--color-bg-secondary) p-4">
      <div className="relative group max-w-full max-h-full overflow-hidden rounded-xl border border-(--color-border) shadow-2xl">
        <img 
          src={`https://maps.vietmap.vn/api/static/v3/map?apikey=${apiKey}&lat=${coords.lat}&lng=${coords.lng}&zoom=15&width=800&height=500`}
          alt="Static Map Preview"
          className="max-w-full h-auto block"
        />
      </div>
    </div>
  );
}