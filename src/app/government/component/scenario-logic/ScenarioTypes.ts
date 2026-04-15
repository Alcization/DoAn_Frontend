import { 
  ScenarioType, 
  ScenarioStatus, 
  Scenario 
} from "../../../../context/services/mock/government/scenario-management";

export type { Scenario };

export interface FilterOptions {
  type: ScenarioType | "all";
  status: ScenarioStatus | "all";
  searchTerm: string;
}

export interface ScenarioTableState {
  scenarios: Scenario[];
  selectedScenarioId: number | null;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  modalScenario: Scenario | null;
  filters: FilterOptions;
}
