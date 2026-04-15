"use client";

import { useTranslation } from "react-i18next";
import { CloudRain, Droplets, Wind, LucideIcon, Thermometer } from "lucide-react";

/**
 * WeatherMetric Model (Adapter Pattern)
 * Standardizes metric data for the UI
 */
export interface WeatherMetric {
  icon: LucideIcon;
  label: string;
  value: string;
  type: "temp" | "rain" | "humidity" | "wind";
}

/**
 * useWeatherAdapter (Adapter Pattern)
 * Transforms raw weather data into standardized UI models.
 */
export function useWeatherAdapter() {
  const { t } = useTranslation();

  /**
   * Adapts raw data into a set of standard weather metrics
   */
  const adaptCurrentWeather = (data: any): WeatherMetric[] => {
    return [
      { 
        icon: CloudRain, 
        label: t("home.current.rain", { defaultValue: "Lượng mưa" }), 
        value: data?.rain ? `${data.rain} mm` : "0 mm",
        type: "rain"
      },
      { 
        icon: Droplets, 
        label: t("home.current.humidity", { defaultValue: "Độ ẩm" }), 
        value: data?.humidity !== undefined ? `${data.humidity}%` : "75%",
        type: "humidity"
      },
      { 
        icon: Wind, 
        label: t("home.current.wind", { defaultValue: "Sức gió" }), 
        value: data?.windSpeed !== undefined ? `${data.windSpeed} km/h` : "12 km/h",
        type: "wind"
      }
    ];
  };

  /**
   * Get primary temperature metric
   */
  const adaptTemperature = (temp: number | string): WeatherMetric => {
    return {
      icon: Thermometer,
      label: t("weather.current.temp", { defaultValue: "Nhiệt độ" }),
      value: `${temp || "32"}°C`,
      type: "temp"
    };
  };

  return {
    adaptCurrentWeather,
    adaptTemperature
  };
}