import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2, AlertTriangle } from "lucide-react";
import { Scenario } from "../../../context/services/mock/government/scenario-management";
import { ModalItemFactory } from "./logic/ModalItemFactory";

type DeleteScenarioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario | null;
  onDelete?: (scenario: Scenario) => void;
};

/**
 * [REFACTORED] - DeleteScenarioModal: Uses ModalItemFactory.
 */
export default function DeleteScenarioModal({ isOpen, onClose, scenario, onDelete }: DeleteScenarioModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !scenario) return null;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(scenario);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: t("scenarioManagement.deleteModal.title"),
            subtitle: t("scenarioManagement.deleteModal.desc"),
            Icon: Trash2,
            iconColorClass: "text-(--color-danger)",
            iconBgClass: "bg-(--color-danger-bg)",
            onClose
        })}

        <div className="p-6 space-y-4">
          {/* Warning Card */}
          <div className="p-4 rounded-xl bg-(--color-danger-bg)/50 border border-(--color-danger)/20 flex gap-3">
            <AlertTriangle size={20} className="text-(--color-danger) shrink-0 mt-0.5" />
            <p className="text-sm text-(--color-text-primary) m-0">
              {t("scenarioManagement.deleteModal.warning")}
            </p>
          </div>

          {/* Scenario Info Card */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-secondary)">
              {t("scenarioManagement.deleteModal.scenarioLabel")}
            </label>
            <div className="p-4 rounded-xl border border-(--color-border) bg-(--color-bg)">
              <p className="font-bold text-(--color-text-primary) mb-1 m-0">
                {scenario.name}
              </p>
              <p className="text-sm text-(--color-text-secondary) m-0">
                {scenario.description}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-(--color-text-muted)">
                <span>{scenario.steps} {t("scenarioManagement.list.steps")}</span>
                <span>•</span>
                <span>{t("scenarioManagement.list.usage")}: {scenario.usageCount} {t("scenarioManagement.list.times")}</span>
              </div>
            </div>
          </div>
        </div>

        {ModalItemFactory.createFooter({
            onClose,
            onConfirm: handleDelete,
            confirmText: t("scenarioManagement.deleteModal.confirmBtn"),
            confirmIcon: Trash2,
            actionType: "danger",
            t
        })}
      </div>
    </div>
  );
}
