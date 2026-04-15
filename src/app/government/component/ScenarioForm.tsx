"use client";

import { useTranslation } from "react-i18next";
import { Edit, Save, Plus } from "lucide-react";

export default function ScenarioForm() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6 h-full flex flex-col gap-5 overflow-y-auto">
        <div className="flex items-center gap-2 text-[var(--color-primary)] mb-2">
            <Edit size={18} />
            <h2 className="font-bold text-[var(--text-lg)] text-[var(--color-text-primary)]">
                {t("scenarioManagement.createTitle")}
            </h2>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-2">
            <label className="text-[var(--text-sm)] font-bold text-[var(--color-text-secondary)]">
                {t("scenarioManagement.form.nameLabel")}
            </label>
            <input 
                type="text" 
                placeholder={t("scenarioManagement.form.namePlaceholder")}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] focus:border-transparent outline-none transition-all"
            />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
            <label className="text-[var(--text-sm)] font-bold text-[var(--color-text-secondary)]">
                {t("scenarioManagement.form.descLabel")}
            </label>
            <textarea 
                rows={3}
                placeholder={t("scenarioManagement.form.descPlaceholder")}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] focus:border-transparent outline-none transition-all resize-none"
            />
        </div>

        <div className="h-px bg-[var(--color-border)] my-2" />

        {/* Checklist */}
        <div>
            <div className="flex items-center justify-between mb-3">
                 <label className="text-[var(--text-lg)] font-bold text-[var(--color-text-secondary)]">
                    {t("scenarioManagement.form.stepsLabel")}
                </label>
                <button className="flex items-center gap-1 px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--text-xs)] font-medium hover:bg-[var(--color-bg)]">
                    <Plus size={14} />
                    {t("scenarioManagement.form.addStep")}
                </button>
            </div>

            {/* Step 1 Example */}
            <div className="p-4 rounded-xl bg-[var(--color-bg)]/50 border border-[var(--color-border)] mb-3">
                <div className="flex justify-between mb-2">
                    <span className="text-[var(--text-sm)] font-bold text-[var(--color-primary)]">
                        {t("scenarioManagement.list.steps")} 1
                    </span>
                </div>
                <textarea 
                    rows={2}
                    placeholder={t("scenarioManagement.form.stepPlaceholder")}
                    className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--text-sm)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none mb-3 resize-none"
                />
                <div className="flex flex-col gap-1">
                     <label className="text-[var(--text-xs)] font-bold text-[var(--color-text-secondary)]">
                        {t("scenarioManagement.form.priorityLabel")}
                    </label>
                    <select className="w-full appearance-none rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--text-sm)] outline-none">
                        <option>Cao</option>
                        <option>Trung bình</option>
                        <option>Thấp</option>
                    </select>
                </div>
            </div>
        </div>

        <button className="w-full py-3 mt-auto rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-bold shadow-[var(--shadow-md)]">
            <Save size={18} />
            {t("scenarioManagement.saveButton")}
        </button>
    </div>
  );
}
