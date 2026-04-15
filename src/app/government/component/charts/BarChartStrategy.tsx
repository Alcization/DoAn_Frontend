import React from "react";
import { IChartDataPoint } from "./logic/ChartTypes";

export const BarChartStrategy = ({ data }: { data: IChartDataPoint[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="h-64 flex items-end gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full rounded-t-2xl"
            style={{
              background: `linear-gradient(180deg, ${item.color} 0%, rgba(255,255,255,0) 100%)`,
              height: `${(item.value / maxVal) * 100}%`,
            }}
          />
          <span className="text-xs font-semibold text-(--color-text-secondary)">{item.value}</span>
          <span className="text-[10px] text-(--color-text-muted) text-center hidden sm:block truncate w-full px-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
