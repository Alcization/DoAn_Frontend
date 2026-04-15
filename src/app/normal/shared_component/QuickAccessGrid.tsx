"use client";

import { CloudRain, Map } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuickAccessGrid() {
  const { t } = useTranslation();
  const quickCards = [
    {
      title: t("home.quick.forecast"),
      description: t("home.quick.forecastDesc"),
      icon: CloudRain,
      accent: "text-[var(--color-primary)]",
    },
    {
      title: t("home.quick.map"),
      description: t("home.quick.mapDesc"),
      icon: Map,
      accent: "text-[var(--color-success)]",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4">
      {quickCards.map(({ title, description, icon: Icon, accent }) => (
        <button
          key={title}
          className="rounded-[20px] p-6 shadow-[var(--shadow-sm)] bg-[var(--color-surface)] flex items-center gap-4 cursor-pointer border border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors text-left"
        >
          <span
            className={`w-12 h-12 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center ${accent}`}
          >
            <Icon size={26} />
          </span>
          <div>
            <p className="m-0 font-semibold text-[var(--color-text-primary)]">
              {title}
            </p>
            <p className="m-0 mt-1 text-[var(--color-text-secondary)] text-[var(--text-sm)]">
              {description}
            </p>
          </div>
        </button>
      ))}
    </section>
  );
}
