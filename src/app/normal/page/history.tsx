"use client";

import { useTranslation } from "react-i18next";
import HistoryFilterBar from "../shared_component/HistoryFilterBar";
import HistoryList from "../shared_component/HistoryList";
import WeatherSearchHistory from "../shared_component/WeatherSearchHistory";
import { useHistoryFilters } from "../hooks/useHistoryFilters";

export default function NormalHistory() {
  const {
    typeFilter,
    setTypeFilter,
    dateFilter,
    setDateFilter,
  } = useHistoryFilters();
  const { t } = useTranslation();

  const showRouteSection = typeFilter === "all" || typeFilter === "route";
  const showLocationSection = typeFilter === "all" || typeFilter === "location";

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-(--color-bg) min-h-[calc(100vh-80px)]">

      <HistoryFilterBar 
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      <div className="space-y-6">
        {showRouteSection && (
          <section>
            <h2 className="text-(--text-lg) font-bold text-(--color-text-primary) mb-3 px-1">
              {t("normalHistory.recentHistory")}
            </h2>
            <HistoryList dateFilter={dateFilter} />
          </section>
        )}

        {showLocationSection && (
          <section>
            <h2 className="text-(--text-lg) font-bold text-(--color-text-primary) mb-3 px-1">
              {t("normalHistory.weatherSearchTitle")}
            </h2>
            <WeatherSearchHistory dateFilter={dateFilter} />
          </section>
        )}
      </div>
    </div>
  );
}
