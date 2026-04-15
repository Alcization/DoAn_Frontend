import { useState, useMemo, useCallback, useEffect } from "react";
import { INCIDENTS, Incident } from "../../../context/services/mock/government/history-incidents";
import { HistoryFilterOptions, ViewMode, HistoryState } from "../component/history-logic/HistoryTypes";
import { getGovernmentIncidentHistory } from "../../../context/services/api/government/history-incidents";

const DEFAULT_FILTERS: HistoryFilterOptions = {
  from: "",
  to: "",
  area: "all",
  type: "all",
  severity: "all",
};

/**
 * [FACADE / MEDIATOR PATTERN] - useHistoryManagement: Manages history state and logic.
 * Adheres to SRP by centralizing business logic for the history module.
 */
export function useHistoryManagement() {
  const [state, setState] = useState<HistoryState>({
    filters: DEFAULT_FILTERS,
    selectedIncident: INCIDENTS[0] || null,
    viewMode: "list",
  });
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch incidents from API on mount
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGovernmentIncidentHistory();
        setIncidents(data);
        setState((prev) => ({
          ...prev,
          selectedIncident: data[0] || null,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Failed to fetch incidents:", err);
        // Keep using mock data if API fails
        setIncidents(INCIDENTS);
      } finally {
        setLoading(false);
      }
    };

    void fetchIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesArea = state.filters.area === "all" || incident.area === state.filters.area;
      const matchesType = state.filters.type === "all" || incident.type === state.filters.type;
      const matchesSeverity = state.filters.severity === "all" || incident.severity === state.filters.severity;
      
      // Date Filtering
      const incidentDate = incident.time.split(" ")[0]; // Get YYYY-MM-DD
      const matchesFrom = !state.filters.from || incidentDate >= state.filters.from;
      const matchesTo = !state.filters.to || incidentDate <= state.filters.to;

      return matchesArea && matchesType && matchesSeverity && matchesFrom && matchesTo;
    });
  }, [incidents, state.filters]);

  const setFilters = useCallback((update: any) => {
    setState((prev) => {
      const nextFilters = typeof update === "function" ? update(prev.filters) : update;
      return { ...prev, filters: nextFilters };
    });
  }, []);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const setSelectedIncident = useCallback((incident: Incident | null) => {
    setState((prev) => ({ ...prev, selectedIncident: incident }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: DEFAULT_FILTERS }));
  }, []);

  return {
    ...state,
    filteredIncidents,
    incidents,
    loading,
    error,
    setFilters,
    resetFilters,
    setViewMode,
    setSelectedIncident,
  };
}
