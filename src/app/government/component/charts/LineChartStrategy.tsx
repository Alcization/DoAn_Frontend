import React from "react";
import { IChartDataPoint } from "./logic/ChartTypes";
import { SVGChartBuilder } from "../charts-logic/ChartBuilder";

export const LineChartStrategy = ({ data }: { data: IChartDataPoint[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value));
  const builder = new SVGChartBuilder();

  data.forEach((p, i) => {
    const x = (i / (data.length - 1)) * 100;
    const normalized = (p.value - minVal) / (maxVal - minVal || 1);
    builder.addLinePoint(x, 38 - normalized * 30);
  });

  return (
    <div className="h-64">
      <svg viewBox="0 0 100 40" className="w-full h-full">
        {builder.buildGradientPath("line-grad", "var(--color-primary)")}
        {builder.buildPolyline("var(--color-primary)", 1.5)}
        {data.map((p, i) => {
          const x = (i / (data.length - 1)) * 100;
          const normalized = (p.value - minVal) / (maxVal - minVal || 1);
          const y = 38 - normalized * 30;
          return <circle key={p.label} cx={x} cy={y} r={1} fill="var(--color-primary-strong)" />;
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-(--color-text-muted) mt-2">
        {data.map(p => <span key={p.label}>{p.label}</span>)}
      </div>
    </div>
  );
};
