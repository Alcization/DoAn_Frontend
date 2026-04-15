export const BUSINESS_ROUTES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Tuyến ${i + 1}`,
  from: `Điểm ${i + 1}`,
  to: `Điểm ${i + 20}`,
}));

export const WEATHER_DISTRIBUTION = [
  { name: "sunny_clear", value: 45, colorLight: "#f59e0b", colorDark: "#fbbf24" },
  { name: "rain", value: 30, colorLight: "#3b82f6", colorDark: "#60a5fa" },
  { name: "cloudy", value: 25, colorLight: "#94a3b8", colorDark: "#cbd5e1" },
];

export const REPORT_KPI_BASE = {
  avgTemp: 29.5,
  avgRain: 15.3,
  avgHumidity: 78,
  avgWind: 18.2,
  alertCount: 12,
};

export const DAYS_OF_WEEK = [
  { key: "Mon", value: "2" },
  { key: "Tue", value: "3" },
  { key: "Wed", value: "4" },
  { key: "Thu", value: "5" },
  { key: "Fri", value: "6" },
  { key: "Sat", value: "7" },
  { key: "Sun", value: "8" },
];

export const CHART_SERIES = [
  { key: "temp" as const, color: "#ef4444", label: "°C", gradientId: "gradTemp" },
  { key: "rain" as const, color: "#3b82f6", label: "mm", gradientId: "gradRain" },
  { key: "wind" as const, color: "#14b8a6", label: "km/h", gradientId: "gradWind" },
];

export const KPI_METADATA = [
  { label: "avgTemp", colorClass: "bg-blue-50 text-blue-600", icon: "Thermometer" },
  { label: "avgRain", colorClass: "bg-purple-50 text-purple-600", icon: "CloudRain" },
  { label: "avgHumidity", colorClass: "bg-green-50 text-green-600", icon: "Droplets" },
  { label: "avgWind", colorClass: "bg-cyan-50 text-cyan-600", icon: "Wind" },
  { label: "alertCount", colorClass: "bg-red-50 text-red-600", icon: "AlertTriangle" },
];

export const INITIAL_REPORT_SETTINGS = {
  scheduleType: "weekly" as "weekly" | "monthly",
  weeklyDay: "2",
  monthlyDay: "1",
  content: ["weather", "traffic"] as string[],
  formats: ["pdf"] as string[],
};
