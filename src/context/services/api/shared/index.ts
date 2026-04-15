import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';

// Placeholder for shared services like auth
export const login = async (credentials: any) => {
    // To integrate real API: Change endpoint or parameters in the first argument below
    return handleRequest(
        () => apiClient.post('/auth/login', credentials).then(res => res.data),
        { token: 'mock-token', user: { role: 'business' } }
    );
};

export * from './weather';
export * from './account';



