"use client";

import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

interface RiskAssessmentHeaderProps {
  showRiskAssessment: boolean;
  setShowRiskAssessment: (show: boolean) => void;
}

export const RiskAssessmentHeader = ({ showRiskAssessment, setShowRiskAssessment }: RiskAssessmentHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-(--color-primary)">
        <AlertTriangle size={20} />
        <h2 className="m-0 text-(--text-lg) sm:text-(--text-xl) text-(--color-text-primary)">
          {t("businessReports.risk.title")}
        </h2>
      </div>
      <button
        onClick={() => setShowRiskAssessment(!showRiskAssessment)}
        className="px-4 py-2 rounded-xl border border-(--color-border) bg-(--color-surface) hover:bg-(--color-bg) transition-colors text-(--text-sm) cursor-pointer text-(--color-text-primary)"
      >
        {showRiskAssessment ? t("businessReports.buttons.hide") : t("businessReports.buttons.show")}
      </button>
    </div>
  );
};
