export interface HistoryItem {
  id: number;
  type: "route" | "location";
  from?: string; // For route
  to?: string;   // For route
  name?: string; // For location
  date: string;
  weatherKey: string; // Key for translation
}

export interface WeatherSearchItem {
  id: number;
  location: string;
  date: string;
  temp: number;
  condition: string;
}

export const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 1,
    type: "route",
    from: "Q1",
    to: "Q7",
    date: "24/11 14:30",
    weatherKey: "rain_light",
  },
  {
    id: 2,
    type: "location",
    name: "Sân bay TSN",
    date: "23/11 09:15",
    weatherKey: "sunny",
  },
  {
    id: 3,
    type: "route",
    from: "Q3",
    to: "Thủ Đức",
    date: "22/11 18:00",
    weatherKey: "cloudy",
  },
];

export const WEATHER_SEARCH_HISTORY: WeatherSearchItem[] = [
  {
    id: 1,
    location: "Quận 1, TP. Hồ Chí Minh",
    date: "Hôm nay, 18:45",
    temp: 32,
    condition: "Trời nắng",
  },
  {
    id: 2,
    location: "Quận 7, TP. Hồ Chí Minh",
    date: "Hôm nay, 17:30",
    temp: 30,
    condition: "Nhiều mây",
  },
  {
    id: 3,
    location: "Sân bay Tân Sơn Nhất",
    date: "Hôm nay, 16:15",
    temp: 33,
    condition: "Trời nắng",
  },
  {
    id: 4,
    location: "Thủ Đức, TP. Hồ Chí Minh",
    date: "Hôm qua, 21:00",
    temp: 28,
    condition: "Mưa nhẹ",
  },
];
