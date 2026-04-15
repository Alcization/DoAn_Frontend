import React from "react";
import { Download } from "lucide-react";
import { ReportHistoryItem } from "./ReportTypes";
import { STATUS_STYLE_STRATEGY } from "./ReportStrategies";

/**
 * [FACTORY METHOD PATTERN] - ReportItemFactory: Encapsulates report history item rendering.
 */
export class ReportItemFactory {
  static createHistoryItem(
    report: ReportHistoryItem,
    t: any
  ) {
    const statusClass = STATUS_STYLE_STRATEGY[report.status] || "";

    return (
      <div
        key={report.id}
        className="rounded-md border border-(--color-border) p-4 flex items-center justify-between gap-3 bg-(--color-surface) hover:bg-(--color-bg) transition-colors"
      >
        <div>
          <p className="text-(--text-sm) font-semibold m-0">
            {t(`reports.type.${report.typeKey}`)}
          </p>
          <p className="text-(--text-xs) m-0 mt-1">
            {t("reports.history.sentDate")}: {report.date}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-(--text-xxs) font-semibold ${statusClass}`}>
            {t(`reports.history.status.${report.status}`)}
          </span>
          <button className="rounded-sm border border-(--color-border) p-2 text-(--color-text-secondary) hover:border-(--color-primary-soft) hover:text-(--color-primary) transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>
    );
  }
}
