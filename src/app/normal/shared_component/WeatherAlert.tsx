"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WeatherAlert() {
  const { t } = useTranslation();
  return (
    <section className="flex gap-3 items-center px-5 py-4 rounded-[var(--radius-lg)] border-l-[6px] border-[var(--color-warning)] bg-[var(--color-warning-bg)]">
      <AlertTriangle className="text-[var(--color-warning)]" size={28} />
      <div>
        <p className="font-semibold text-[var(--color-warning)] m-0">
          {t("home.alert.title")}
        </p>
        <p className="text-[var(--color-warning)] text-[var(--text-sm)] mt-1">
          {t("home.alert.desc")}
        </p>
      </div>
    </section>
  );
}
