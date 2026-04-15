import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { FAVORITE_ROUTES_MOCK } from '../../mock/normal/shared/business';

export const getFavoriteRoutes = async () => {
    return handleRequest(
        () => apiClient.get('/business/favorite-routes').then(res => res.data),
        FAVORITE_ROUTES_MOCK
    );
};

export const addFavoriteRoute = async (route: any) => {
    return handleRequest(
        () => apiClient.post('/business/favorite-routes', route).then(res => res.data),
        { success: true, id: Date.now() }
    );
};

export const deleteFavoriteRoute = async (id: number) => {
    return handleRequest(
        () => apiClient.delete(`/business/favorite-routes/${id}`).then(res => res.data),
        { success: true }
    );
};
