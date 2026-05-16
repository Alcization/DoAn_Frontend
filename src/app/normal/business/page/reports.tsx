"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import KPISection from "../component/KPISection";
import ReportFilters, { SavedRoute } from "../component/ReportFilters";
import { WeatherTrendChart, WeatherFrequencyChart } from "../component/ReportCharts";
import ReportSettings from "../component/ReportSettings";
import RiskAssessment from "../component/RiskAssessment";

import { useReportFilters } from "../../hooks/useReportFilters";

export default function BusinessReports() {
  const { t } = useTranslation();
  const printModeClass = "print-business-report";
  
  const {
    filters,
    handleFilterChange,
    showCustomDateRange,
    setShowCustomDateRange
  } = useReportFilters();

  const [routes, setRoutes] = useState<SavedRoute[]>([]);

  const activeRoute = useMemo(() => {
    if (!filters.selectedRoute || routes.length === 0) return null;
    return routes.find(r => r.route_id.toString() === filters.selectedRoute) || null;
  }, [filters.selectedRoute, routes]);

  const handleDownloadReport = () => {
    const body = document.body;
    let cleanedUp = false;

    const cleanupPrintMode = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      body.classList.remove(printModeClass);
      window.removeEventListener("afterprint", cleanupPrintMode);
    };

    body.classList.add(printModeClass);
    window.addEventListener("afterprint", cleanupPrintMode);
    window.print();

    // Fallback for browsers that do not reliably dispatch afterprint.
    setTimeout(cleanupPrintMode, 1000);
  };

  return (
    <div className="business-reports-page flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-(--color-bg) min-h-[calc(100vh-80px)]">
      
      {/* Page Header with Download Button */}
      <div className="report-no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-(--color-surface) p-4 sm:p-6 rounded-3xl shadow-(--shadow-sm) border border-(--color-border)">
        <div>
          <h1 className="text-(--text-2xl) font-bold text-(--color-text-primary) m-0">
            {t("reports.header.title")}
          </h1>
          <p className="text-(--text-sm) text-(--color-text-secondary) mt-1 m-0">
            {t("reports.header.subtitle")}
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-(--color-primary) hover:bg-(--color-primary-strong) text-white rounded-xl font-semibold transition-all shadow-(--shadow-md) hover:scale-105 active:scale-95 group"
        >
          <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
          <span>{t("reports.header.downloadFullReport")}</span>
        </button>
      </div>

      <section className="report-print-area flex flex-col gap-4 sm:gap-6">
        <KPISection timeRange={filters.timeRange} route={activeRoute} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <WeatherTrendChart 
              timeRange={filters.timeRange} 
              lat={activeRoute?.start_point.lat}
              lng={activeRoute?.start_point.lng}
          />
          <WeatherFrequencyChart 
              timeRange={filters.timeRange}
              lat={activeRoute?.start_point.lat}
              lng={activeRoute?.start_point.lng}
          />
        </div>
      </section>

      <div className="report-no-print">
        <ReportFilters 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          showCustomDateRange={showCustomDateRange} 
          setShowCustomDateRange={setShowCustomDateRange}
          onRoutesLoaded={setRoutes}
        />
      </div>

      <div className="report-no-print contents">
        <ReportSettings />

        <RiskAssessment />
      </div>
    </div>
  );
}