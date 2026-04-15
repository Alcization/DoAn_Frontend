"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { X, Plus } from "lucide-react";
import { Priority, ScenarioAction } from "../../../context/services/mock/government/scenario-management";
import { useAddStep } from "../hooks/useAddStep";

type AddStepModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (step: Omit<ScenarioAction, "id" | "step">) => void;
};

/**
 * [FACADE PATTERN] - AddStepModal: Uses useAddStep hook for state management.
 */
export default function AddStepModal({ isOpen, onClose, onAdd }: AddStepModalProps) {
  const { t } = useTranslation();
  const {
      formData,
      updateDescription,
      updatePriority,
      handleAdd
  } = useAddStep(onAdd, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-(--color-primary-bg)">
              <Plus size={20} className="text-(--color-primary)" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-(--color-text-primary)">
                {t("scenarioManagement.addStepModal.title")}
              </h3>
              <p className="text-sm text-(--color-text-secondary) mt-1">
                {t("scenarioManagement.addStepModal.desc")}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-(--color-bg-secondary) text-(--color-text-secondary) transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-primary)">
              {t("scenarioManagement.addStepModal.descLabel")}
            </label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => updateDescription(e.target.value)}
              placeholder={t("scenarioManagement.form.stepPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all resize-none placeholder:text-(--color-text-muted)"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-primary)">
              {t("scenarioManagement.form.priorityLabel")}
            </label>
            <select 
              value={formData.priority}
              onChange={(e) => updatePriority(e.target.value as Priority)}
              className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all appearance-none cursor-pointer"
            >
              <option value="High">{t("scenarioManagement.priority.High")}</option>
              <option value="Medium">{t("scenarioManagement.priority.Medium")}</option>
              <option value="Low">{t("scenarioManagement.priority.Low")}</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-(--color-border) bg-(--color-bg-secondary)/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) font-medium text-sm hover:bg-(--color-bg-secondary) transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button 
            onClick={handleAdd}
            disabled={!formData.description.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-(--color-primary) text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            {t("scenarioManagement.addStepModal.addBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
