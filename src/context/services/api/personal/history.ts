import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { HISTORY_ITEMS, WEATHER_SEARCH_HISTORY } from '../../mock/normal/shared/history';

export const getTripHistory = async () => {
  return handleRequest(
    () => apiClient.get('/personal/history/trips').then(res => res.data),
    HISTORY_ITEMS
  );
};

export const getWeatherSearchHistory = async () => {
  return handleRequest(
    () => apiClient.get('/personal/history/weather-search').then(res => res.data),
    WEATHER_SEARCH_HISTORY
  );
};

