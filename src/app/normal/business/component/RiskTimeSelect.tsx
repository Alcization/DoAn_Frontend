"use client";

import { useTranslation } from "react-i18next";
import { Clock, ChevronDown } from "lucide-react";
import { RiskData } from "@/app/normal/hooks/useRiskAnalysisCommand";

interface RiskTimeSelectProps {
  time: string;
  updateField: (field: keyof RiskData, value: any) => void;
}

export const RiskTimeSelect = ({ time, updateField }: RiskTimeSelectProps) => {
  const { t } = useTranslation();
  
  const currentHour = new Date().getHours();
  const availableHours = Array.from({ length: 6 }, (_, i) => (currentHour + i + 1) % 24);

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <label className="text-(--text-sm) font-semibold text-(--color-text-secondary) flex items-center gap-2">
        <Clock size={16} /> {t("businessReports.risk.time")}
      </label>
      <div className="relative">
        <select
          value={time || ""}
          onChange={(e) => updateField("time", e.target.value)}
          className="w-full px-3.5 py-3 rounded-xl border border-(--color-border) text-(--text-sm) sm:text-(--text-base) bg-(--color-bg) text-(--color-text-primary) focus:border-(--color-primary) transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>{t("businessReports.risk.time")}</option>
          {availableHours.map((hour) => {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            const isTomorrow = hour < currentHour;
            return (
              <option key={timeStr} value={timeStr}>
                {timeStr} {hour >= 12 ? 'PM' : 'AM'} {isTomorrow ? `(Tomorrow)` : `(Today)`}
              </option>
            );
          })}
        </select>
        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-text-secondary) pointer-events-none" />
      </div>
    </div>
  );
};
