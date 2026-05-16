import React from "react";
import { Download } from "lucide-react";
import { ReportHistoryItem } from "./ReportTypes";
import { STATUS_STYLE_STRATEGY } from "./ReportStrategies";

/**
 * [FACTORY METHOD PATTERN] - ReportItemFactory: Encapsulates report history item rendering.
 */
export class ReportItemFactory {
  private static resolveDownloadUrl(link: string) {
    const driveMatch = link.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch?.[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }

    return link;
  }

  private static triggerDownload(link: string, fileName: string) {
    const resolvedUrl = this.resolveDownloadUrl(link);
    const anchor = document.createElement("a");
    anchor.href = resolvedUrl;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  static createHistoryItem(
    report: ReportHistoryItem,
    t: (key: string) => string
  ) {
    const statusClass = STATUS_STYLE_STRATEGY.sent || "";
    const safeFileName = `${report.name || "report"}.pdf`.replace(/[^a-zA-Z0-9._-]+/g, "_");

    return (
      <div
        key={report.id}
        className="rounded-md border border-(--color-border) p-4 flex items-center justify-between gap-3 bg-(--color-surface) hover:bg-(--color-bg) transition-colors"
      >
        <div>
          <p className="text-(--text-sm) font-semibold m-0">
            {report.name}
          </p>
          <p className="text-(--text-xs) m-0 mt-1">
            {t("reports.history.sentDate")}: {new Date(report.time).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-(--text-xxs) font-semibold ${statusClass}`}>
            {t("reports.history.status.sent")}
          </span>
          <button
            type="button"
            onClick={() => ReportItemFactory.triggerDownload(report.link, safeFileName)}
            className="rounded-sm border border-(--color-border) p-2 text-(--color-text-secondary) hover:border-(--color-primary-soft) hover:text-(--color-primary) transition-colors"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    );
  }
}
