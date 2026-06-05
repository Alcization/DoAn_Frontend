"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Loader2, Plus, Trash2 } from "lucide-react";
import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "../shared_component/BaseModal";
import {
  createAlertRule,
  deleteAlertRule,
  listAlertRules,
  updateAlertRule,
  type AlertMetric,
  type AlertOperator,
  type AlertRule,
  type AlertScope,
  type AlertSeverity,
} from "@/services/api/alertRules";
import {
  defaultUnitFor,
  formatRuleCondition,
  metricLabel,
  scopeLabel,
  severityLabel,
} from "@/services/i18n/alertFormat";

type SetAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  location: { id: number; name: string } | null;
  onSave?: () => void;
};

const METRIC_VALUES: AlertMetric[] = ["temp", "feelslike", "precip", "precipprob"];
const OPERATORS: AlertOperator[] = [">", ">=", "<", "<="];
const SEVERITIES: AlertSeverity[] = ["info", "warning", "critical"];

interface DraftRule {
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: string;
  scope: AlertScope;
  severity: AlertSeverity;
  cooldown_minutes: number;
}

const defaultDraft = (): DraftRule => ({
  metric: "temp",
  operator: ">",
  threshold: "35",
  scope: "current",
  severity: "warning",
  cooldown_minutes: 60,
});

