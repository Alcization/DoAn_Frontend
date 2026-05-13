import { useMemo, useState, useEffect } from "react";
import { AlertTriangle, CloudRain, Thermometer, Wind, Droplets } from "lucide-react";
import { REPORT_KPI_BASE, KPI_METADATA } from "@/context/services/mock/normal/business/reports";
import { apiClient } from '@/services/api-config';
import { SavedRoute } from '@/app/normal/business/component/ReportFilters';

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
export const useKPIDataFactory = (timeRange: string, route?: SavedRoute | null) => {
  const [remoteData, setRemoteData] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to POST to backend weather endpoints
  const postWeather = async (path: string, lat: number, lon: number) => {
    // Normalize path: apiClient.baseURL already points to .../api, so strip leading /api if present
    const axiosPath = path.replace(/^\/api/, '');
    const res = await apiClient.post(axiosPath, { lat, lon });
    return res.data;
  };

  // Fetch KPI data from backend weather endpoints when timeRange or route changes
  useEffect(() => {
    let mounted = true;

    const fetchForRoute = async () => {
      if (!route) {
        setRemoteData(null);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const points: { lat: number; lon: number }[] = [];
        if (route.start_point) points.push({ lat: route.start_point.lat, lon: route.start_point.lng });
        if (route.end_point) points.push({ lat: route.end_point.lat, lon: route.end_point.lng });
        if (route.waypoints && route.waypoints.length > 0) {
          route.waypoints.slice(0, 2).forEach(w => points.push({ lat: w.lat, lon: w.lng }));
        }

        const uniq = Array.from(new Map(points.map(p => [`${p.lat},${p.lon}`, p])).values());

        const results = await Promise.all(uniq.map(async (p) => {
          if (timeRange === '24h') {
            const json = await postWeather('/api/weather/data/forecast/hourly', p.lat, p.lon);
            return { type: 'hourly', data: json } as const;
          } else {
            const json = await postWeather('/api/weather/data/forecast/daily', p.lat, p.lon);
            return { type: 'daily', data: json } as const;
          }
        }));

        // Aggregate across points using the actual backend schema.
        let sumTemp = 0;
        let sumRain = 0;
        let sumHum = 0;
        let sumWind = 0;
        let sampleCount = 0;
        let rainyHourCount = 0;

        for (const r of results) {
          if (r.type === 'hourly' && Array.isArray(r.data?.hourly)) {
            const hours = r.data.hourly.slice(0, 24);
            for (const h of hours) {
              const temp = Number(h.temp);
              const rain = Number(h.rain?.["1h"] ?? 0);
              const humidity = Number(h.humidity);
              const windSpeed = Number(h.wind_speed);

              if (!Number.isNaN(temp)) sumTemp += temp;
              if (!Number.isNaN(rain)) {
                sumRain += rain;
                if (rain > 0) rainyHourCount += 1;
              }
              if (!Number.isNaN(humidity)) sumHum += humidity;
              if (!Number.isNaN(windSpeed)) sumWind += windSpeed;

              sampleCount += 1;
            }
          } else if (r.type === 'daily' && Array.isArray(r.data?.daily)) {
            const days = r.data.daily.slice(0, 7);
            for (const d of days) {
              const temp = Number(d.temp?.day ?? d.temp ?? d.temperature ?? NaN);
              const rain = Number(d.rain ?? d.precipitation ?? d.total_precip ?? 0);
              const humidity = Number(d.humidity ?? d.relativehumidity_2m ?? NaN);
              const windSpeed = Number(d.wind_speed ?? d.windspeed ?? NaN);

              if (!Number.isNaN(temp)) sumTemp += temp;
              if (!Number.isNaN(rain)) sumRain += rain;
              if (!Number.isNaN(humidity)) sumHum += humidity;
              if (!Number.isNaN(windSpeed)) sumWind += windSpeed;

              sampleCount += 1;
            }
          }
        }

        const avgTemp = sampleCount > 0 ? sumTemp / sampleCount : REPORT_KPI_BASE.avgTemp;
        const avgRain = sampleCount > 0 ? sumRain / sampleCount : REPORT_KPI_BASE.avgRain;
        const avgHum = sampleCount > 0 ? sumHum / sampleCount : REPORT_KPI_BASE.avgHumidity;
        const avgWind = sampleCount > 0 ? sumWind / sampleCount : REPORT_KPI_BASE.avgWind;

        const computed = {
          avgTemp: +avgTemp.toFixed(1),
          avgRain: +avgRain.toFixed(1),
          avgHumidity: Math.round(avgHum),
          avgWind: +avgWind.toFixed(1),
          alertCount: rainyHourCount,
        };

        if (mounted) {
          setRemoteData(computed);
          setIsLoading(false);
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        if (mounted) {
          setRemoteData(null);
          setError(errMsg);
          setIsLoading(false);
        }
      }
    };

    fetchForRoute();

    return () => { mounted = false; };
  }, [timeRange, route?.route_id, route?.start_point?.lat, route?.start_point?.lng, route?.end_point?.lat, route?.end_point?.lng, route?.waypoints?.length]);

  const kpiItems = useMemo((): KPIItem[] => {
    // Prefer remote API data; fall back to base only if the API fails.
    const source = remoteData || REPORT_KPI_BASE;

    const rawData: Record<string, number> = {
      avgTemp: source.avgTemp ?? REPORT_KPI_BASE.avgTemp,
      avgRain: source.avgRain ?? REPORT_KPI_BASE.avgRain,
      avgHumidity: source.avgHumidity ?? REPORT_KPI_BASE.avgHumidity,
      avgWind: source.avgWind ?? REPORT_KPI_BASE.avgWind,
      alertCount: Math.round(source.alertCount ?? REPORT_KPI_BASE.alertCount),
    };

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
  }, [remoteData, timeRange]);

  return { kpiItems, isLoading, error };
};
