import { useTranslation } from "react-i18next";
import { PieChart } from "lucide-react";
import { ReportHistoryItem } from "./report-logic/ReportTypes";
import { ReportItemFactory } from "./report-logic/ReportItemFactory";

interface ReportHistoryListProps {
  history: ReportHistoryItem[];
}

/**
 * [FACADE PATTERN] - ReportHistoryList: Presentational list that delegates rendering to a Factory.
 */
export default function ReportHistoryList({ history }: ReportHistoryListProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-(--color-text-primary)">
        <PieChart size={18} className="text-(--color-primary)" />
        <h3 className="m-0 text-(--text-lg) font-semibold">{t("reports.history.title")}</h3>
        </div>
        <div className="space-y-3 text-(--text-sm)">
        {history.map((report) => 
          ReportItemFactory.createHistoryItem(report, t)
        )}
        </div>
        <div className="rounded-[var(--radius-md)] border border-(--color-border) bg-gradient-to-br from-(--color-info-bg) to-(--color-surface) p-4">
        <p className="text-(--text-sm) font-semibold text-(--color-text-primary) m-0">
            {t("reports.history.suggestionTitle")}
        </p>
        <p className="text-(--text-xs) text-(--color-text-secondary) m-0 mt-1">
            {t("reports.history.suggestionText")}
        </p>
        </div>
    </div>
  );
}
