import { API_BASE_URL } from '../api-config';
import type { AlertMetric, AlertOperator, AlertScope, AlertSeverity } from './alertRules';

export interface AlertFrame {
  type: 'alert';
  title: string;
  body: string;
  severity: AlertSeverity;
  rule_id: number;
  location_id: number;
  location_name: string;
  metric: AlertMetric;
  operator: AlertOperator;
  threshold: number;
  value: number;
  unit: string;
  scope: AlertScope;
  issued_at: string;
}

export type SocketFrame =
  | AlertFrame
  | { type: 'connected' }
  | { type: 'pong' }
  | { type: string; [k: string]: unknown };

export const buildNotificationsSocketUrl = (token: string): string => {
  const httpBase = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
  const wsBase = httpBase.replace(/^http/, 'ws');
  return `${wsBase}/ws/notifications?token=${encodeURIComponent(token)}`;
};
