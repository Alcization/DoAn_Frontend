import { useState, useCallback } from "react";
import { ScenarioFilters } from "../component/modal-logic/ModalTypes";

/**
 * [FACADE PATTERN] - useScenarioFilters: Encapsulates scenario filtering logic.
 */
export function useScenarioFilters(onApply?: (filters: ScenarioFilters) => void) {
  const [filters, setFilters] = useState<ScenarioFilters>({
    type: "all",
    status: "all",
    searchTerm: "",
  });

  const handleUpdate = useCallback((field: keyof ScenarioFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters({
      type: "all",
      status: "all",
      searchTerm: "",
    });
  }, []);

  const handleApply = useCallback(() => {
    if (onApply) {
      onApply(filters);
    }
  }, [filters, onApply]);

  return {
    filters,
    handleUpdate,
    handleReset,
    handleApply
  };
}
