import React from "react";
import { useTranslation } from "react-i18next";
import { IChartDataPoint } from "./logic/ChartTypes";

export const PieChartStrategy = ({ data, totalAlerts }: { data: IChartDataPoint[], totalAlerts: number }) => {
  const { t } = useTranslation();
  let cumulative = 0;
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-64">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 32 32" className="-rotate-90 w-full h-full">
          {data.map((slice) => {
            const dashArray = `${slice.value} ${100 - slice.value}`;
            const dashOffset = 25 - cumulative;
            cumulative += slice.value;
            return (
              <circle
                key={slice.label}
                r="16" cx="16" cy="16"
                stroke={slice.color}
                strokeWidth="8"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                fill="transparent"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-xs">
          <p className="text-(--color-text-muted)">{t("dashboard.chart.totalAlerts")}</p>
          <p className="text-xl font-bold text-(--color-text-primary)">{totalAlerts}</p>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        {data.map((slice) => (
          <div key={slice.label} className="flex items-center justify-between text-xs text-(--color-text-secondary)">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
              <span>{t(slice.label)}</span>
            </div>
            <span className="font-semibold">{slice.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
