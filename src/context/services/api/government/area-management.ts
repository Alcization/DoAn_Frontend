import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { MANAGED_AREAS } from '../../mock/government/area-management';

export const getGovernmentAreas = async () => {
  return handleRequest(
    () => apiClient.get('/government/areas').then(res => res.data),
    MANAGED_AREAS
  );
};

