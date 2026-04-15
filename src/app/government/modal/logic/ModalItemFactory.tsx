import React from "react";
import { X, LucideIcon } from "lucide-react";
import { Scenario } from "../../../../context/services/mock/government/scenario-management";
import { ACTION_STYLE_STRATEGY } from "./ModalStrategies";

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onClick: () => void;
  t: any;
}

interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    Icon: LucideIcon;
    iconColorClass?: string;
    iconBgClass?: string;
    onClose: () => void;
}

interface ModalFooterProps {
    onClose: () => void;
    onConfirm: () => void;
    confirmText: string;
    confirmIcon?: LucideIcon;
    actionType?: keyof typeof ACTION_STYLE_STRATEGY;
    disabled?: boolean;
    cancelText?: string;
    t: any;
}

/**
 * [FACTORY METHOD PATTERN] - ModalItemFactory: Encapsulates modal-specific item rendering.
 */
export class ModalItemFactory {
  static createHeader({ title, subtitle, Icon, iconColorClass = "text-(--color-primary)", iconBgClass = "bg-(--color-primary-soft)", onClose }: ModalHeaderProps) {
      return (
        <div className="flex items-center justify-between p-6 border-b border-(--color-border)">
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${iconBgClass} ${iconColorClass}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-(--color-text-primary) m-0">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-(--color-text-secondary) mt-1 m-0">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-(--color-bg-secondary) text-(--color-text-secondary) transition-colors"
            >
                <X size={20} />
            </button>
        </div>
      );
  }

  static createFooter({ onClose, onConfirm, confirmText, confirmIcon: ConfirmIcon, actionType = "confirm", disabled = false, cancelText, t }: ModalFooterProps) {
      const actionClass = ACTION_STYLE_STRATEGY[actionType === "cancel" ? "confirm" : actionType];

      return (
        <div className="p-5 border-t border-(--color-border) bg-(--color-bg-secondary)/30 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-text-secondary) font-medium text-sm hover:bg-(--color-bg-secondary) transition-colors"
          >
            {cancelText || t("common.cancel")}
          </button>
          <button 
             onClick={onConfirm}
             disabled={disabled}
             className={`px-8 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${actionClass}`}
          >
            {ConfirmIcon && <ConfirmIcon size={16} />}
            {confirmText}
          </button>
        </div>
      );
  }

  static createFormGroup({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) {
      return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-(--color-text-primary)">
                {label}
            </label>
            {children}
            {error && <p className="text-xs text-(--color-danger) mt-1">{error}</p>}
        </div>
      );
  }

  static createScenarioCard({ scenario, isSelected, onClick, t }: ScenarioCardProps) {
    return (
      <div 
        key={scenario.id}
        onClick={onClick}
        className={`relative group p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
          isSelected 
          ? "border-(--color-primary) bg-(--color-primary-bg) shadow-[0_0_20px_-5px_var(--color-primary)]/10" 
          : "border-(--color-border) bg-(--color-surface) hover:border-(--color-text-muted)/30"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="text-base font-bold text-(--color-text-primary) m-0 truncate">
                {t(scenario.name)}
              </h5>
              <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-(--color-primary) text-white font-black uppercase">
                {t("government.scenarioManagement.activeModal.steps", { count: scenario.steps })}
              </span>
            </div>
            <p className="text-xs text-(--color-text-secondary) line-clamp-1 m-0">
              {t(scenario.description)}
            </p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected 
            ? "border-(--color-primary) bg-(--color-primary)" 
            : "border-(--color-border) bg-transparent"
          }`}>
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
          </div>
        </div>
      </div>
    );
  }
}
