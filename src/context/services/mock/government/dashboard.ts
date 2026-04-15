import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Droplets,
  Filter,
  Flame,
  Layers3,
  LineChart,
  MapPin,
  PieChart,
  Thermometer,
  Wind,
} from "lucide-react";

export type HeatmapArea = {
  id: number;
  name: string;
  region: string;
  risk: "low" | "medium" | "high";
  alerts: number;
  rainfall: number;
  wind: number;
  lat: number;
  lng: number;
};

export const HEATMAP_AREAS: HeatmapArea[] = [
  {
    id: 1,
    name: "Quận 1",
    region: "TP.HCM",
    risk: "medium",
    alerts: 12,
    rainfall: 38,
    wind: 22,
    lat: 10.7769, 
    lng: 106.7009,
  },
  {
    id: 2,
    name: "Quận 7",
    region: "TP.HCM",
    risk: "high",
    alerts: 21,
    rainfall: 62,
    wind: 28,
    lat: 10.7326,
    lng: 106.7091,
  },
  {
    id: 3,
    name: "Thủ Đức",
    region: "TP.HCM",
    risk: "low",
    alerts: 6,
    rainfall: 20,
    wind: 15,
    lat: 10.8491,
    lng: 106.7537,
  },
  {
    id: 4,
    name: "Huyện Củ Chi",
    region: "TP.HCM",
    risk: "medium",
    alerts: 9,
    rainfall: 44,
    wind: 18,
    lat: 11.0067,
    lng: 106.5134,
  },
  {
    id: 5,
    name: "Nhà Bè",
    region: "TP.HCM",
    risk: "high",
    alerts: 17,
    rainfall: 70,
    wind: 30,
    lat: 10.6559,
    lng: 106.7042,
  },
  {
    id: 6,
    name: "Quận 4",
    region: "TP.HCM",
    risk: "low",
    alerts: 4,
    rainfall: 15,
    wind: 10,
    lat: 10.7580,
    lng: 106.7067,
  },
  {
    id: 7,
    name: "Quận 3",
    region: "TP.HCM",
    risk: "medium",
    alerts: 10,
    rainfall: 35,
    wind: 20,
    lat: 10.7844,
    lng: 106.6844,
  },
  {
    id: 8,
    name: "Quận 5",
    region: "TP.HCM",
    risk: "medium",
    alerts: 8,
    rainfall: 30,
    wind: 15,
    lat: 10.7554,
    lng: 106.6652,
  },
  {
    id: 9,
    name: "Quận 10",
    region: "TP.HCM",
    risk: "low",
    alerts: 5,
    rainfall: 25,
    wind: 12,
    lat: 10.7749,
    lng: 106.6666,
  },
  {
    id: 10,
    name: "Quận Tân Bình",
    region: "TP.HCM",
    risk: "medium",
    alerts: 14,
    rainfall: 45,
    wind: 25,
    lat: 10.7938,
    lng: 106.6508,
  },
  {
    id: 11,
    name: "Quận Bình Thạnh",
    region: "TP.HCM",
    risk: "high",
    alerts: 19,
    rainfall: 55,
    wind: 28,
    lat: 10.8106,
    lng: 106.7091,
  },
  {
    id: 12,
    name: "Quận Phú Nhuận",
    region: "TP.HCM",
    risk: "low",
    alerts: 3,
    rainfall: 18,
    wind: 14,
    lat: 10.7997,
    lng: 106.6806,
  },
];

export const ALERT_TYPES = [
  { labelKey: "dashboard.alertType.rain", value: "rain", icon: Droplets, color: "text-[var(--color-primary)]" },
  { labelKey: "dashboard.alertType.flood", value: "flood", icon: Flame, color: "text-[var(--color-danger)]" },
  { labelKey: "dashboard.alertType.storm", value: "storm", icon: Wind, color: "text-[var(--color-info)]" },
];

export const PIE_CHART_DATA = [
  { labelKey: "dashboard.chart.rain", value: 45, color: "var(--color-primary)" },
  { labelKey: "dashboard.chart.flood", value: 30, color: "var(--color-warning)" },
  { labelKey: "dashboard.chart.storm", value: 15, color: "var(--color-info)" },
  { labelKey: "dashboard.chart.other", value: 10, color: "var(--color-text-muted)" },
];

export const LINE_CHART_POINTS = Array.from({ length: 12 }, (_, idx) => ({
  label: `T${idx + 1}`,
  value: 40 + Math.sin(idx / 3) * 15 + idx * 2,
}));

export const RESPONSE_TIMELINE = [
  { time: "00:05", title: "dispatch", icon: "Navigation", desc: "Units dispatched from Central Station" },
  { time: "00:15", title: "arrival", icon: "MapPin", desc: "Estimated arrival at key checkpoints" },
  { time: "00:45", title: "resolution", icon: "Clock", desc: "Projected situation control" }
];
