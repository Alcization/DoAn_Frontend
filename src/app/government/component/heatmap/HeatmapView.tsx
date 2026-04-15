"use client";

import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import dynamic from "next/dynamic";
import { HeatmapArea } from "../../hooks/useDashboard";
import { UI_RISK_STRATEGY } from "./logic/HeatmapStrategies";
import { HeatmapDetailFactory } from "./logic/HeatmapFactories";
import { DetailItem } from "./logic/HeatmapTypes";

type HeatmapViewProps = {
  selectedArea: HeatmapArea | null;
  setSelectedArea: (area: HeatmapArea | null) => void;
  heatmapData: HeatmapArea[];
};

const VietMapHeatmap = dynamic(() => import("./VietMapHeatmap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-(--color-text-secondary)">
      ...
    </div>
  ),
});

/**
 * [COMPOSITE PATTERN] - DetailCard: Reusable component for metric display.
 */
const DetailCard = ({ item }: { item: DetailItem }) => (
  <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 flex flex-col gap-1">
    <span className="flex items-center gap-2 text-xs uppercase text-(--color-text-muted)">
      <item.Icon size={12} /> {item.label}
    </span>
    <span className="text-lg font-semibold text-(--color-text-primary)">
      {item.value}
    </span>
  </div>
);

export default function HeatmapView({ selectedArea, setSelectedArea, heatmapData }: HeatmapViewProps) {
  const { t } = useTranslation();
  const details = selectedArea ? HeatmapDetailFactory.create(t, selectedArea) : [];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Map Facade */}
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-lg flex flex-col h-[500px]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="m-0 text-xl font-semibold text-(--color-text-primary)">{t("dashboard.map.title")}</h2>
            <p className="m-0 text-xs text-(--color-text-secondary)">{t("dashboard.map.subtitle")}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={() => {
                setSelectedArea(null);
              }}
              className="px-4 py-2 rounded-xl bg-(--color-primary) text-white text-xs font-bold hover:bg-(--color-primary-bg) hover:text-(--color-primary) transition-all duration-300 shadow-sm flex items-center gap-2 border border-transparent hover:border-(--color-primary)"
            >
              {t("dashboard.map.showAll")}
            </button>
            <div className="flex items-center gap-2 text-xs text-(--color-text-secondary)">
              {["low", "medium", "high"].map(risk => {
                const colors: Record<string, string> = {
                  low: "bg-(--color-success)",
                  medium: "bg-(--color-warning)",
                  high: "bg-(--color-danger)"
                };
                return (
                  <span key={risk} className="inline-flex items-center gap-1">
                    <span className={`h-2 w-2 rounded-full ${colors[risk]}`} />
                    {t(`dashboard.map.risk.${risk}`)}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div className="relative flex-1 rounded-2xl overflow-hidden border border-(--color-border)">
          <VietMapHeatmap heatmapData={heatmapData} selectedArea={selectedArea} onSelectArea={setSelectedArea} />
        </div>
      </div>

      {/* Details Facade */}
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-5 shadow-sm h-[500px] flex flex-col overflow-y-auto">
        {selectedArea ? (
          <div className="mt-3 space-y-4">
            <div className="rounded-2xl border border-(--color-border) bg-(--color-bg) p-4 shadow-xs">
              <p className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wide">{selectedArea.region}</p>
              <p className="text-2xl font-bold text-(--color-text-primary)">{selectedArea.name}</p>
              <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-xs font-semibold ${UI_RISK_STRATEGY[selectedArea.risk]}`}>
                <AlertTriangle size={14} /> {t("dashboard.map.risk.label")}: {t(`dashboard.map.risk.${selectedArea.risk}`)}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {details.map((item, idx) => <DetailCard key={idx} item={item} />)}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-(--color-text-muted) italic">
            {t("dashboard.map.noAreaSelected")}
          </div>
        )}
      </div>
    </section>
  );
}
