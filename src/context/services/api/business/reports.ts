import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { BUSINESS_ROUTES, WEATHER_DISTRIBUTION, REPORT_KPI_BASE } from '../../mock/normal/business/reports';

export const getBusinessRoutes = async () => {
  return handleRequest(
    () => apiClient.get('/business/routes').then(res => res.data),
    BUSINESS_ROUTES
  );
};


export const getWeatherFrequency = async () => {
  return handleRequest(
    () => apiClient.get('/business/weather-frequency').then(res => res.data),
    WEATHER_DISTRIBUTION
  );
};


export const getReportKPI = async (timeRange: string) => {
  return handleRequest(
    () => apiClient.get('/business/kpi', { params: { timeRange } }).then(res => res.data),
    REPORT_KPI_BASE
  );
};


