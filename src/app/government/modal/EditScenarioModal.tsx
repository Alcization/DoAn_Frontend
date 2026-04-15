import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Save, Plus, Trash2 } from "lucide-react";
import { Scenario, ScenarioAction } from "../../../context/services/mock/government/scenario-management";
import { ModalItemFactory } from "./logic/ModalItemFactory";

type EditScenarioModalProps = {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario | null;
  onSave?: (scenario: Scenario) => void;
};

/**
 * [REFACTORED] - EditScenarioModal: Uses ModalItemFactory.
 */
export default function EditScenarioModal({ isOpen, onClose, scenario, onSave }: EditScenarioModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    checklist: ScenarioAction[];
  }>({
    name: "",
    description: "",
    checklist: [],
  });

  useEffect(() => {
    if (scenario) {
      setFormData({
        name: scenario.name,
        description: scenario.description,
        checklist: [...scenario.checklist],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        checklist: [],
      });
    }
  }, [scenario, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSave) {
      const savedScenario: Scenario = {
        id: scenario?.id || Date.now(),
        name: formData.name,
        description: formData.description,
        checklist: formData.checklist,
        steps: formData.checklist.length,
        type: scenario?.type || "flood",
        status: scenario?.status || "active",
        lastUpdate: new Date().toISOString(),
        author: scenario?.author || "Current User",
        usageCount: scenario?.usageCount || 0,
      };
      onSave(savedScenario);
    }
    onClose();
  };

  const handleAddStep = () => {
    const newStep: ScenarioAction = {
      id: Date.now(),
      step: formData.checklist.length + 1,
      description: "",
      priority: "Medium",
    };
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, newStep],
    }));
  };

  const handleUpdateStep = (index: number, field: keyof ScenarioAction, value: string) => {
    const updatedChecklist = [...formData.checklist];
    updatedChecklist[index] = {
      ...updatedChecklist[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      checklist: updatedChecklist,
    }));
  };

  const handleRemoveStep = (index: number) => {
    const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
    const renumberedChecklist = updatedChecklist.map((item, i) => ({
      ...item,
      step: i + 1,
    }));
    setFormData(prev => ({
      ...prev,
      checklist: renumberedChecklist,
    }));
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: scenario ? t("scenarioManagement.editModal.title") : t("scenarioManagement.createTitle"),
            subtitle: scenario ? t("scenarioManagement.editModal.desc") : t("scenarioManagement.form.descPlaceholder"),
            Icon: scenario ? Edit : Plus,
            iconBgClass: scenario ? "bg-(--color-primary-soft)" : "bg-(--color-success-bg)",
            iconColorClass: scenario ? "text-(--color-primary)" : "text-(--color-success)",
            onClose
        })}

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {ModalItemFactory.createFormGroup({
              label: t("scenarioManagement.form.nameLabel"),
              children: (
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("scenarioManagement.form.namePlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)"
                />
              )
          })}

          {ModalItemFactory.createFormGroup({
              label: t("scenarioManagement.form.descLabel"),
              children: (
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t("scenarioManagement.form.descPlaceholder")}
                  className="w-full px-4 py-2.5 rounded-xl border border-(--color-border) bg-(--color-bg) text-(--color-text-primary) focus:outline-none focus:ring-2 focus:ring-(--color-primary)/20 transition-all resize-none placeholder:text-(--color-text-muted)"
                />
              )
          })}

          <div className="h-px bg-(--color-border) my-2" />

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-bold text-(--color-text-primary)">
                {t("scenarioManagement.form.stepsLabel")}
              </label>
              <button 
                onClick={handleAddStep}
                className="flex items-center gap-1 px-3 py-1 rounded-full border border-(--color-border) text-xs font-medium hover:bg-(--color-bg) transition-colors text-(--color-text-primary)"
              >
                <Plus size={14} />
                {t("scenarioManagement.form.addStep")}
              </button>
            </div>

            <div className="space-y-3">
              {formData.checklist.map((item, index) => (
                <div key={item.id} className="p-4 rounded-xl bg-(--color-bg)/50 border border-(--color-border)">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-(--color-primary)">
                      {t("scenarioManagement.list.steps")} {index + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="p-1 rounded-lg hover:bg-(--color-danger-bg) hover:text-(--color-danger) text-(--color-text-muted) transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea 
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdateStep(index, "description", e.target.value)}
                    placeholder={t("scenarioManagement.form.stepPlaceholder")}
                    className="w-full rounded-lg border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm focus:ring-1 focus:ring-(--color-primary) outline-none mb-3 resize-none text-(--color-text-primary) placeholder:text-(--color-text-muted)"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-(--color-text-secondary)">
                      {t("scenarioManagement.form.priorityLabel")}
                    </label>
                    <select 
                      value={item.priority}
                      onChange={(e) => handleUpdateStep(index, "priority", e.target.value)}
                      className="w-full appearance-none rounded-lg border border-(--color-border) bg-(--color-bg-secondary) px-3 py-2 text-sm outline-none text-(--color-text-primary) cursor-pointer"
                    >
                      <option value="High">{t("scenarioManagement.priority.High")}</option>
                      <option value="Medium">{t("scenarioManagement.priority.Medium")}</option>
                      <option value="Low">{t("scenarioManagement.priority.Low")}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {ModalItemFactory.createFooter({
            onClose,
            onConfirm: handleSave,
            confirmText: scenario ? t("scenarioManagement.editModal.updateBtn") : t("scenarioManagement.saveButton"),
            confirmIcon: scenario ? Save : Plus,
            t
        })}
      </div>
    </div>
  );
}
