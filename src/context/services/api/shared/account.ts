import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { USER_PROFILE_MOCK } from '../../mock/normal/shared/account';

export const getUserProfile = async () => {
  return handleRequest(
    () => apiClient.get('/user/profile').then(res => res.data),
    USER_PROFILE_MOCK
  );
};


export const updateUserProfile = async (profileData: any) => {
  return handleRequest(
    () => apiClient.put('/user/profile', profileData).then(res => res.data),
    { ...USER_PROFILE_MOCK, ...profileData }
  );
};

