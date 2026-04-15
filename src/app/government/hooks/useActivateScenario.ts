import { useState, useMemo, useCallback, useEffect } from "react";
import { Incident } from "../../../context/services/mock/government/history-incidents";
import { Scenario } from "../../../context/services/mock/government/scenario-management";
import { getGovernmentResponseScenarios } from "../../../context/services/api/government/scenario-management";
import { updateAlertEventScenario } from "../../../context/services/api/government/history-incidents";

/**
 * [FACADE PATTERN] - useActivateScenario: Manages state and logic for scenario activation.
 * Fetches scenarios from real API using getGovernmentResponseScenarios
 */
export function useActivateScenario(incident: Incident | null, onActivate: (scenario: Scenario) => void, onClose: () => void) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch scenarios from API
  useEffect(() => {
    const fetchScenarios = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getGovernmentResponseScenarios();
        setScenarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching scenarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  const { matchingScenarios, otherScenarios } = useMemo(() => {
    if (!incident) return { matchingScenarios: [], otherScenarios: [] };
    
    return {
      matchingScenarios: scenarios.filter(s => s.type === incident.type),
      otherScenarios: scenarios.filter(s => s.type !== incident.type)
    };
  }, [incident, scenarios]);

  const handleActivate = useCallback(() => {
    const scenario = scenarios.find(s => s.id === selectedScenarioId);
    if (scenario && incident) {
      // Call API to update alert event with the selected scenario
      const updatePromise = updateAlertEventScenario(incident.id, scenario.id);
      
      // Still trigger the UI update regardless of API success
      onActivate(scenario);
      onClose();
      
      // Log any API errors but don't block UI
      updatePromise.catch(err => {
        console.error("Failed to update alert event scenario:", err);
      });
    }
  }, [selectedScenarioId, scenarios, incident, onActivate, onClose]);

  const selectScenario = useCallback((id: number) => {
    setSelectedScenarioId(id);
  }, []);

  return {
    selectedScenarioId,
    matchingScenarios,
    otherScenarios,
    handleActivate,
    selectScenario,
    loading,
    error
  };
}
