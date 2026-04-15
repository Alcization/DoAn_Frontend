"use client";

import KPIStats from "../component/KPIStats";
import DashboardFilters from "../component/DashboardFilters";
import HeatmapView from "../component/heatmap/HeatmapView";
import ChartsView from "../component/ChartsView";
import { useDashboard } from "../hooks/useDashboard";

const AdminDashboard = () => {
  const {
    viewMode,
    filters,
    setFilters,
    selectedArea,
    setSelectedArea,
    filteredHeatmapData,
    totalAlerts,
    originalHeatmapData,
  } = useDashboard();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 bg-(--color-bg)">
      <KPIStats totalAlerts={totalAlerts} areas={filteredHeatmapData} />

      <DashboardFilters filters={filters} areas={originalHeatmapData} setFilters={setFilters} />

      {viewMode === "map" ? ( 
        <HeatmapView
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          heatmapData={filteredHeatmapData}
        />
      ) : (
        <ChartsView totalAlerts={totalAlerts} heatmapData={filteredHeatmapData} />
      )}
    </div>
  );
};

export default AdminDashboard;
