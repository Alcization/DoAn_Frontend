import { useState, useMemo, useCallback, useEffect } from "react";
import { SCENARIOS as MOCK_SCENARIOS } from "../../../context/services/mock/government/scenario-management";
import { FilterOptions, ScenarioTableState, Scenario } from "../component/scenario-logic/ScenarioTypes";
import {
  createGovernmentResponseScenario,
  deleteGovernmentResponseScenario,
  getGovernmentResponseScenarios,
  mapResponseScenarioToScenario,
  toCreateResponseScenarioPayload,
  toUpdateResponseScenarioPayload,
  updateGovernmentResponseScenario,
} from "../../../context/services/api/government/scenario-management";

/**
 * [FACADE PATTERN] - useScenarioManagement: Orchestrates scenario state, filtering, and modal logic.
 * Adheres to SRP by centralizing business logic for the scenario management feature.
 */
export function useScenarioManagement() {
  const [state, setState] = useState<ScenarioTableState>({
    scenarios: MOCK_SCENARIOS,
    selectedScenarioId: MOCK_SCENARIOS[0]?.id || null,
    isEditModalOpen: false,
    isDeleteModalOpen: false,
    modalScenario: null,
    filters: {
      type: "all",
      status: "all",
      searchTerm: "",
    },
  });

  const filteredScenarios = useMemo(() => {
    return state.scenarios.filter(scenario => {
      const matchesSearch = scenario.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) || 
                           scenario.description.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
      const matchesType = state.filters.type === "all" || scenario.type === state.filters.type;
      const matchesStatus = state.filters.status === "all" || scenario.status === state.filters.status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [state.scenarios, state.filters]);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const apiScenarios = await getGovernmentResponseScenarios();
        setState((prev) => ({
          ...prev,
          scenarios: apiScenarios,
          selectedScenarioId: apiScenarios[0]?.id || null,
        }));
      } catch (error) {
        console.error("Failed to load response scenarios:", error);
      }
    };

    void loadScenarios();
  }, []);

  const setFilters = useCallback((filters: FilterOptions) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const handleSelect = useCallback((scenario: Scenario) => {
    setState(prev => ({ ...prev, selectedScenarioId: scenario.id }));
  }, []);

  const handleAdd = useCallback(() => {
    setState(prev => ({ ...prev, modalScenario: null, isEditModalOpen: true }));
  }, []);

  const handleEdit = useCallback((scenario: Scenario) => {
    setState(prev => ({ ...prev, modalScenario: scenario, isEditModalOpen: true }));
  }, []);

  const handleDeleteTrigger = useCallback((scenario: Scenario) => {
    setState(prev => ({ ...prev, modalScenario: scenario, isDeleteModalOpen: true }));
  }, []);

  const onSaveScenario = useCallback(async (updatedScenario: Scenario) => {
    const isNew = !state.modalScenario;

    if (isNew) {
      try {
        const payload = toCreateResponseScenarioPayload(updatedScenario);
        const response = await createGovernmentResponseScenario(payload);
        const createdScenario = mapResponseScenarioToScenario(response.data);

        setState(prev => ({
          ...prev,
          scenarios: [...prev.scenarios, createdScenario],
          selectedScenarioId: createdScenario.id,
          isEditModalOpen: false,
          modalScenario: null,
        }));
      } catch (error) {
        console.error("Failed to create scenario:", error);
      }
      return;
    }

    try {
      const payload = toUpdateResponseScenarioPayload(updatedScenario);
      const response = await updateGovernmentResponseScenario(updatedScenario.id, payload);
      const savedScenario = mapResponseScenarioToScenario(response.data);

      setState(prev => ({
        ...prev,
        scenarios: prev.scenarios.map(s => s.id === savedScenario.id ? savedScenario : s),
        selectedScenarioId: savedScenario.id,
        isEditModalOpen: false,
        modalScenario: null,
      }));
    } catch (error) {
      console.error("Failed to update scenario:", error);
    }
  }, [state.modalScenario]);

  const onDeleteScenario = useCallback(async (scenarioToDelete: Scenario) => {
    try {
      await deleteGovernmentResponseScenario(scenarioToDelete.id);

      setState(prev => ({
        ...prev,
        scenarios: prev.scenarios.filter(s => s.id !== scenarioToDelete.id),
        selectedScenarioId: prev.selectedScenarioId === scenarioToDelete.id ? null : prev.selectedScenarioId,
        isDeleteModalOpen: false,
        modalScenario: null,
      }));
    } catch (error) {
      console.error("Failed to delete scenario:", error);
    }
  }, []);

  const closeEditModal = useCallback(() => {
    setState(prev => ({ ...prev, isEditModalOpen: false }));
  }, []);

  const closeDeleteModal = useCallback(() => {
    setState(prev => ({ ...prev, isDeleteModalOpen: false }));
  }, []);

  return {
    ...state,
    filteredScenarios,
    setFilters,
    handleSelect,
    handleAdd,
    handleEdit,
    handleDeleteTrigger,
    onSaveScenario,
    onDeleteScenario,
    closeEditModal,
    closeDeleteModal,
  };
}
