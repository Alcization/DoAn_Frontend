import { Priority, Scenario, ScenarioAction } from "../../../../context/services/mock/government/scenario-management";
import { ManagedArea } from "../../../../context/services/mock/government/area-management";

export interface ModalFormData {
  description: string;
  priority: Priority;
}

export interface ScenarioSelectionState {
  selectedScenarioId: number | null;
}

export type { Scenario, ScenarioAction, ManagedArea, Priority };

export type ScenarioFilters = {
    type: string | "all";
    status: string | "all";
    searchTerm: string;
};
