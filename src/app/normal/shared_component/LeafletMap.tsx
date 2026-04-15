"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/services/api-config";

// Fix for default marker icons in Next.js/Webpack
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Hàm tạo màu nền dải nhiệt độ
const getTempColor = (temp: number) => {
  if (temp < 27) return "#3b82f6"; // Xanh dương
  if (temp < 28) return "#10b981"; // Xanh ngọc
  if (temp < 29) return "#f59e0b"; // Vàng
  return "#ef4444"; // Đỏ
};

// Hàm tạo Custom Icon hiển thị trực tiếp nhiệt độ
const createTempIcon = (temp: number) => {
  const bgColor = getTempColor(temp);
  
  return L.divIcon({
    className: "custom-temp-marker bg-transparent border-none",
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 12px;
        white-space: nowrap;
        text-align: center;
        display: inline-block;
      ">
        ${temp.toFixed(1)}°C
      </div>
    `,
    iconSize: [50, 24],
    iconAnchor: [25, 12],
  });
};

function MapInitializer() {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate size to ensure proper rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  
  return null;
}

export default function LeafletMap() {
  const position: [number, number] = [10.762622, 106.660172]; // HCM City center approx
  
  // States quản lý dữ liệu API
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);

  // Gọi API lấy dữ liệu thời tiết
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoadingWeather(true);
        const response = await fetch(`${API_BASE_URL}/map/weather-areas`);
        
        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu thời tiết");
        }
        
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Fetch weather data failed:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeatherData();
  }, []); // [] đảm bảo chỉ gọi 1 lần khi component mount

  // Mock route from Q1 (Notre Dame Cathedral) to Q7 (Crescent Mall approx)
  const routePoints: [number, number][] = [
    [10.7796, 106.6996], // Q1
    [10.7750, 106.7020],
    [10.7650, 106.7050],
    [10.7500, 106.7100],
    [10.7300, 106.7150]  // Q7
  ];
  
  // Route segments with colors matching the mockup logic
  const segment1: [number, number][] = routePoints.slice(0, 3); // Green
  const segment2: [number, number][] = routePoints.slice(2, 4); // Yellow
  const segment3: [number, number][] = routePoints.slice(3, 5); // Red

  return (
    <div className="relative w-full h-full">
      {/* Hiển thị thông báo đang tải dữ liệu (tuỳ chọn, overlay góc trái) */}
      {isLoadingWeather && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Đang tải dữ liệu thời tiết ...
        </div>
      )}

      <MapContainer 
        center={position} 
        zoom={11} 
        style={{ height: "100%", width: "100%", background: 'transparent' }}
        scrollWheelZoom={true}
      >
        <MapInitializer />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Các marker của lộ trình */}
        <Marker position={routePoints[0]}>
          <Popup>Điểm đi (A): Quận 1</Popup>
        </Marker>
        <Marker position={routePoints[routePoints.length - 1]}>
          <Popup>Điểm đến (B): Quận 7</Popup>
        </Marker>
        
        {/* Visualizing Traffic/Weather status Segments */}
        <Polyline positions={segment1} color="green" weight={6} opacity={0.8}>
           <Tooltip sticky>Km 0-3: Thông thoáng</Tooltip>
        </Polyline>
        <Polyline positions={segment2} color="yellow" weight={6} opacity={0.8}>
           <Tooltip sticky>Km 3-4: Chậm</Tooltip>
        </Polyline>
        <Polyline positions={segment3} color="red" weight={6} opacity={0.8}>
           <Tooltip sticky>Km 4-5: Tắc nghẽn / Mưa lớn</Tooltip>
        </Polyline>

        {/* LỚP HIỂN THỊ NHIỆT ĐỘ (chỉ render khi có dữ liệu) */}
        {!isLoadingWeather && weatherData.map((cell) => {
          // Bỏ qua nếu dữ liệu center_point hoặc weather bị null (đề phòng API trả về thiếu)
          if (!cell.center_point || !cell.weather) return null;

          const lat = cell.center_point.coordinates[0];
          const lng = cell.center_point.coordinates[1];
          const { temp, feelslike, humidity, windspeed, conditions } = cell.weather;

          return (
            <Marker
              key={cell.area_id}
              position={[lat, lng]}
              icon={createTempIcon(temp)}
            >
              <Popup className="weather-popup">
                <div className="p-1 min-w-[150px]">
                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Nhiệt độ:</span>
                      <span className="font-bold text-black">{temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cảm giác:</span>
                      <span className="font-bold text-black">{feelslike}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Độ ẩm:</span>
                      <span className="font-bold text-black">{humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gió:</span>
                      <span className="font-bold text-black">{windspeed} m/s</span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t">
                      <span>Trạng thái:</span>
                      <span className="font-bold text-black capitalize">{conditions}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}