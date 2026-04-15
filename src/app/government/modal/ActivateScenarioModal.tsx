"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { X, Play } from "lucide-react";
import { Incident } from "../../../context/services/mock/government/history-incidents";
import { Scenario } from "../../../context/services/mock/government/scenario-management";
import { useActivateScenario } from "../hooks/useActivateScenario";
import { ModalItemFactory } from "./logic/ModalItemFactory";

interface ActivateScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onActivate: (scenario: Scenario) => void;
}

/**
 * [FACADE PATTERN] - ActivateScenarioModal: Orchestrates scenario activation via useActivateScenario hook.
 * UI rendering is delegated to ModalItemFactory.
 */
export default function ActivateScenarioModal({ isOpen, onClose, incident, onActivate }: ActivateScenarioModalProps) {
  const { t } = useTranslation();
  const {
      selectedScenarioId,
      otherScenarios,
      handleActivate,
      selectScenario,
      loading,
      error
  } = useActivateScenario(incident, onActivate, onClose);

  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl bg-(--color-surface) border border-(--color-border) rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--color-border) bg-(--color-bg)/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-(--color-primary-bg) flex items-center justify-center border border-(--color-primary)/10">
              <Play className="text-(--color-primary)" size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-(--color-text-primary) m-0 leading-none">
                {t("government.scenarioManagement.activeModal.title")}
              </h3>
              <p className="text-sm text-(--color-text-secondary) mt-1.5 m-0 italic">
                {incident.location} ({t(`alertHistory.type.${incident.type}`)})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl hover:bg-(--color-bg-secondary) text-(--color-text-secondary) transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <p className="font-semibold">{t("common.error", "Error")}</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-primary)"></div>
              <span className="ml-2 text-(--color-text-secondary)">{t("common.loading", "Loading...")}</span>
            </div>
          )}
          
          {/* Scenarios */}
          {!loading && !error && otherScenarios.length > 0 && (
            <section>
              <div className="grid grid-cols-1 gap-3 opacity-80">
                {otherScenarios.map((scenario) => 
                  ModalItemFactory.createScenarioCard({
                    scenario,
                    isSelected: selectedScenarioId === scenario.id,
                    onClick: () => selectScenario(scenario.id),
                    t
                  })
                )}
              </div>
            </section>
          )}
          
          {!loading && !error && otherScenarios.length === 0 && (
            <div className="text-center py-8">
              <p className="text-(--color-text-secondary)">{t("common.noData", "No scenarios available")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-(--color-border) flex justify-end gap-3 bg-(--color-bg)/20">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-(--color-text-secondary) hover:bg-(--color-bg-secondary) transition-colors"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button 
            onClick={handleActivate}
            disabled={!selectedScenarioId || loading || Boolean(error)}
            className="px-8 py-2.5 rounded-xl font-bold bg-(--color-primary) text-white shadow-lg shadow-(--color-primary)/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Play size={18} fill="currentColor" />
            {t("government.scenarioManagement.activeModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