export default function SetAlertModal({ isOpen, onClose, location, onSave }: SetAlertModalProps) {
  const { t } = useTranslation();
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftRule>(defaultDraft());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const draftUnit = useMemo(() => defaultUnitFor(draft.metric), [draft.metric]);

  // precipprob is forecast-only per the backend constraint.
  useEffect(() => {
    if (draft.metric === "precipprob" && draft.scope !== "forecast_24h") {
      setDraft((d) => ({ ...d, scope: "forecast_24h" }));
    }
  }, [draft.metric, draft.scope]);

  useEffect(() => {
    if (!isOpen || !location?.id) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    listAlertRules(location.id)
      .then((data) => {
        if (!cancelled) setRules(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load rules");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, location?.id]);

  if (!location) return null;

  const handleCreate = async () => {
    const threshold = Number(draft.threshold);
    if (!Number.isFinite(threshold)) {
      setError("Threshold must be a number");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const created = await createAlertRule({
        location_id: location.id,
        metric: draft.metric,
        operator: draft.operator,
        threshold,
        scope: draft.scope,
        severity: draft.severity,
        cooldown_minutes: draft.cooldown_minutes,
      });
      setRules((prev) => [...prev, created]);
      setDraft(defaultDraft());
      onSave?.();
    } catch (err: any) {
      setError(err?.message ?? "Failed to create rule");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEnabled = async (rule: AlertRule) => {
    const next = !rule.is_enabled;
    setRules((prev) =>
      prev.map((r) => (r.rule_id === rule.rule_id ? { ...r, is_enabled: next } : r)),
    );
    try {
      await updateAlertRule(rule.rule_id, { is_enabled: next });
    } catch (err) {
      setRules((prev) =>
        prev.map((r) => (r.rule_id === rule.rule_id ? { ...r, is_enabled: rule.is_enabled } : r)),
      );
      setError("Failed to update rule");
    }
  };

  const removeRule = async (rule: AlertRule) => {
    const prev = rules;
    setRules((rs) => rs.filter((r) => r.rule_id !== rule.rule_id));
    try {
      await deleteAlertRule(rule.rule_id);
    } catch (err) {
      setRules(prev);
      setError("Failed to delete rule");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <ModalHeader
        title={t("personalPage.modals.alert.title")}
        subtitle={location.name}
        icon={<Bell size={20} className="text-[var(--color-warning)]" />}
        onClose={onClose}
        iconBgColor="bg-[var(--color-warning-bg)]"
      />

      <ModalBody>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100/50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Existing rules */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
            {t("notifications.rules.existing", "Active rules")}
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={18} className="animate-spin text-[var(--color-primary)]" />
            </div>
          ) : rules.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] py-2">
              {t("notifications.rules.empty", "No alert rules for this location yet.")}
            </p>
          ) : (
            <ul className="space-y-2">
              {rules.map((r) => (
                <li
                  key={r.rule_id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="m-0 text-sm font-medium text-[var(--color-text-primary)]">
                      {formatRuleCondition(t, r.metric, r.operator, r.threshold, r.unit)}
                    </p>
                    <p className="m-0 text-[11px] text-[var(--color-text-secondary)]">
                      {scopeLabel(t, r.scope)} · {severityLabel(t, r.severity)} ·{" "}
                      {t("notifications.rules.cooldownShort", "cooldown {{m}}m", { m: r.cooldown_minutes })}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleEnabled(r)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      r.is_enabled
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-border)]"
                    }`}
                    aria-label="Toggle rule"
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        r.is_enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => removeRule(r)}
                    aria-label="Delete rule"
                    className="p-1.5 rounded-md text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)]"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* New rule */}
        <section className="space-y-4 border-t border-[var(--color-border)] pt-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">
            {t("notifications.rules.newTitle", "Add a rule")}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
              {t("notifications.rules.metric", "Metric")}
              <select
                value={draft.metric}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, metric: e.target.value as AlertMetric }))
                }
                className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)]"
              >
                {METRIC_VALUES.map((m) => (
                  <option key={m} value={m}>
                    {metricLabel(t, m)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
              {t("notifications.rules.operator", "Operator")}
              <select
                value={draft.operator}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, operator: e.target.value as AlertOperator }))
                }
                className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)]"
              >
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)] col-span-2">
              {t("notifications.rules.threshold", "Threshold")}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={draft.threshold}
                  onChange={(e) => setDraft((d) => ({ ...d, threshold: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)]"
                />
                <span className="text-sm text-[var(--color-text-secondary)] w-10">
                  {draftUnit}
                </span>
              </div>
            </label>

            <div className="col-span-2 flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
              {t("notifications.rules.scope", "Scope")}
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { v: "current" as AlertScope, label: t("notifications.rules.scopeNow", "Now") },
                    {
                      v: "forecast_24h" as AlertScope,
                      label: t("notifications.rules.scope24h", "Next 24h"),
                    },
                  ]
                ).map((opt) => {
                  const disabled = draft.metric === "precipprob" && opt.v === "current";
                  const active = draft.scope === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      disabled={disabled}
                      onClick={() => setDraft((d) => ({ ...d, scope: opt.v }))}
                      className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                          : "bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-xs text-[var(--color-primary)] hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            {showAdvanced
              ? t("notifications.rules.hideAdvanced", "Hide advanced")
              : t("notifications.rules.showAdvanced", "Advanced")}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
                {t("notifications.rules.severity", "Severity")}
                <select
                  value={draft.severity}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, severity: e.target.value as AlertSeverity }))
                  }
                  className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)]"
                >
                  {SEVERITIES.map((s) => (
                    <option key={s} value={s}>
                      {severityLabel(t, s)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-[var(--color-text-secondary)]">
                {t("notifications.rules.cooldown", "Cooldown (min)")}
                <input
                  type="number"
                  min={1}
                  value={draft.cooldown_minutes}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      cooldown_minutes: Math.max(1, Number(e.target.value) || 1),
                    }))
                  }
                  className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-primary)]"
                />
              </label>
            </div>
          )}
        </section>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-medium text-sm hover:bg-[var(--color-bg-secondary)] transition-colors disabled:opacity-50"
        >
          {t("common.close", "Close")}
        </button>
        <button
          onClick={handleCreate}
          disabled={isSaving}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {t("notifications.rules.addBtn", "Add rule")}
        </button>
      </ModalFooter>
    </BaseModal>
  );
}
