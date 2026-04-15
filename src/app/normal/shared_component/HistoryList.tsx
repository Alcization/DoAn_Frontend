"use client";

import { Clock, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { usePagination } from "../hooks/usePagination";
import { getTripHistory } from "@/context/services/api/personal/history";

export interface ApiHistoryItem {
  trip_id: number;
  user_id: number;
  origin: string;
  destination: string;
  time: string;
  weather_status: string;
}

const ITEMS_PER_PAGE = 10;

export default function HistoryList() {
  const { t } = useTranslation();
  
  const [historyItems, setHistoryItems] = useState<ApiHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination(historyItems, ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await getTripHistory();
        const items = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data)
            ? (result as any).data
            : [];

        setHistoryItems(items);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
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
      <div className="bg-[var(--color-surface)] rounded-[24px] shadow-[var(--shadow-md)] border border-[var(--color-border)] p-8 text-center text-[var(--color-text-secondary)]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface)] rounded-[24px] shadow-[var(--shadow-md)] border border-[var(--color-border)] p-8 text-center text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--color-surface)] rounded-[24px] shadow-[var(--shadow-md)] border border-[var(--color-border)] p-0 overflow-hidden">
        {currentItems.length > 0 ? (
          currentItems.map((item, idx) => (
            <div
              key={item.trip_id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3 ${
                idx !== 0 ? "border-t border-[var(--color-border)]" : ""
              } hover:bg-[var(--color-bg)] transition-colors`}
            >
              <div className="flex gap-3 items-center min-w-0 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[var(--radius-lg)] bg-[var(--color-primary-bg)] flex items-center justify-center flex-shrink-0">
                  <Navigation size={24} className="text-[var(--color-primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 font-semibold text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)] truncate title-route">
                    {item.origin} → {item.destination}
                  </p>
                  <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] m-0 mt-1 flex items-center gap-1">
                    <Clock size={14} /> {formatDateTime(item.time)}
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-left sm:w-40 flex-shrink-0">
                <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] m-0">
                  {t("normalHistory.weather.label")}
                </p>
                <p className="m-0 font-semibold text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)]">
                   {item.weather_status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-[var(--color-text-secondary)]">
            Bạn chưa có lịch sử tìm kiếm tuyến đường nào.
          </div>
        )}
      </div>

      {/* Cụm Phân Trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-2">
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}