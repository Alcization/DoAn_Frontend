import { useTranslation } from "react-i18next";
import { AlertTriangle, Play, CheckCircle2 } from "lucide-react";
import { Incident } from "../../../context/services/mock/government/history-incidents";
import { useState, useEffect } from "react";
import ActivateScenarioModal from "../modal/ActivateScenarioModal";
import { Scenario } from "../../../context/services/mock/government/scenario-management";
import { SEVERITY_STRATEGY, STATUS_STRATEGY } from "./history-logic/HistoryStrategies";
import { getGovernmentResponseScenarioById } from "../../../context/services/api/government/scenario-management";

interface HistoryDetailProps {
  incident: Incident | null;
}

/**
 * [STRATEGY PATTERN] - HistoryDetail: Displays incident details using styling strategies.
 */
export default function HistoryDetail({ incident }: HistoryDetailProps) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activatedScenario, setActivatedScenario] = useState<Scenario | null>(null);

  // Auto-load activated scenario when incident has scenarioId
  useEffect(() => {
    if (incident?.scenarioId) {
      const loadScenario = async () => {
        try {
          const scenario = await getGovernmentResponseScenarioById(incident.scenarioId as number);
          if (scenario) {
            setActivatedScenario(scenario);
          }
        } catch (error) {
          console.error("Failed to load scenario:", error);
          setActivatedScenario(null);
        }
      };
      loadScenario();
    } else {
      setActivatedScenario(null);
    }
  }, [incident?.id, incident?.scenarioId]);

  const handleActivate = (scenario: Scenario) => {
    setActivatedScenario(scenario);
  };

  return (
    <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-(--color-text-primary)">
            <AlertTriangle size={18} className="text-(--color-primary)" />
            <h3 className="m-0 text-(--text-lg) font-semibold">{t("alertHistory.detail.title")}</h3>
          </div>
          {incident?.status === "Pending" && !activatedScenario && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--color-primary) text-white text-xs font-bold shadow-lg shadow-(--color-primary)/20 hover:scale-[1.05] active:scale-[0.95] transition-all"
            >
              <Play size={14} fill="currentColor" />
              {t("government.scenarioManagement.activeModal.title")}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {incident ? (
            <div className="space-y-4 text-(--color-text-secondary)">
                <p className="text-(--color-text-muted) font-semibold uppercase">
                {incident.time}
                </p>
                <h2 className="text-(--text-2xl) font-bold leading-tight">
                {incident.location}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-(--text-xs)">
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${SEVERITY_STRATEGY[incident.severity].className}`}
                >
                    {t("alertHistory.filter.severity")}: {t(`alertHistory.severity.${incident.severity}`)}
                </span>
                <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${
                      activatedScenario ? STATUS_STRATEGY.Handled.className : STATUS_STRATEGY[incident.status].className
                    }`}
                >
                    {activatedScenario ? t("alertHistory.status.Handled") : t(`alertHistory.status.${incident.status}`)}
                </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-2 border-y border-(--color-border)">
                    <div>
                        <p className="text-(--color-text-muted) mb-1">{t("alertHistory.detail.area")}</p>
                        <p className="font-semibold text-(--color-text-primary)">{incident.area}</p>
                    </div>
                    <div>
                        <p className="text-(--color-text-muted) mb-1">{t("alertHistory.detail.type")}</p>
                        <p className="font-semibold text-(--color-text-primary)">{t(`alertHistory.type.${incident.type}`)}</p>
                    </div>
                </div>

                <div>
                <p className="text-(--color-text-muted) mb-1">{t("alertHistory.detail.desc")}</p>
                <p className="text-(--color-text-primary)"> {incident.description}</p>
                </div>

                <div>
                <p className="font-bold text-(--color-text-primary) mb-2 flex items-center justify-between">
                    <span>{t("alertHistory.detail.response")}</span>
                    {activatedScenario && (
                      <span className="text-(--text-xs) font-bold px-2 py-0.5 rounded-lg bg-(--color-primary-bg) text-(--color-primary) border border-(--color-primary)/10">
                        {t(activatedScenario.name)}
                      </span>
                    )}
                </p>
                <ul className="space-y-2">
                    {incident.actions.map((action, idx) => (
                    <li key={`action-${idx}`} className="flex items-start gap-3 bg-(--color-bg) p-3 rounded-xl border border-(--color-border) opacity-60">
                        <CheckCircle2 size={16} className="text-(--color-text-muted) mt-0.5 shrink-0" />
                        <span>{action}</span>
                    </li>
                    ))}
                    
                    {activatedScenario?.checklist.map((step, idx) => (
                    <li 
                      key={`scenario-${idx}`} 
                      className="flex items-start gap-3 bg-(--color-primary-bg)/30 p-3 rounded-xl border border-(--color-primary)/10 animate-in fade-in slide-in-from-top-2 duration-300"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="mt-1 h-5 w-5 rounded-full border-2 border-(--color-primary) flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-black text-(--color-primary)">{step.step}</span>
                        </div>
                        <div>
                          <p className="m-0 font-semibold text-(--color-text-primary)">{t(step.description)}</p>
                          <span className={`text-[10px] font-bold uppercase ${
                            step.priority === 'High' ? 'text-(--color-danger)' : 'text-(--color-warning)'
                          }`}>
                            {t("scenarioManagement.checklist.priority")}: {t(`scenarioManagement.priority.${step.priority}`)}
                          </span>
                        </div>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            ) : (
            <p className="text-(--color-text-muted) italic">
                {t("alertHistory.detail.noSelection")}
            </p>
            )}
        </div>

        <ActivateScenarioModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          incident={incident}
          onActivate={handleActivate}
        />
    </div>
  );
}
