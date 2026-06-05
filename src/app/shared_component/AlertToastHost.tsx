"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@/context/notification/NotificationContext";
import type { AlertFrame } from "@/services/api/alertSocket";
import {
  formatAlertBody,
  formatAlertTitle,
  formatRuleCondition,
} from "@/services/i18n/alertFormat";

const AUTO_DISMISS_MS: Record<AlertFrame["severity"], number | null> = {
  info: 6000,
  warning: 10000,
  critical: null,
};

const severityStyle: Record<AlertFrame["severity"], string> = {
  info: "border-[var(--color-info)] bg-[var(--color-info-bg)] text-[var(--color-info)]",
  warning:
    "border-[var(--color-warning)] bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  critical:
    "border-[var(--color-danger)] bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
};

const severityIcon = (severity: AlertFrame["severity"]) => {
  switch (severity) {
    case "critical":
      return <AlertCircle size={20} />;
    case "warning":
      return <AlertTriangle size={20} />;
    default:
      return <Info size={20} />;
  }
};

function ToastCard({ alert }: { alert: AlertFrame }) {
  const { t } = useTranslation();
  const { dismissLiveAlert } = useNotifications();
  const ttl = AUTO_DISMISS_MS[alert.severity];

  useEffect(() => {
    if (ttl == null) return;
    const t = setTimeout(() => dismissLiveAlert(alert.issued_at), ttl);
    return () => clearTimeout(t);
  }, [alert.issued_at, ttl, dismissLiveAlert]);

  const title = formatAlertTitle(t, alert);
  const body = formatAlertBody(t, alert);
  const condition = formatRuleCondition(
    t,
    alert.metric,
    alert.operator,
    alert.threshold,
    alert.unit,
  );

  return (
    <div
      role="alert"
      className={`pointer-events-auto w-80 max-w-[90vw] rounded-2xl border-l-4 bg-[var(--color-surface)] p-4 shadow-[var(--shadow-md)] ${severityStyle[alert.severity]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{severityIcon(alert.severity)}</div>
        <div className="flex-1 min-w-0">
          <p className="m-0 text-sm font-bold text-[var(--color-text-primary)]">
            {title}
          </p>
          <p className="m-0 mt-1 text-xs text-[var(--color-text-secondary)]">
            {body}
          </p>
          <p className="m-0 mt-2 text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
            {alert.location_name} · {condition}
          </p>
        </div>
        <button
          onClick={() => dismissLiveAlert(alert.issued_at)}
          aria-label={t("common.close", "Close")}
          className="rounded-md p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function AlertToastHost() {
  const { liveAlerts } = useNotifications();
  if (liveAlerts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex flex-col gap-2 print:hidden">
      {liveAlerts.map((alert) => (
        <ToastCard key={`${alert.rule_id}-${alert.issued_at}`} alert={alert} />
      ))}
    </div>
  );
}
