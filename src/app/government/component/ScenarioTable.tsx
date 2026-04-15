"use client";

import { useTranslation } from "react-i18next";
import { Edit2, Trash2, PlayCircle, MoreHorizontal, FileText } from "lucide-react";
import { SCENARIOS } from "../../../context/services/mock/government/scenario-management";

export default function ScenarioTable() {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[var(--color-success-bg)] text-[var(--color-success)]";
      case "draft":
        return "bg-[var(--color-warning-bg)] text-[var(--color-warning)]";
      case "archived":
        return "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]";
      default:
        return "bg-[var(--color-surface)] text-[var(--color-text-secondary)]";
    }
  };

  const getTypeIcon = (type: string) => {
    // You could map specific icons here, for now using generic logic or colors
    return type.toUpperCase(); 
  };

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
            <span className="text-[var(--color-primary)]">
                <FileText size={20} />
            </span>
            <h2 className="text-[var(--text-lg)] font-bold text-[var(--color-text-primary)]">
            {t("scenarioManagement.title")}
            </h2>
        </div>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-medium text-[var(--text-sm)] hover:opacity-90 transition-opacity flex items-center gap-2">
            + {t("scenarioManagement.actions.create")}
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)] text-[var(--text-sm)]">
              <th className="p-4 font-semibold">{t("scenarioManagement.table.name")}</th>
              <th className="p-4 font-semibold">{t("scenarioManagement.table.type")}</th>
              <th className="p-4 font-semibold">{t("scenarioManagement.table.status")}</th>
              <th className="p-4 font-semibold">{t("scenarioManagement.table.steps")}</th>
              <th className="p-4 font-semibold">{t("scenarioManagement.table.lastUpdate")}</th>
              <th className="p-4 font-semibold text-right">{t("scenarioManagement.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-primary)]">
            {SCENARIOS.map((scenario) => (
              <tr key={scenario.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                <td className="p-4">
                  <div>
                    <p className="font-bold text-[var(--color-text-primary)] text-[var(--text-sm)]">{scenario.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
                       {scenario.description}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                    <span className="font-medium text-[var(--text-sm)] capitalize">
                        {t(`scenarioManagement.type.${scenario.type}`)}
                    </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[var(--text-xxs)] font-bold uppercase tracking-wide ${getStatusColor(scenario.status)}`}>
                    {t(`scenarioManagement.status.${scenario.status}`)}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-sm)] tabular-nums font-semibold">
                  {scenario.steps}
                </td>
                <td className="p-4 text-[var(--text-sm)] text-[var(--color-text-secondary)]">
                    {new Date(scenario.lastUpdate).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                        className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-primary)]/20 bg-[var(--color-primary-bg)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                        title={t("scenarioManagement.actions.simulate")}
                    >
                        <PlayCircle size={16} />
                    </button>
                    <button className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)] transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] text-[var(--color-text-secondary)] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
