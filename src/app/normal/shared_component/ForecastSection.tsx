"use client";

import { Bell, MapPin, Share2, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ForecastSectionProps {
  timeline: any[];
  weekForecast: any[];
}

export default function ForecastSection({ timeline, weekForecast }: ForecastSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-[var(--color-surface)] rounded-[20px] p-6 shadow-[var(--shadow-sm)] border border-[var(--color-border)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[var(--text-xl)] font-semibold text-[var(--color-text-primary)]">
          {t("home.forecast.title")}
        </h2>
        <div className="flex gap-2.5">
          {[Bell, Star, Share2].map((Icon, idx) => (
            <button
              key={idx}
              className="w-[42px] h-[42px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center cursor-pointer hover:bg-[var(--color-bg)] transition-colors text-[var(--color-text-primary)]"
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex flex-wrap gap-3 items-center">
        <MapPin className="text-[var(--color-primary)]" size={22} />
        <input
          type="text"
          defaultValue={t("home.forecast.searchPlaceholder")}
          className="flex-1 min-w-[220px] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2.5 text-[var(--text-sm)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
        />
        <button className="px-5 py-2.5 rounded-[var(--radius-md)] border-none bg-[var(--color-primary)] text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity text-[var(--text-sm)]">
          {t("home.forecast.searchBtn")}
        </button>
      </div>

      <div className="rounded-[24px] bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] text-white text-center p-8">
        <div className="text-[64px] mb-4">☀️</div>
        <div className="text-[56px] font-bold">32°C</div>
        <p className="text-[var(--text-lg)] mt-2">{t("home.forecast.desc")}</p>
      </div>


      <div className="flex flex-col gap-3">
        <h3 className="m-0 font-semibold text-[var(--color-text-primary)]">
          {t("home.forecast.week")}
        </h3>
        {weekForecast.map((day) => (
          <div
            key={day.day}
            className="flex items-center justify-between p-3.5 rounded-[var(--radius-lg)] bg-[var(--color-bg)]"
          >
            <div className="flex items-center gap-4">
              <span className="font-semibold w-10 text-[var(--color-text-primary)]">
                {day.day}
              </span>
              <span className="text-[var(--color-text-muted)] text-[var(--text-sm)]">
                {day.date}
              </span>
              <span className="text-[28px]">{day.icon}</span>
            </div>
            <div className="flex items-center gap-5">
              <span className="text-[var(--color-primary)] text-[var(--text-sm)] font-medium">
                💧 {day.rain}%
              </span>
              <span className="font-semibold text-[var(--text-sm)]">
                <span className="text-[var(--color-danger)]">{day.high}°</span>
                <span className="text-[var(--color-text-muted)] mx-1.5">/</span>
                <span className="text-[var(--color-primary)]">{day.low}°</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
