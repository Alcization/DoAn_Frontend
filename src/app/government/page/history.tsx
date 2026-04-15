"use client";

import React from "react";
import AdminNav from "../component/AdminNav";
import HistoryFilters from "../component/HistoryFilters";
import HistoryList from "../component/HistoryList";
import HistoryDetail from "../component/HistoryDetail";
import { useHistoryManagement } from "../hooks/useHistoryManagement";

/**
 * [FACADE PATTERN] - AdminHistory: Orchestrates the history management view.
 * Adheres to SOLID by delegating all business logic to the useHistoryManagement hook.
 */
export default function AdminHistory() {
  const {
    filters,
    setFilters,
    selectedIncident,
    setSelectedIncident,
    viewMode,
    setViewMode,
    filteredIncidents,
    resetFilters,
    loading,
    error,
  } = useHistoryManagement();

  return (
    <div className="flex flex-col gap-4 sm:gap-6 h-[calc(100vh-80px)] overflow-y-auto pr-2 pb-10">
      <AdminNav />

      {error && (
        <div className="mx-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <p className="font-semibold">Error loading alerts</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <HistoryFilters 
        filters={filters} 
        setFilters={setFilters}
        onReset={resetFilters}
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.4fr] gap-4 lg:h-[700px]">
        <HistoryList 
          loading={loading}
          incidents={filteredIncidents} 
          selectedId={selectedIncident?.id || null} 
          onSelect={setSelectedIncident}
          viewMode={viewMode}
        />
        <HistoryDetail incident={selectedIncident} />
      </section>
    </div>
  );
}
