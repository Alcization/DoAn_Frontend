import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { REPORT_HISTORY, REPORT_TOPICS } from '../../mock/government/reports';

export const getGovernmentReportHistory = async () => {
    return handleRequest(
        () => apiClient.get('/government/reports/history').then(res => res.data),
        REPORT_HISTORY
    );
};


export const getGovernmentReportTopics = async () => {
    return handleRequest(
        () => apiClient.get('/government/reports/topics').then(res => res.data),
        REPORT_TOPICS
    );
};

