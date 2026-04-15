export const FAVORITE_LOCATIONS = [
  { id: 1, name: "Nhà riêng", address: "Q1, TP.HCM" },
  { id: 2, name: "Văn phòng", address: "Q3, TP.HCM" },
  { id: 3, name: "Sân bay TSN", address: "TP.HCM" },
];

export const WEATHER_TIMELINE = [
  { time: "06:00", temp: 28, icon: "🌤️", uv: 3, rain: 0, rainIntensity: 0 },
  { time: "09:00", temp: 30, icon: "☀️", uv: 7, rain: 0, rainIntensity: 0 },
  { time: "12:00", temp: 32, icon: "☀️", uv: 10, rain: 0, rainIntensity: 0 },
  { time: "15:00", temp: 31, icon: "⛅", uv: 8, rain: 10, rainIntensity: 2 },
  { time: "18:00", temp: 29, icon: "🌧️", uv: 2, rain: 80, rainIntensity: 5 },
  { time: "21:00", temp: 27, icon: "☁️", uv: 0, rain: 40, rainIntensity: 3 },
];

// Dữ liệu dự báo 24 giờ
export const HOURLY_24_FORECAST = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  time: `${i.toString().padStart(2, "0")}:00`,
  temp: 28 + Math.floor(Math.sin(((i - 6) / 24) * Math.PI * 2) * 4),
  rain: i >= 15 && i <= 19 ? Math.floor(Math.random() * 100) : 0,
  rainIntensity: i >= 15 && i <= 19 ? Math.floor(Math.random() * 5) + 1 : 0,
  icon: i >= 6 && i <= 18 ? "☀️" : "🌙",
}));

export const WEEK_FORECAST = [
  { day: "T2", date: "25/11", high: 32, low: 26, icon: "🌧️", rain: 80 },
  { day: "T3", date: "26/11", high: 33, low: 27, icon: "⛅", rain: 40 },
  { day: "T4", date: "27/11", high: 34, low: 28, icon: "☀️", rain: 10 },
  { day: "T5", date: "28/11", high: 33, low: 27, icon: "🌤️", rain: 30 },
  { day: "T6", date: "29/11", high: 32, low: 26, icon: "🌧️", rain: 70 },
  { day: "T7", date: "30/11", high: 31, low: 25, icon: "⛈️", rain: 90 },
  { day: "CN", date: "01/12", high: 30, low: 25, icon: "🌧️", rain: 60 },
];
