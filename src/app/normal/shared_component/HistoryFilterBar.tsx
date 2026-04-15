"use client";

import { useTranslation } from "react-i18next";

interface HistoryFilterBarProps {
  typeFilter: string;
  onTypeChange: (type: string) => void;
  dateFilter: string;
  onDateChange: (date: string) => void;
}

export default function HistoryFilterBar({
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
}: HistoryFilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-(--color-surface) rounded-3xl p-5 shadow-(--shadow-sm) border border-(--color-border)">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <select 
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-(--color-border) px-4 py-3 text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:border-(--color-primary) transition-colors cursor-pointer"
          >
            <option value="all">{t("normalHistory.filters.all")}</option>
            <option value="route">{t("normalHistory.filters.route")}</option>
            <option value="location">{t("normalHistory.filters.location")}</option>
          </select>
        </div>
        
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full rounded-md border border-(--color-border) px-4 py-3 text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:border-(--color-primary) transition-colors cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
