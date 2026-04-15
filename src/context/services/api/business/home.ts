import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { FAVORITE_ROUTES, FAVORITE_LOCATIONS, WEATHER_TIMELINE, WEEK_FORECAST } from '../../mock/normal/business/home';

export const getBusinessHomeData = async () => {
    return handleRequest(
        () => apiClient.get('/business/home').then(res => res.data),
        { FAVORITE_ROUTES, FAVORITE_LOCATIONS, WEATHER_TIMELINE, WEEK_FORECAST }
    );
};

export const updateBusinessProfile = async (data: any) => {
    return handleRequest(
        () => apiClient.put('/business/profile', data).then(res => res.data),
        { success: true }
    );
};

