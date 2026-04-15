import { useState, useCallback } from "react";

/**
 * ReportFiltersState defines the structure of the dashboard filters.
 */
export interface ReportFiltersState {
  selectedRoute: string;
  timeRange: string;
  customStartDate: string;
  customEndDate: string;
}

/**
 * useReportFilters hook (Mediator Pattern)
 * 
 * Acts as a centralized mediator for managing report filters state.
 * It encapsulates the state logic and provides a unified interface for 
 * both the filter component and the consumers (charts, KPI section).
 */
export const useReportFilters = (initialState?: Partial<ReportFiltersState>) => {
  const [filters, setFilters] = useState<ReportFiltersState>({
    selectedRoute: "all",
    timeRange: "7days",
    customStartDate: "",
    customEndDate: "",
    ...initialState,
  });

  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  /**
   * Updates a specific filter key.
   */
  const handleFilterChange = useCallback((key: keyof ReportFiltersState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Resets filters to default values.
   */
  const resetFilters = useCallback(() => {
    setFilters({
      selectedRoute: "all",
      timeRange: "7days",
      customStartDate: "",
      customEndDate: "",
    });
    setShowCustomDateRange(false);
  }, []);

  return {
    filters,
    handleFilterChange,
    resetFilters,
    showCustomDateRange,
    setShowCustomDateRange,
  };
};
