"use client";

import { useTranslation } from "react-i18next";
import { PieChart } from "lucide-react";
import { ReportHistoryItem } from "./report-logic/ReportTypes";
import { ReportItemFactory } from "./report-logic/ReportItemFactory";
import { usePagination } from "../../normal/hooks/usePagination";
import Pagination from "./Pagination";

interface ReportHistoryListProps {
  history: ReportHistoryItem[];
  isLoading?: boolean;
}

export default function ReportHistoryList({ history, isLoading = false }: ReportHistoryListProps) {
  const { t } = useTranslation();
  const { currentItems, currentPage, totalPages, nextPage, prevPage, goToPage } = usePagination(history, 3);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-(--color-text-primary)">
          <PieChart size={18} className="text-(--color-primary)" />
          <h3 className="m-0 text-(--text-lg) font-semibold">{t("reports.history.title")}</h3>
        </div>
        <p className="m-0 text-(--color-text-secondary) text-(--text-sm)">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-(--color-text-primary)">
          <PieChart size={18} className="text-(--color-primary)" />
          <h3 className="m-0 text-(--text-lg) font-semibold">{t("reports.history.title")}</h3>
        </div>
        <p className="m-0 text-(--color-text-secondary) text-(--text-sm)">
          {t("reports.history.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2 text-(--color-text-primary)">
        <PieChart size={18} className="text-(--color-primary)" />
        <h3 className="m-0 text-(--text-lg) font-semibold">{t("reports.history.title")}</h3>
      </div>
      <div className="space-y-3 text-(--text-sm)">
        {currentItems.map((report) => 
          ReportItemFactory.createHistoryItem(report, t)
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
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
