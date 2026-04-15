"use client";

import { useTranslation } from "react-i18next";
import { CheckSquare, Edit3 } from "lucide-react";
import { Scenario } from "../../../context/services/mock/government/scenario-management";

interface ScenarioDetailProps {
  scenario: Scenario;
}

export default function ScenarioDetail({ scenario }: ScenarioDetailProps) {
  const { t } = useTranslation();

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case 'High': return 'text-[var(--color-danger)]';
          case 'Medium': return 'text-[var(--color-warning)]';
          default: return 'text-[var(--color-success)]';
      }
  };

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
             <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
                <CheckSquare size={18} />
                <span className="font-semibold text-[var(--text-sm)] uppercase tracking-wide">
                    {t("scenarioManagement.detailTitle")}
                </span>
             </div>
             <h1 className="text-[var(--text-2xl)] font-bold text-[var(--color-text-primary)] mb-2 leading-tight">
                {scenario.name}
             </h1>
             <p className="text-[var(--text-base)] text-[var(--color-text-secondary)]">
                {scenario.description}
             </p>
        </div>

        {/* Checklist */}
        <div className="flex-1 bg-[var(--color-bg)]/50 rounded-2xl p-5 border border-[var(--color-border)] overflow-y-auto">
            <h3 className="font-bold text-[var(--color-text-primary)] mb-4 text-[var(--text-base)]">
                {t("scenarioManagement.checklist.title")}
            </h3>
            <div className="flex flex-col gap-4">
                {scenario.checklist.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center font-bold text-[var(--color-primary)] text-[var(--text-sm)] shadow-sm">
                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-text-primary)] text-[var(--text-base)]">
                                {item.description}
                            </p>
                            <p className={`text-[var(--text-xs)] font-bold mt-1 ${getPriorityColor(item.priority)}`}>
                                {t("scenarioManagement.checklist.priority")}: {t(`scenarioManagement.priority.${item.priority}`)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Edit Button */}
        <button className="w-full mt-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors font-semibold text-[var(--text-sm)]">
            {t("scenarioManagement.editButton")}
        </button>
    </div>
  );
}
