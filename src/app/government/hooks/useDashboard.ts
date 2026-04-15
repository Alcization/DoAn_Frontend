import { useState, useEffect, useMemo } from "react";
import { api } from "../../../context/services/api";
import { apiClient } from "@/services/api-config";
import { DashboardService } from "./DashboardService";

export type HeatmapArea = {
  id: number;
  name: string;
  region: string;
  risk: "low" | "medium" | "high";
  alerts: number;
  rainfall: number;
  wind: number;
  temp: number;
  lat: number;
  lng: number;
};

export type DashboardFilters = {
  timeframe: string;
  region: string;
  alertType: string;
};

type AreaApiResponse = {
  area_id: number;
  name: string;
  address: string;
  management_area?: {
    center?: {
      lat?: number;
      lng?: number;
    };
  };
};

type IncidentLike = {
  area: string;
  type: string;
  time: string;
};

type WeatherMetrics = {
  temp: number;
  rainfall: number;
  wind: number;
};

const DEFAULT_CENTER = {
  lat: 10.762622,
  lng: 106.660172,
};

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const parseIncidentDate = (time: string): Date | null => {
  const normalized = time.includes("T") ? time : time.replace(" ", "T");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const inferRisk = (alertCount: number): HeatmapArea["risk"] => {
  if (alertCount >= 15) return "high";
  if (alertCount >= 6) return "medium";
  return "low";
};

const extractWeatherMetrics = (payload: any): WeatherMetrics => {
  const timeline = payload?.WEATHER_TIMELINE;
  if (Array.isArray(timeline) && timeline.length > 0) {
    const latest = timeline[timeline.length - 1];
    return {
      temp: Number(latest?.temp) || 0,
      rainfall: Number(latest?.rain) || 0,
      wind: Number(latest?.wind) || 0,
    };
  }

  return {
    temp: Number(payload?.main?.temp ?? payload?.current?.temp ?? payload?.temp) || 0,
    rainfall: Number(payload?.rain?.["1h"] ?? payload?.rainfall ?? payload?.rain) || 0,
    wind: Number(payload?.wind?.speed ?? payload?.wind_speed ?? payload?.wind) || 0,
  };
};

export const useDashboard = () => {
  const [viewMode, setViewMode] = useState<"map" | "charts">("map");
  const [originalHeatmapData, setOriginalHeatmapData] = useState<HeatmapArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<HeatmapArea | null>(null);
  const [incidents, setIncidents] = useState<IncidentLike[]>([]);
  const [weatherByAreaAndTime, setWeatherByAreaAndTime] = useState<Record<string, WeatherMetrics>>({});
  const [filters, setFilters] = useState<DashboardFilters>({
    timeframe: "7days",
    region: "all",
    alertType: "all",
  });

  // Initial data fetching: managed areas + incident history from real APIs.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [areasResponse, incidentHistory] = await Promise.all([
          apiClient.get<AreaApiResponse[]>("/admin/areas"),
          api.government.getGovernmentIncidentHistory(),
        ]);

        const mappedAreas = (areasResponse.data || []).map((area) => {
          const lat = area.management_area?.center?.lat;
          const lng = area.management_area?.center?.lng;

          return {
            id: area.area_id,
            name: area.name,
            region: area.address || "TP.HCM",
            risk: "low" as const,
            alerts: 0,
            rainfall: 0,
            wind: 0,
            temp: 0,
            lat: typeof lat === "number" ? lat : DEFAULT_CENTER.lat,
            lng: typeof lng === "number" ? lng : DEFAULT_CENTER.lng,
          };
        });

        setOriginalHeatmapData(mappedAreas);
        setIncidents(incidentHistory);

        if (mappedAreas.length > 0) {
          setSelectedArea(mappedAreas[0]);
        }
      } catch {
        const fallback = await api.government.getDashboardSummary();
        const fallbackAreas = (fallback.HEATMAP_AREAS || []).map((area: any) => ({
          ...area,
          temp: 0,
        }));

        setOriginalHeatmapData(fallbackAreas);
        if (fallbackAreas.length > 0) {
          setSelectedArea(fallbackAreas[0]);
        }
      }
    };

    void fetchDashboardData();
  }, []);

  // Fetch weather for selected area on demand so detail panel shows live data.
  useEffect(() => {
    const fetchAreaWeather = async () => {
      if (!selectedArea) {
        return;
      }

      const weatherCacheKey = `${selectedArea.id}_${filters.timeframe}`;
      if (weatherByAreaAndTime[weatherCacheKey]) {
        return;
      }

      try {
        const weatherPayload = await api.shared.getWeatherData(selectedArea.name, {
          lat: selectedArea.lat,
          lng: selectedArea.lng,
        }, filters.timeframe as "24h" | "7days" | "30days");
        const metrics = extractWeatherMetrics(weatherPayload);
        setWeatherByAreaAndTime((prev) => ({
          ...prev,
          [weatherCacheKey]: metrics,
        }));
      } catch {
        // Keep zero values if weather API is unavailable.
      }
    };

    void fetchAreaWeather();
  }, [selectedArea, filters.timeframe, weatherByAreaAndTime]);

  const filteredHeatmapData = useMemo(() => {
    const timeframeStart = DashboardService.getTimeframeStart(filters.timeframe);

    const incidentsInScope = incidents.filter((incident) => {
      if (filters.alertType !== "all" && incident.type !== filters.alertType) {
        return false;
      }

      if (!timeframeStart) {
        return true;
      }

      const incidentDate = parseIncidentDate(incident.time);
      return incidentDate ? incidentDate >= timeframeStart : false;
    });

    const areaAlertCount = incidentsInScope.reduce<Record<string, number>>((acc, incident) => {
      const key = normalizeText(incident.area || "");
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const mergedData = originalHeatmapData.map((area) => {
      const alerts = areaAlertCount[normalizeText(area.name)] || 0;
      const weather = weatherByAreaAndTime[`${area.id}_${filters.timeframe}`];

      return {
        ...area,
        alerts,
        risk: inferRisk(alerts),
        rainfall: weather?.rainfall ?? area.rainfall,
        wind: weather?.wind ?? area.wind,
        temp: weather?.temp ?? area.temp,
      };
    });

    return DashboardService.filterHeatmapData(mergedData, filters);
  }, [filters, incidents, originalHeatmapData, weatherByAreaAndTime]);

  const totalAlerts = useMemo(() =>
    DashboardService.calculateTotalAlerts(filteredHeatmapData),
    [filteredHeatmapData]
  );

  // Sync selected area with filtered dataset changes.
  useEffect(() => {
    if (filteredHeatmapData.length === 0) {
      setSelectedArea(null);
      return;
    }

    if (!selectedArea) {
      setSelectedArea(filteredHeatmapData[0]);
      return;
    }

    const updatedSelected = filteredHeatmapData.find((area) => area.id === selectedArea.id);
    if (!updatedSelected) {
      setSelectedArea(filteredHeatmapData[0]);
      return;
    }

    if (
      updatedSelected.alerts !== selectedArea.alerts ||
      updatedSelected.rainfall !== selectedArea.rainfall ||
      updatedSelected.wind !== selectedArea.wind ||
      updatedSelected.temp !== selectedArea.temp ||
      updatedSelected.risk !== selectedArea.risk
    ) {
      setSelectedArea(updatedSelected);
    }
  }, [filteredHeatmapData, selectedArea]);

  return {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    selectedArea,
    setSelectedArea,
    filteredHeatmapData,
    totalAlerts,
    originalHeatmapData
  };
};
