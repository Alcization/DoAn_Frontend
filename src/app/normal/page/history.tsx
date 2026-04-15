"use client";

import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { HISTORY_ITEMS, WEATHER_SEARCH_HISTORY } from "../../../context/services/mock/normal/shared/history";
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
    filteredHistoryItems,
    filteredWeatherHistory,
  } = useHistoryFilters();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-(--color-bg) min-h-[calc(100vh-80px)]">

      <HistoryFilterBar 
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      <div className="space-y-6">
        <section>
          <h2 className="text-(--text-lg) font-bold text-(--color-text-primary) mb-3 px-1">
            {t("normalHistory.recentHistory")}
          </h2>
          {/* <HistoryList items={filteredHistoryItems} /> */}
          <HistoryList/>
        </section>

        <section>
          <h2 className="text-(--text-lg) font-bold text-(--color-text-primary) mb-3 px-1">
            {t("normalHistory.weatherSearchTitle")}
          </h2>
          {/* <WeatherSearchHistory items={filteredWeatherHistory} /> */}
          <WeatherSearchHistory/>
        </section>
      </div>
    </div>
  );
}
