"use client";

import { useState, useEffect } from "react";
import { Clock, Thermometer, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePagination } from "../hooks/usePagination";
import { API_BASE_URL } from "@/services/api-config";

export interface ApiWeatherHistoryItem {
  location_id: number;
  user_id: number;
  location: string;
  time: string;
  weather_status: string;
  temp: number;
}

const ITEMS_PER_PAGE = 10;

export default function WeatherSearchHistory() {
  const { t } = useTranslation();
  
  const [historyItems, setHistoryItems] = useState<ApiWeatherHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(historyItems, ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchWeatherHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để xem lịch sử.");
        }

        const response = await fetch(`${API_BASE_URL}/routes/weather-history`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Không thể tải lịch sử tìm kiếm thời tiết.");
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setHistoryItems(result.data);
        } else {
          setHistoryItems([]);
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherHistory();
  }, []);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="bg-(--color-surface) rounded-3xl shadow-(--shadow-sm) border border-(--color-border) p-8 text-center text-(--color-text-secondary) mt-2">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-(--color-surface) rounded-3xl shadow-(--shadow-sm) border border-(--color-border) p-8 text-center text-red-500 mt-2">
        {error}
      </div>
    );
  }

  if (historyItems.length === 0) {
    return (
      <div className="bg-(--color-surface) rounded-3xl shadow-(--shadow-sm) border border-(--color-border) p-8 text-center text-(--color-text-muted) mt-2">
        Bạn chưa có lịch sử tìm kiếm thời tiết nào.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      <div className="bg-(--color-surface) rounded-3xl shadow-(--shadow-sm) border border-(--color-border) overflow-hidden">
        <div className="divide-y divide-(--color-border)">
          {currentItems.map((item, index) => (
            <div key={`${item.location_id}-${index}`} className="p-5 flex items-center justify-between hover:bg-(--color-bg-secondary)/5 transition-colors group">
              <div className="flex gap-4 items-center min-w-0">
                <div className="w-12 h-12 rounded-xl bg-(--color-primary-bg) flex items-center justify-center shrink-0 border border-(--color-primary)/10 group-hover:scale-105 transition-transform">
                  <Thermometer size={24} className="text-(--color-primary)" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-(--color-text-primary) text-base truncate mb-1">
                    {item.location}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-(--color-text-secondary)">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDateTime(item.time)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-(--color-border)" />
                    <span className="font-medium text-(--color-primary)/80">{item.weather_status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right pl-4">
                <div className="text-2xl font-black text-(--color-primary) flex items-start">
                  {item.temp}
                  <span className="text-xs font-bold mt-1 ml-0.5">°C</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-2">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-bg) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  currentPage === page
                    ? "bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20"
                    : "text-(--color-text-secondary) hover:bg-(--color-bg)"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) hover:bg-(--color-bg) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}