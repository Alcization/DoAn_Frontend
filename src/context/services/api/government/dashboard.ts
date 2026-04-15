import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { HEATMAP_AREAS, ALERT_TYPES, PIE_CHART_DATA, LINE_CHART_POINTS, RESPONSE_TIMELINE } from '../../mock/government/dashboard';

export const getDashboardSummary = async () => {
  return handleRequest(
    () => apiClient.get('/government/dashboard-summary').then(res => res.data),
    { HEATMAP_AREAS, ALERT_TYPES, PIE_CHART_DATA, LINE_CHART_POINTS, RESPONSE_TIMELINE }
  );
};

