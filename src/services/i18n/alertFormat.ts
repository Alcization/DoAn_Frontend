import type { TFunction } from "i18next";
import type {
  AlertMetric,
  AlertScope,
  AlertSeverity,
} from "@/services/api/alertRules";
import type { AlertFrame } from "@/services/api/alertSocket";

export const formatUnit = (unit?: string | null): string => {
  if (!unit) return "";
  const u = unit.trim();
  if (u === "C" || u === "c") return "°C";
  if (u === "F" || u === "f") return "°F";
  return u;
};

export const defaultUnitFor = (metric: AlertMetric): string => {
  if (metric === "temp" || metric === "feelslike") return "°C";
  if (metric === "precip") return "mm";
  return "%";
};

export const metricLabel = (t: TFunction, metric: AlertMetric): string =>
  t(`notifications.metrics.${metric}`, metric);

export const severityLabel = (t: TFunction, sev: AlertSeverity): string =>
  t(`notifications.severities.${sev}`, sev);

export const scopeLabel = (t: TFunction, scope: AlertScope): string =>
  t(`notifications.scopes.${scope}`, scope);

const num = (v: number): string =>
  Number.isInteger(v) ? String(v) : v.toFixed(1);

export const formatAlertTitle = (t: TFunction, frame: AlertFrame): string =>
  t("notifications.alert.title", {
    metric: metricLabel(t, frame.metric),
    location: frame.location_name,
    defaultValue: `${metricLabel(t, frame.metric)} alert: ${frame.location_name}`,
  });

export const formatAlertBody = (t: TFunction, frame: AlertFrame): string => {
  const unit = formatUnit(frame.unit) || defaultUnitFor(frame.metric);
  return t("notifications.alert.body", {
    metric: metricLabel(t, frame.metric),
    value: `${num(frame.value)}${unit}`,
    operator: frame.operator,
    threshold: `${num(frame.threshold)}${unit}`,
    defaultValue: `${metricLabel(t, frame.metric)} is ${num(frame.value)}${unit} (${frame.operator} ${num(frame.threshold)}${unit}).`,
  });
};

const EN_METRIC_TO_KEY: Record<string, AlertMetric> = {
  temperature: "temp",
  "feels like": "feelslike",
  rainfall: "precip",
  "rain probability": "precipprob",
};

const findMetric = (englishWord: string): AlertMetric | null => {
  const k = englishWord.trim().toLowerCase();
  return EN_METRIC_TO_KEY[k] ?? null;
};

const TITLE_RE = /^(Temperature|Feels like|Rainfall|Rain probability) alert:\s*(.+)$/i;
const BODY_RE =
  /^(Temperature|Feels like|Rainfall|Rain probability) is\s*([\d.]+)\s*([°a-zA-Z%]+)\s*\((>=|<=|>|<)\s*([\d.]+)\s*([°a-zA-Z%]+)\)\.?$/i;


export const localizeAlertName = (t: TFunction, name: string): string => {
  const m = name.match(TITLE_RE);
  if (!m) return name;
  const metric = findMetric(m[1]);
  if (!metric) return name;
  return t("notifications.alert.title", {
    metric: metricLabel(t, metric),
    location: m[2].trim(),
    defaultValue: name,
  });
};

export const localizeAlertDescription = (t: TFunction, body: string): string => {
  const m = body.match(BODY_RE);
  if (!m) return body;
  const metric = findMetric(m[1]);
  if (!metric) return body;
  const value = `${m[2]}${formatUnit(m[3])}`;
  const threshold = `${m[5]}${formatUnit(m[6])}`;
  return t("notifications.alert.body", {
    metric: metricLabel(t, metric),
    value,
    operator: m[4],
    threshold,
    defaultValue: body,
  });
};


export const formatRuleCondition = (
  t: TFunction,
  metric: AlertMetric,
  operator: string,
  threshold: number,
  unit?: string | null,
): string => {
  const u = formatUnit(unit) || defaultUnitFor(metric);
  return `${metricLabel(t, metric)} ${operator} ${num(threshold)}${u}`;
};
