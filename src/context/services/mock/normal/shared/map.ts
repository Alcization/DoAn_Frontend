export const SAVED_ROUTES_MOCK = [
  { id: 1, from: "Q1, TP.HCM", to: "Q7, TP.HCM", time: "25 phút" },
  { id: 2, from: "Q3, TP.HCM", to: "Thủ Đức", time: "35 phút" },
];

export const MAP_LAYERS_MOCK = ["radar", "traffic", "uv", "temp"];

export const ROUTE_SEGMENTS_MOCK = [
  { km: "0-3", status: "safe", color: "green" },
  { km: "3-6", status: "safe", color: "green" },
  { km: "6-8", status: "warning", color: "yellow" },
  { km: "8-10", status: "danger", color: "red", alert: "heavyRain" },
  { km: "10-15", status: "warning", color: "yellow" },
];
