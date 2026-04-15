import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";
import { REPORT_KPI_BASE, KPI_METADATA } from "@/context/services/mock/normal/business/reports";

// Icon mapping for mock strings
const IconMap: Record<string, any> = {
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  AlertTriangle,
};

/**
 * KPIItem defines the structure of a single KPI card's data.
 */
export interface KPIItem {
  icon: any;
  label: string;
  value: string;
  colorClass: string;
}

/**
 * useKPIDataFactory hook (Factory Method Pattern)
 * 
 * Acts as a factory for producing KPI metadata and values based on the dashboard 
 * context (like timeRange). This centralizes the calculation logic and data mapping.
 */
export const useKPIDataFactory = (timeRange: string) => {
  const { t } = useTranslation();

  const kpiItems = useMemo((): KPIItem[] => {
    // Logic to calculate data based on the business rules (mocked here)
    const multiplier = timeRange === "24h" ? 1 : timeRange === "7days" ? 1.05 : 1.1;
    
    const rawData: Record<string, number> = {
      avgTemp: REPORT_KPI_BASE.avgTemp * multiplier,
      avgRain: REPORT_KPI_BASE.avgRain * multiplier,
      avgHumidity: REPORT_KPI_BASE.avgHumidity * multiplier,
      avgWind: REPORT_KPI_BASE.avgWind * multiplier,
      alertCount: Math.round(REPORT_KPI_BASE.alertCount * multiplier),
    };

    // The "Factory" production: Mapping raw data to UI-ready KPI objects using metadata
    return KPI_METADATA.map(meta => {
      const val = rawData[meta.label];
      let valueStr = `${val}`;
      
      if (meta.label === "avgTemp") valueStr = `${val.toFixed(1)}°C`;
      else if (meta.label === "avgRain") valueStr = `${val.toFixed(1)} mm`;
      else if (meta.label === "avgHumidity") valueStr = `${val.toFixed(0)}%`;
      else if (meta.label === "avgWind") valueStr = `${val.toFixed(1)} km/h`;

      return {
        icon: IconMap[meta.icon],
        label: meta.label,
        value: valueStr,
        colorClass: meta.colorClass,
      };
    });
  }, [timeRange]);

  return { kpiItems };
};
