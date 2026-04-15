import React from "react";
import { LucideIcon } from "lucide-react";

/**
 * [TEMPLATE METHOD PATTERN] - ChartWidget: Defines the visual skeleton.
 * Sub-charts provide the 'children' as their specific implementation.
 */
interface ChartWidgetProps {
  title: string;
  Icon: LucideIcon;
  cols?: string;
  children: React.ReactNode;
}

export const ChartWidget = ({ title, Icon, cols = "lg:col-span-1", children }: ChartWidgetProps) => (
  <div className={`rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm ${cols}`}>
    <div className="flex items-center gap-2 text-(--color-text-primary) mb-4">
      <Icon size={18} className="text-(--color-primary)" />
      <h3 className="m-0 text-lg font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);
