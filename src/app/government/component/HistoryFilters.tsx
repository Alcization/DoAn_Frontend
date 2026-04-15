"use client";

import { useTranslation } from "react-i18next";
import { Filter, Search, Download, List, Map, RotateCcw } from "lucide-react";
import { INCIDENTS } from "../../../context/services/mock/government/history-incidents";

interface HistoryFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  onReset: () => void;
  viewMode: "list" | "map";
  setViewMode: (mode: "list" | "map") => void;
}

export default function HistoryFilters({ filters, setFilters, onReset, viewMode, setViewMode }: HistoryFiltersProps) {
  const { t } = useTranslation();

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <Filter size={18} className="text-[var(--color-primary)]" />
          <h2 className="m-0 text-[var(--text-lg)] font-semibold">{t("alertHistory.filter.title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-[var(--text-sm)]">
          {/* Date Range */}
          <div className="flex flex-col gap-2 col-span-1 md:col-span-2 lg:col-span-2">
            <label className="font-semibold text-[var(--color-text-secondary)]">
              {t("alertHistory.filter.dateRange")}
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
                className="flex-1 w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]/50 focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text-primary)]"
              />
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
                className="flex-1 w-full min-w-0 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]/50 focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text-primary)]"
              />
            </div>
          </div>

          {/* Area */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--color-text-secondary)]">{t("alertHistory.filter.area")}</label>
            <select
              value={filters.area}
              onChange={(e) => handleFilterChange("area", e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]/50 focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text-primary)] appearance-none"
            >
              <option value="all">{t("alertHistory.filter.all")}</option>
              {[...new Set(INCIDENTS.map((incident) => incident.area))].map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--color-text-secondary)]">
              {t("alertHistory.filter.type")}
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]/50 focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text-primary)] appearance-none"
            >
              <option value="all">{t("alertHistory.filter.all")}</option>
              {["rain", "flood", "storm", "traffic"].map((type) => (
                  <option key={type} value={type}>{t(`alertHistory.type.${type}`)}</option>
              ))}
            </select>
          </div>
          
          {/* Severity */}
           <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--color-text-secondary)]">{t("alertHistory.filter.severity")}</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange("severity", e.target.value)}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3 bg-[var(--color-bg)]/50 focus:border-[var(--color-primary)] focus:outline-none text-[var(--color-text-primary)] appearance-none"
            >
              <option value="all">{t("alertHistory.filter.all")}</option>
              {["High", "Medium", "Low"].map((sev) => (
                  <option key={sev} value={sev}>{t(`alertHistory.severity.${sev}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all shadow-sm active:scale-95">
            <Search size={16} /> {t("alertHistory.actions.search")}
          </button>
          
          <button 
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl bg-(--color-bg-secondary) border border-(--color-border) px-6 py-3 text-sm font-semibold text-(--color-text-primary) hover:bg-(--color-border)/20 transition-all shadow-sm active:scale-95"
          >
            <RotateCcw size={16} /> {t("alertHistory.actions.reset")}
          </button>
        </div>
      </section>
  );
}
