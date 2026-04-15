import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { FAVORITE_LOCATIONS_MOCK } from '../../mock/normal/shared/personal';

export const getFavoriteLocations = async () => {
  return handleRequest(
    () => apiClient.get('/personal/favorite-locations').then(res => res.data),
    FAVORITE_LOCATIONS_MOCK
  );
};

export const updateFavoriteLocations = async (locations: any[]) => {
  return handleRequest(
    () => apiClient.put('/personal/favorite-locations', { locations }).then(res => res.data),
    locations
  );
};

