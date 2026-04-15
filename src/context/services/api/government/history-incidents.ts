import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { INCIDENTS, Incident, IncidentType, IncidentSeverity } from '../../mock/government/history-incidents';

interface AlertEventApiResponse {
    alert_event_id: number;
    name: string;
    type: string;
    description: string;
    issue_at: string;
    area_id: number;
    area_name: string;
    scenario_id: number | null;
    level: string;
    user_id: number;
    UserAccount: {
        user_id: number;
        username: string;
        email: string;
    };
    ResponseScenario: {
        scenario_id: number;
        name: string;
        applicable_event_type: string;
    } | null;
}

interface GetAlertsQueryParams {
    type?: string;
    level?: string;
    area_id?: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
}

/**
 * Normalize alert type to IncidentType format
 */
const normalizeAlertType = (alertType: string): IncidentType => {
    const normalized = alertType.toLowerCase().trim();
    if (normalized === 'flood' || normalized === 'ngập') return 'flood';
    if (normalized === 'rain' || normalized === 'mưa') return 'rain';
    if (normalized === 'storm' || normalized === 'bão') return 'storm';
    if (normalized === 'traffic' || normalized === 'giao thông') return 'traffic';
    return 'traffic'; // default fallback
};

/**
 * Normalize alert level to IncidentSeverity format
 */
const normalizeAlertLevel = (alertLevel: string): IncidentSeverity => {
    const normalized = alertLevel.toLowerCase().trim();
    if (normalized === 'high' || normalized === 'cao') return 'High';
    if (normalized === 'medium' || normalized === 'trung bình') return 'Medium';
    if (normalized === 'low' || normalized === 'thấp') return 'Low';
    return 'Medium'; // default fallback
};

/**
 * Format ISO date to display format
 */
const formatDateToDisplay = (isoDate: string): string => {
    try {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
        return new Date().toLocaleString();
    }
};

/**
 * Map API alert event to Incident type
 */
const mapAlertEventToIncident = (alertEvent: AlertEventApiResponse): Incident => {
    return {
        id: alertEvent.alert_event_id,
        time: formatDateToDisplay(alertEvent.issue_at),
        area: alertEvent.area_name,
        location: alertEvent.name,
        type: normalizeAlertType(alertEvent.type),
        severity: normalizeAlertLevel(alertEvent.level),
        status: alertEvent.scenario_id ? 'Handled' : 'Pending',
        description: alertEvent.description,
        actions: [],
        scenarioId: alertEvent.scenario_id || null,
    };
};

/**
 * Fetch all alert events from /admin/alerts endpoint
 */
export const getGovernmentIncidentHistory = async (params?: GetAlertsQueryParams): Promise<Incident[]> => {
    try {
        const response = await apiClient.get<AlertEventApiResponse[]>('/admin/alerts', { params });
        return response.data.map(mapAlertEventToIncident);
    } catch (error) {
        console.error('Failed to fetch alerts from API, falling back to mock data:', error);
        // Fallback to mock data
        return INCIDENTS;
    }
};

/**
 * Update alert event with selected response scenario
 */
export const updateAlertEventScenario = async (alertEventId: number, scenarioId: number): Promise<void> => {
    try {
        await apiClient.put(`/admin/alerts/${alertEventId}`, { scenario_id: scenarioId });
    } catch (error) {
        console.error('Failed to update alert event with scenario:', error);
        throw error;
    }
};
