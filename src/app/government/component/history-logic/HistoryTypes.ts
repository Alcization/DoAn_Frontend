import { Incident, IncidentSeverity, IncidentStatus } from "../../../../context/services/mock/government/history-incidents";

export interface HistoryFilterOptions {
  from: string;
  to: string;
  area: string;
  type: string;
  severity: IncidentSeverity | "all";
}

export type ViewMode = "list" | "map";

export interface HistoryState {
  filters: HistoryFilterOptions;
  selectedIncident: Incident | null;
  viewMode: ViewMode;
}
