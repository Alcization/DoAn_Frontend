"use client";

import { Navigation, Loader2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function HourlyForecast() {
  const { t } = useTranslation();
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cấu hình API Pro
  const API_KEY = "b390e7544c25cda818a5a37c072529d2";
  const LAT = 10.7626;
  const LON = 106.6602;

  useEffect(() => {
    const fetchProHourlyForecast = async () => {
      try {
        setLoading(true);
        // Sử dụng endpoint forecast/hourly (Pro) trả về dữ liệu chuẩn xác mỗi 1 giờ
        const response = await fetch(
          `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=vi`
        );
        const data = await response.json();

        if (response.ok && data.list) {
          // Lấy đúng 24 bản ghi đầu tiên (tương ứng 24 giờ tới)
          const next24h = data.list.slice(0, 24).map((item: any) => {
            const date = new Date(item.dt * 1000);
            return {
              id: item.dt,
              time: `${date.getHours()}:00`,
              temp: Math.round(item.main.temp),
              icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
              rain: Math.round((item.pop || 0) * 100),
              rainVolume: item.rain ? item.rain["1h"] || 0 : 0
            };
          });
          setForecastData(next24h);
        }
      } catch (error) {
        console.error("Lỗi fetch Pro Hourly API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProHourlyForecast();
  }, [API_KEY]);

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[24px] p-6 flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-[var(--color-primary)]" />
          <h2 className="m-0 text-[var(--text-lg)] sm:text-[var(--text-xl)] text-[var(--color-text-primary)] font-bold">
            Dự báo 24 giờ tới
          </h2>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {forecastData.map((item) => (
          <div
            key={item.id}
            className="min-w-[70px] sm:min-w-[85px] bg-[var(--color-bg)] rounded-[var(--radius-xl)] p-3 text-center flex-shrink-0 border border-transparent hover:border-[var(--color-primary)]/20 transition-all shadow-sm"
          >
            <div className="text-[var(--color-text-muted)] text-[11px] font-bold mb-2 uppercase">
              {item.time}
            </div>
            <div className="flex justify-center mb-2">
              <img src={item.icon} alt="weather icon" className="w-10 h-10 object-contain drop-shadow-sm" />
            </div>
            <div className="font-extrabold text-[var(--text-base)] text-[var(--color-text-primary)] mb-2">
              {item.temp}°
            </div>
            
            <div className="flex flex-col items-center gap-0.5">
              <span className={`text-[10px] font-bold ${item.rain > 20 ? 'text-blue-500' : 'text-gray-400 opacity-60'}`}>
                💧 {item.rain}%
              </span>
              {item.rainVolume > 0 && (
                <span className="text-[9px] text-blue-600 font-medium">
                  {item.rainVolume.toFixed(1)}mm
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}