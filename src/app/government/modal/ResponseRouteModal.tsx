"use client";

import { useTranslation } from "react-i18next";
import { Navigation, MapPin, Clock, AlertTriangle } from "lucide-react";
import { HeatmapArea, RESPONSE_TIMELINE } from "../../../context/services/mock/government/dashboard";
import { ModalItemFactory } from "./logic/ModalItemFactory";
import { useResponseRoute } from "../hooks/useResponseRoute";

type ResponseRouteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  area: HeatmapArea | null;
};

/**
 * [REFACTORED] - ResponseRouteModal: Uses ModalItemFactory and useResponseRoute hook.
 */
export default function ResponseRouteModal({ isOpen, onClose, area }: ResponseRouteModalProps) {
  const { t } = useTranslation();
  const { getRiskStyle } = useResponseRoute(area);

  if (!isOpen || !area) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-(--color-surface) border border-(--color-border) shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {ModalItemFactory.createHeader({
            title: t("dashboard.modal.route.title", "Response Route Plan"),
            subtitle: `${t("dashboard.modal.route.subtitle", "Emergency response for")}: ${area.name}`,
            Icon: Navigation,
            onClose
        })}

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Badge */}
          <div className={`p-3 rounded-xl flex items-center gap-3 border ${getRiskStyle()}`}>
            <AlertTriangle size={18} />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 m-0">
                {t("dashboard.modal.route.currentRisk")}
              </p>
              <p className="font-bold text-sm m-0 capitalize">
                {t(`c.${area.risk}`)} - {area.alerts} {t("dashboard.chart.totalAlerts")}
              </p>
            </div>
          </div>

          {/* Route Steps  */}
          <div className="space-y-4">
             <h4 className="text-sm font-semibold text-(--color-text-muted) uppercase tracking-wider m-0">
                {t("dashboard.modal.route.timeline")}
             </h4>
             
             <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-(--color-border)">
                {RESPONSE_TIMELINE.map((step, idx) => {
                    const Icon = step.icon === 'Navigation' ? Navigation : step.icon === 'MapPin' ? MapPin : Clock;
                    return (
                    <div key={idx} className="relative">
                        <span className="absolute -left-[23px] top-1 h-4 w-4 rounded-full border-2 border-(--color-surface) bg-(--color-primary) shadow-sm" />
                        <div>
                            <span className="text-xs font-mono text-(--color-text-muted) bg-(--color-bg-secondary) px-2 py-0.5 rounded">
                                +{step.time}m
                            </span>
                            <p className="font-semibold text-(--color-text-primary) mt-1 m-0 text-sm">
                                {t(`dashboard.modal.route.step.${step.title}`, step.desc)}
                            </p>
                        </div>
                    </div>
                )})}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
