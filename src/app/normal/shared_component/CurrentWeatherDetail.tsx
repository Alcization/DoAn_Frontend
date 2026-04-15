"use client";

import { Thermometer, Loader2, Activity } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// Design Pattern Hooks & Factories
import { useWeatherAdapter } from "../hooks/useWeatherAdapter";
import { WeatherMetricFactory } from "./WeatherMetricFactory";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rain: number;
  aqi: number;
}

interface CurrentWeatherDetailProps {
  selectedLocation: string;
}

export default function CurrentWeatherDetail({ selectedLocation }: CurrentWeatherDetailProps) {
  const { t } = useTranslation();
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { adaptCurrentWeather } = useWeatherAdapter();

  // Cấu hình API
  const API_KEY = "b390e7544c25cda818a5a37c072529d2"; 
  const LAT = 10.7626; // Vĩ độ TP.HCM
  const LON = 106.6602; // Kinh độ TP.HCM
  const tempSymbol = unit === "C" ? "°C" : "°F";

  useEffect(() => {
    const fetchFullWeatherData = async () => {
      try {
        setLoading(true);
        
        const [weatherRes, airRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=vi`),
          fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`)
        ]);

        const wData = await weatherRes.json();
        const aData = await airRes.json();

        if (weatherRes.ok && airRes.ok) {
          setWeatherData({
            temp: wData.main.temp,
            description: wData.weather[0].description,
            icon: wData.weather[0].icon,
            humidity: wData.main.humidity,
            windSpeed: Math.round(wData.wind.speed * 3.6),
            rain: wData.rain ? wData.rain["1h"] || 0 : 0,
            aqi: aData.list[0].main.aqi
          });
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullWeatherData();
  }, []);

  const getAqiStatus = (aqi: number) => {
    const statusMap: Record<number, string> = {
      1: "Tốt",
      2: "Khá",
      3: "Trung bình",
      4: "Kém",
      5: "Rất kém"
    };
    return statusMap[aqi] || "N/A";
  };

  const convertTemp = (tempC: number) => 
    unit === "C" ? Math.round(tempC) : Math.round((tempC * 9) / 5 + 32);

  const weatherMetrics = useMemo(() => {
    const baseMetrics = adaptCurrentWeather({
      rain: weatherData?.rain,
      humidity: weatherData?.humidity,
      windSpeed: weatherData?.windSpeed,
    });

    const aqiMetric = {
      icon: Activity,
      label: t("weather.current.aqi", { defaultValue: "AQI" }),
      value: weatherData ? `${weatherData.aqi} (${getAqiStatus(weatherData.aqi)})` : "--",
      type: "aqi" as any
    };

    return [...baseMetrics, aqiMetric];
  }, [adaptCurrentWeather, weatherData, t]);

  if (loading) {
    return (
      <div className="rounded-[24px] p-12 bg-(--color-primary-bg) border border-(--color-primary)/10 text-(--color-text-primary) flex flex-col items-center justify-center min-h-[300px] shadow-(--shadow-md)">
        <Loader2 className="animate-spin mb-3 text-(--color-primary)" size={40} />
        <p className="animate-pulse font-medium">Đang cập nhật thời tiết...</p>
      </div>
    );
  }

  return (
    <div className="rounded-[24px] p-4 sm:p-6 shadow-(--shadow-md) bg-(--color-primary-bg) border border-(--color-primary)/10 text-(--color-text-primary) text-center transition-all duration-300">
      
      {/* Header: Toggle Unit & Location */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
          className="px-3 py-1.5 rounded-(--radius-md) bg-(--color-surface) hover:bg-(--color-bg-secondary) text-(--color-text-primary) shadow-sm border border-(--color-border) transition-all flex items-center gap-1.5 text-(--text-sm) cursor-pointer active:scale-95"
          title={t("weather.tooltips.convert")}
        >
          <Thermometer size={16} className="text-(--color-primary)" />
          {unit} ↔ {unit === "C" ? "F" : "C"}
        </button>
        <span className="text-(--text-sm) text-(--color-text-muted) font-medium">{selectedLocation}</span>
      </div>

      {/* Main Weather Visual */}
      <div className="flex justify-center mb-2">
        {weatherData?.icon ? (
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`} 
            alt="weather icon"
            className="w-32 h-32 object-contain drop-shadow-md animate-in zoom-in duration-500"
          />
        ) : (
          <div className="text-[72px] mb-3 animate-pulse">🌤️</div>
        )}
      </div>
      
      {/* Temperature & Description */}
      <div className="text-[48px] sm:text-[60px] lg:text-[72px] font-black text-(--color-primary) leading-none">
        {weatherData ? convertTemp(weatherData.temp) : "--"}
        <span className="text-[36px] sm:text-[48px]">{tempSymbol}</span>
      </div>
      <p className="mt-2 text-(--text-base) sm:text-(--text-lg) font-medium capitalize text-(--color-text-secondary)">
        {weatherData?.description || t("weather.current.desc")}
      </p>
      
      {/* Metrics Grid (Factory Pattern) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 text-left border-t border-(--color-border) pt-6">
        {weatherMetrics.map((metric, idx) => 
          WeatherMetricFactory.createDetailMetric(metric, `detail-metric-${idx}`)
        )}
      </div>
      
    </div>
  );
}