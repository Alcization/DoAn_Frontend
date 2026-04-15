"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { ReportFiltersState } from "@/app/normal/hooks/useReportFilters";
import { API_BASE_URL } from "@/services/api-config";

export interface SavedRoute {
  route_id: number;
  user_id: number;
  name: string;
  start_point: { lat: number; lng: number };
  end_point: { lat: number; lng: number };
  start_address: string;
  end_address: string;
  distance: number;
  waypoints: { lat: number; lng: number }[];
}

interface ReportFiltersProps {
  filters: ReportFiltersState;
  handleFilterChange: (key: keyof ReportFiltersState, value: string) => void;
  showCustomDateRange: boolean;
  setShowCustomDateRange: (show: boolean) => void;
  onRoutesLoaded?: (routes: SavedRoute[]) => void;
}

export default function ReportFilters({
  filters,
  handleFilterChange,
  showCustomDateRange,
  setShowCustomDateRange,
  onRoutesLoaded,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Vui lòng đăng nhập để xem dữ liệu.");

        const response = await fetch(`${API_BASE_URL}/routes`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Không thể tải danh sách tuyến đường.");

        const result = await response.json();

        if (result.success && result.data) {
          setRoutes(result.data);
          if (onRoutesLoaded) onRoutesLoaded(result.data);
        } else {
          throw new Error(result.message || "Lỗi dữ liệu từ máy chủ.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải danh sách tuyến đường:", err);
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [onRoutesLoaded]);

  return (
    <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border)">
      <div className="flex items-center gap-2 mb-4 text-(--color-primary)">
        <Filter size={20} />
        <h2 className="m-0 text-(--text-lg) sm:text-(--text-xl) text-(--color-text-primary)">
          {t("businessReports.filters.title")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Route Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-(--text-sm) font-semibold text-(--color-text-secondary)">
            {t("businessReports.filters.route")}
          </label>
          <div className="relative">
            <select
              value={filters.selectedRoute}
              onChange={(e) => handleFilterChange("selectedRoute", e.target.value)}
              disabled={isLoading || !!error}
              className="w-full px-3.5 py-3 pr-10 rounded-xl border border-(--color-border) text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) hover:border-(--color-primary) transition-colors focus:outline-none appearance-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <option value="">Đang tải tuyến đường...</option>
              ) : error ? (
                <option value="">Lỗi: Không tải được dữ liệu</option>
              ) : (
                <>                
                  <option value="">Chọn tuyến đường</option>
                  {routes.map((route) => (
                    <option key={route.route_id} value={route.route_id.toString()}>
                      {route.name}: {route.start_address} → {route.end_address}
                    </option>
                  ))}
                </>
              )}
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"
            />
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>

        {/* Time Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-(--text-sm) font-semibold text-(--color-text-secondary)">
            {t("businessReports.filters.time")}
          </label>
          <div className="relative">
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange("timeRange", e.target.value)}
              className="w-full px-3.5 py-3 pr-10 rounded-xl border border-(--color-border) text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) hover:border-(--color-primary) transition-colors focus:outline-none appearance-none"
            >
              <option value="24h">24h</option>
              <option value="7days">7 Days</option>
            </select>
            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}