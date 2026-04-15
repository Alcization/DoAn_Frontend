"use client";

import { Bell, Edit2, MapPin, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PersonalSectionProps {
  locations: any[];
}

export default function PersonalSection({ locations }: PersonalSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-4">
      {/* <div className="flex items-center justify-between">
        <h2 className="m-0 text-[var(--text-xl)] font-semibold text-[var(--color-text-primary)]">
          {t("home.personal.title")}
        </h2>
        <button className="px-4.5 py-2.5 rounded-[var(--radius-md)] border-none bg-[var(--color-primary)] text-white font-semibold flex items-center gap-2 cursor-pointer text-[var(--text-sm)] hover:opacity-90 transition-opacity">
          <Plus size={18} /> {t("home.favorite.addLocation")}
        </button>
      </div> */}

      <div className="flex flex-col gap-3">
        {locations.map((loc) => (
          <div
            key={`personal-${loc.id}`}
            className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-bg)] flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-[var(--color-text-muted)]" />
              <div>
                <p className="m-0 font-semibold text-[var(--color-text-primary)]">
                  {loc.name}
                </p>
                <span className="text-[var(--color-text-muted)] text-[13px]">
                  {loc.address}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {[Edit2, Bell, Trash2].map((Icon, idx) => (
                <button
                  key={`${loc.id}-${idx}`}
                  className={`w-[38px] h-[38px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer flex items-center justify-center hover:bg-[var(--color-bg-secondary)] transition-colors ${
                    idx === 2 ? "text-[var(--color-danger)]" : "text-[var(--color-text-primary)]"
                  }`}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
