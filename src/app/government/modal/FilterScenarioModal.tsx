import React from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import { ScenarioType, ScenarioStatus } from "../../../context/services/mock/government/scenario-management";
import { ModalItemFactory } from "./logic/ModalItemFactory";
import { useScenarioFilters } from "../hooks/useScenarioFilters";
import { ScenarioFilters } from "./logic/ModalTypes";

type FilterScenarioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: ScenarioFilters) => void;
};

/**
 * [REFACTORED] - FilterScenarioModal: Uses ModalItemFactory and useScenarioFilters hook.
 */
export default function FilterScenarioModal({ isOpen, onClose, onApply }: FilterScenarioModalProps) {
  const { t } = useTranslation();
  const { filters, handleUpdate, handleReset, handleApply } = useScenarioFilters(onApply);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: t("scenarioManagement.filterModal.title"),
            subtitle: t("scenarioManagement.filterModal.desc"),
            Icon: Filter,
            onClose
        })}

        <div className="p-6 space-y-5">
          {ModalItemFactory.createFormGroup({
              label: t("scenarioManagement.filterModal.searchLabel"),
              children: (
                <input 
                  type="text" 
                  value={filters.searchTerm}
                  onChange={(e) => handleUpdate("searchTerm", e.target.value)}
                  placeholder={t("scenarioManagement.filterModal.searchPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)"
                />
              )
          })}

          {ModalItemFactory.createFormGroup({
              label: t("scenarioManagement.filterModal.typeLabel"),
              children: (
                <select 
                  value={filters.type}
                  onChange={(e) => handleUpdate("type", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">{t("scenarioManagement.filterModal.allTypes")}</option>
                  <option value="flood">{t("scenarioManagement.type.flood")}</option>
                  <option value="storm">{t("scenarioManagement.type.storm")}</option>
                  <option value="fire">{t("scenarioManagement.type.fire")}</option>
                  <option value="earthquake">{t("scenarioManagement.type.earthquake")}</option>
                </select>
              )
          })}

          {ModalItemFactory.createFormGroup({
              label: t("scenarioManagement.filterModal.statusLabel"),
              children: (
                <select 
                  value={filters.status}
                  onChange={(e) => handleUpdate("status", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">{t("scenarioManagement.filterModal.allStatuses")}</option>
                  <option value="active">{t("scenarioManagement.status.active")}</option>
                  <option value="draft">{t("scenarioManagement.status.draft")}</option>
                  <option value="archived">{t("scenarioManagement.status.archived")}</option>
                </select>
              )
          })}
        </div>

        {ModalItemFactory.createFooter({
            onClose,
            onConfirm: handleApply,
            confirmText: t("scenarioManagement.filterModal.applyBtn"),
            confirmIcon: Filter,
            cancelText: t("scenarioManagement.filterModal.resetBtn"),
            t
        })}
      </div>
    </div>
  );
}
