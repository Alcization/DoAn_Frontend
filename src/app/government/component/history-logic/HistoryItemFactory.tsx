import { Clock } from "lucide-react";
import { Incident } from "../../../../context/services/mock/government/history-incidents";
import { SEVERITY_STRATEGY, STATUS_STRATEGY } from "./HistoryStrategies";

/**
 * [FACTORY METHOD PATTERN] - HistoryItemFactory: Encapsulates incident item rendering.
 */
export class HistoryItemFactory {
  static createItem(
    incident: Incident,
    selectedId: number | null,
    onSelect: (incident: Incident) => void,
    t: any
  ) {
    const isSelected = selectedId === incident.id;
    const severityStyle = SEVERITY_STRATEGY[incident.severity];
    const statusStyle = STATUS_STRATEGY[incident.status];

    return (
      <button
        key={incident.id}
        onClick={() => onSelect(incident)}
        className={`w-full px-6 py-4 text-left hover:bg-(--color-bg) transition-colors ${
          isSelected ? "bg-(--color-bg-secondary)" : ""
        }`}
      >
        <div className="flex items-center justify-between text-(--text-xs)">
          <span className="inline-flex items-center gap-1 text-(--color-text-muted)">
            <Clock size={12} /> {incident.time}
          </span>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${severityStyle.className}`}
          >
            {t(`alertHistory.severity.${incident.severity}`)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-(--text-base) font-semibold m-0">{incident.location}</p>
            <p className="text-(--text-xs) m-0 mt-1">
              {t("alertHistory.detail.area")}: {incident.area} · {t("alertHistory.detail.type")}:{" "}
              {t(`alertHistory.type.${incident.type}`)}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${statusStyle.className}`}
          >
            {t(`alertHistory.status.${incident.status}`)}
          </span>
        </div>
        <p className="mt-3 text-(--color-text-secondary) line-clamp-2">
          {incident.description}
        </p>
      </button>
    );
  }
}
