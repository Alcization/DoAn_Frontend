import { apiClient } from '../api-config';

export type AlertMetric = 'temp' | 'feelslike' | 'precip' | 'precipprob';
export type AlertOperator = '>' | '>=' | '<' | '<=';
export type AlertScope = 'current' | 'forecast_24h';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AlertRule {
  rule_id: number;
  user_id: number;
  location_id: number;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  unit: string;
  scope: AlertScope;
  severity: AlertSeverity;
  cooldown_minutes: number;
  is_enabled: boolean;
  last_triggered_at: string | null;
  last_value: number | null;
  created_at: string;
}

export interface AlertRuleInput {
  location_id: number;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  unit?: string;
  scope?: AlertScope;
  severity?: AlertSeverity;
  cooldown_minutes?: number;
  is_enabled?: boolean;
}

export type AlertRulePatch = Partial<Omit<AlertRuleInput, 'location_id'>>;

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const listAlertRules = async (locationId?: number): Promise<AlertRule[]> => {
  const params = locationId != null ? { location_id: locationId } : undefined;
  const res = await apiClient.get<ApiEnvelope<AlertRule[]>>('/alerts/rules', { params });
  return res.data.data;
};

export const getAlertRule = async (ruleId: number): Promise<AlertRule> => {
  const res = await apiClient.get<ApiEnvelope<AlertRule>>(`/alerts/rules/${ruleId}`);
  return res.data.data;
};

export const createAlertRule = async (rule: AlertRuleInput): Promise<AlertRule> => {
  const res = await apiClient.post<ApiEnvelope<AlertRule>>('/alerts/rules', rule);
  return res.data.data;
};

export const updateAlertRule = async (
  ruleId: number,
  patch: AlertRulePatch,
): Promise<AlertRule> => {
  const res = await apiClient.patch<ApiEnvelope<AlertRule>>(`/alerts/rules/${ruleId}`, patch);
  return res.data.data;
};

export const deleteAlertRule = async (ruleId: number): Promise<void> => {
  await apiClient.delete(`/alerts/rules/${ruleId}`);
};
