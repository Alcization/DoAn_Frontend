export interface AlertHistoryItem {
  id: number;
  type: "weather" | "traffic";
  title: string;
  message: string;
  timestamp: string;
  level: "info" | "warning" | "danger";
}

export const ALERT_HISTORY_MOCK: AlertHistoryItem[] = [
  {
    id: 1,
    type: "weather",
    title: "Heavy Rain Warning",
    message: "Heavy rain detected on your route to Work. Expect delays.",
    timestamp: "2024-03-16 08:30",
    level: "warning",
  },
  {
    id: 2,
    type: "traffic",
    title: "Traffic Congestion",
    message: "Heavy traffic on Highway 1. Estimated delay: 15 mins.",
    timestamp: "2024-03-16 07:45",
    level: "warning",
  },
  {
    id: 3,
    type: "weather",
    title: "Temperature Alert",
    message: "Temperature exceeded 35°C at Home.",
    timestamp: "2024-03-15 14:20",
    level: "info",
  },
];
