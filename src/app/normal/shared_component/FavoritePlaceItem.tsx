"use client";

import { MapPin, CloudRain, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface FavoritePlaceItemProps {
  loc: any;
  mode: "business" | "personal";
  navMode?: "business" | "personal";
}

export default function FavoritePlaceItem({ loc, mode, navMode }: FavoritePlaceItemProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // State lưu trữ dữ liệu thời tiết thực
  const [temp, setTemp] = useState<number | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>("sunny");

  useEffect(() => {
    // Nếu không có tọa độ, không gọi API
    if (!loc.lat || !loc.lng) return;

    const fetchWeather = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; 
        if (!API_KEY) {
          console.warn("Thiếu API Key cho OpenWeather");
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lng}&units=metric&appid=${API_KEY}`
        );
        
        if (!res.ok) throw new Error("Lỗi khi tải thời tiết");
        
        const data = await res.json();
        
        // Làm tròn nhiệt độ
        setTemp(Math.round(data.main.temp));

        // Phân loại thời tiết để hiển thị icon/emoji tương ứng
        const mainWeather = data.weather[0].main.toLowerCase();
        if (mainWeather.includes("clear")) {
          setWeatherCondition("sunny");
        } else if (mainWeather.includes("cloud")) {
          setWeatherCondition("cloudy");
        } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
          setWeatherCondition("rainy");
        } else if (mainWeather.includes("snow")) {
          setWeatherCondition("snowy");
        } else if (mainWeather.includes("thunderstorm")) {
          setWeatherCondition("stormy");
        } else {
          setWeatherCondition("cloudy"); // Mặc định
        }
      } catch (error) {
        console.error("Lỗi fetch OpenWeather API:", error);
      }
    };

    fetchWeather();
  }, [loc.lat, loc.lng]);

  const handleNavigateToWeather = () => {
    router.push(`/normal/${navMode || mode}/page?tab=weather&loc=${encodeURIComponent(loc.name)}`);
  };

  // Hàm render Emoji dựa trên trạng thái thời tiết
  const renderWeatherIcon = () => {
    switch (weatherCondition) {
      case "sunny": return "☀️";
      case "cloudy": return "⛅";
      case "rainy": return "🌧️";
      case "snowy": return "❄️";
      case "stormy": return "⛈️";
      default: return "☀️";
    }
  };

  return (
    <div className="p-3.5 rounded-lg bg-[var(--color-bg)] flex justify-between items-center group">
      <div className="flex items-center gap-3 w-[60%]">
        {loc.isRoute ? (
          <Navigation size={22} className="text-[var(--color-primary)] shrink-0" />
        ) : (
          <MapPin size={22} className="text-[var(--color-text-muted)] shrink-0" />
        )}
        <div className="overflow-hidden">
          <p className="m-0 font-semibold text-[var(--color-text-primary)] truncate">
            {loc.name}
          </p>
          <span className="text-[var(--color-text-muted)] text-[var(--text-xs)] truncate block">
            {loc.isRoute && loc.end_address ? (
              `${loc.address} → ${loc.end_address}`
            ) : (
              loc.address
            )}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2.5">
        <div className="flex items-center gap-2">
          <div className="text-[26px] leading-none">
            {renderWeatherIcon()}
          </div>
          <div className="font-semibold text-[var(--color-text-primary)] min-w-[32px] text-right">
            {temp !== null ? `${temp}°C` : "--°C"}
          </div>
        </div>
        <button 
          onClick={handleNavigateToWeather}
          className="px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all duration-200 text-[11px] font-medium cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <CloudRain size={14} />
          {t("home.favorite.weatherForecast")}
        </button>
      </div>
    </div>
  );
}