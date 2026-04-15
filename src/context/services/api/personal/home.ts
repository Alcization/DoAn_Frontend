import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { FAVORITE_ROUTES, FAVORITE_LOCATIONS, WEATHER_TIMELINE, WEEK_FORECAST } from '../../mock/normal/personal/home';

export const getPersonalHomeData = async () => {
  return handleRequest(
    () => apiClient.get('/personal/home').then(res => res.data),
    { FAVORITE_ROUTES, FAVORITE_LOCATIONS, WEATHER_TIMELINE, WEEK_FORECAST }
  );
};

