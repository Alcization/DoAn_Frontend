"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Calendar } from "lucide-react";

export default function WeekForecastList() {
  const { t, i18n } = useTranslation();
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "b390e7544c25cda818a5a37c072529d2";
  const LAT = 10.7626; 
  const LON = 106.6602;
  const CNT = 7; 

  // Hàm helper định dạng Tiếng Việt chuẩn xác
  const formatDayVietnamese = (date: Date, index: number) => {
    if (index === 0) return "Hôm nay";
    
    // Lấy tên thứ (ví dụ: thứ hai, chủ nhật)
    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'long' });
    
    // Viết hoa chữ cái đầu (thứ hai -> Thứ hai)
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  // Hàm helper lấy chuỗi DD/MM thủ công để tránh lỗi "Ngày" trống
  const formatDateManual = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}`;
  };

  useEffect(() => {
    const fetchDailyForecast = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${LAT}&lon=${LON}&cnt=${CNT}&appid=${API_KEY}&units=metric&lang=vi`
        );
        const data = await response.json();

        if (response.ok && data.list) {
          const formatted = data.list.map((day: any, index: number) => {
            const dateObj = new Date(day.dt * 1000);
            return {
              dayName: formatDayVietnamese(dateObj, index),
              dateString: formatDateManual(dateObj), // Sử dụng hàm manual mới
              high: Math.round(day.temp.max),
              low: Math.round(day.temp.min),
              rain: Math.round((day.pop || 0) * 100),
              icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
              desc: day.weather[0].description
            };
          });

          setForecastData(formatted);
        }
      } catch (error) {
        console.error("Lỗi fetch Daily Forecast API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyForecast();
  }, [API_KEY, i18n.language]);

  if (loading) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[24px] p-10 flex flex-col justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-[var(--color-primary)] mb-2" size={32} />
        <p className="text-[var(--color-text-muted)] text-sm italic">Đang cập nhật dự báo tuần...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface)] rounded-[24px] p-4 sm:p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
        <Calendar size={20} className="text-[var(--color-primary)]" />
        <h2 className="m-0 text-[var(--text-lg)] sm:text-[var(--text-xl)] text-[var(--color-text-primary)] font-bold">
          Dự báo 7 ngày tới
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {forecastData.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 sm:p-4 bg-[var(--color-bg)] hover:bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-transparent hover:border-[var(--color-primary)]/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-20 sm:w-24">
                <p className={`font-bold text-[var(--text-sm)] sm:text-[var(--text-base)] m-0 ${index === 0 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                  {day.dayName}
                </p>
                <p className="text-[11px] sm:text-[var(--text-xs)] text-[var(--color-text-muted)] m-0 font-medium">
                  {day.dateString}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <img src={day.icon} alt={day.desc} className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm" />
                <span className="hidden lg:block text-[var(--text-xs)] text-[var(--color-text-muted)] capitalize italic">
                  {day.desc}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex flex-col items-end min-w-[50px]">
                <span className={`text-[var(--text-xs)] sm:text-[var(--text-sm)] font-bold ${day.rain > 30 ? 'text-blue-500' : 'text-[var(--color-text-muted)]'}`}>
                  {day.rain}%
                </span>
                <span className="text-[9px] uppercase opacity-50 font-bold">Mưa</span>
              </div>
              
              <div className="flex items-center font-bold text-[var(--text-sm)] sm:text-[var(--text-base)] min-w-[90px] justify-end bg-[var(--color-surface)] px-3 py-1.5 rounded-full shadow-inner">
                <span className="text-[var(--color-danger)] w-8 text-right">
                  {day.high}°
                </span>
                <span className="text-[var(--color-text-muted)] mx-2 font-light opacity-20">|</span>
                <span className="text-[var(--color-primary)] w-8 text-left">
                  {day.low}°
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}