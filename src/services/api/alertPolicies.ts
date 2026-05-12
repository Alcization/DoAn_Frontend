import { apiClient, buildApiUrl } from '../api-config';

export interface AlertPolicy {
  policy_id?: number;
  user_id?: number;
  start_hour: string;
  end_hour: string;
  id: number;
  effect_time?: number;
  temp_threshold?: number | null;
  traffic_threshold?: 'Moderate' | 'Heavy' | null;
}

/**
 * Get all alert policies for the authenticated user
 */
export const getAlertPolicies = async (): Promise<AlertPolicy[]> => {
  try {
    const response = await apiClient.get<AlertPolicy[]>(
      buildApiUrl('/business/policies')
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch alert policies:', error);
    throw error;
  }
};

/**
 * Create or update an alert policy for the authenticated user
 */
export const createOrUpdateAlertPolicy = async (
  policy: AlertPolicy
): Promise<AlertPolicy> => {
  try {
    const response = await apiClient.post<AlertPolicy>(
      buildApiUrl('/business/policies'),
      policy
    );
    return response.data;
  } catch (error) {
    console.error('Failed to create/update alert policy:', error);
    throw error;
  }
};

/**
 * Get existing policy for a specific location/route
 */
export const getAlertPolicyById = async (id: number): Promise<AlertPolicy | null> => {
  try {
    const policies = await getAlertPolicies();
    const policy = policies.find(p => p.id === id);
    return policy || null;
  } catch (error) {
    console.error('Failed to fetch policy for id:', id, error);
    return null;
  }
};
