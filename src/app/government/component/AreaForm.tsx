"use client";

import { useTranslation } from "react-i18next";
import { Map, Save, Building } from "lucide-react";

export default function AreaForm() {
  const { t } = useTranslation();

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) shadow-sm p-5 h-full flex flex-col gap-6">
        <div>
            <h2 className="text-(--text-lg) font-bold text-(--color-text-primary)">{t("areaManagement.form.title")}</h2>
            <p className="text-(--text-sm) mt-1 text-(--color-text-secondary)">{t("areaManagement.form.desc")}</p>
        </div>

        <div className="flex flex-col gap-4">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
                <label className="text-(--text-sm) font-semibold text-(--color-text-secondary)">
                    {t("areaManagement.form.nameLabel")}
                </label>
                <input 
                    type="text" 
                    placeholder={t("areaManagement.form.namePlaceholder")}
                    className="w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary-soft) focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Admin Unit Input */}
            <div className="flex flex-col gap-2">
                <label className="text-(--text-sm) font-semibold text-(--color-text-secondary)">
                    {t("areaManagement.form.unitLabel")}
                </label>
                <input 
                    type="text" 
                    placeholder={t("areaManagement.form.unitPlaceholder")}
                    className="w-full rounded-md border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) focus:ring-2 focus:ring-(--color-primary-soft) focus:border-transparent outline-none transition-all"
                />
            </div>

            <button className="w-full py-3 mt-2 rounded-md bg-(--color-primary) text-(--color-surface) hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-bold shadow-(--shadow-md)">
                <Save size={18} />
                {t("areaManagement.form.saveBtn")}
            </button>
        </div>
    </div>
  );
}
