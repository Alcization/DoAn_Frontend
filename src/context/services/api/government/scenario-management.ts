import { apiClient } from '@/services/api-config';
import { handleRequest } from '../utils';
import { SCENARIOS, Scenario } from '../../mock/government/scenario-management';

export const getGovernmentScenarios = async () => {
  // To integrate real API: Change endpoint or parameters in the first argument below
  return handleRequest(
    () => apiClient.get('/government/scenarios').then(res => res.data),
    SCENARIOS
  );
};

type ResponseScenarioPriority = 'high' | 'medium' | 'low';

type ResponseScenarioStep = {
  id: number;
  scenario_id: number;
  step: number;
  content: string;
  priority: ResponseScenarioPriority;
};

type ResponseScenarioItem = {
  scenario_id: number;
  user_id: number;
  name: string;
  applicable_event_type: string;
  steps: ResponseScenarioStep[];
};

type GetResponseScenariosApiResponse = {
  success: boolean;
  data: ResponseScenarioItem[];
};

type CreateResponseScenarioPayload = {
  name: string;
  applicable_event_type: string;
  steps: Array<{
    step: number;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }>;
};

type CreateResponseScenarioApiResponse = {
  success: boolean;
  data: ResponseScenarioItem;
};

type UpdateResponseScenarioPayload = {
  name?: string;
  applicable_event_type?: string;
  steps?: Array<{
    step: number;
    content: string;
    priority: 'high' | 'medium' | 'low';
  }>;
};

type UpdateResponseScenarioApiResponse = {
  success: boolean;
  data: ResponseScenarioItem;
};

type DeleteResponseScenarioApiResponse = {
  success: boolean;
  message: string;
};

const inferScenarioType = (eventTypeText: string): Scenario['type'] => {
  const normalized = eventTypeText.toLowerCase();
  if (normalized.includes('ngập') || normalized.includes('lụt') || normalized.includes('flood')) return 'flood';
  if (normalized.includes('bão') || normalized.includes('giông') || normalized.includes('storm')) return 'storm';
  if (normalized.includes('cháy') || normalized.includes('hỏa') || normalized.includes('hoả') || normalized.includes('fire')) return 'fire';
  if (normalized.includes('động đất') || normalized.includes('earthquake')) return 'earthquake';
  return 'storm';
};

const toUiPriority = (priority: ResponseScenarioPriority): 'High' | 'Medium' | 'Low' => {
  if (priority === 'high') return 'High';
  if (priority === 'medium') return 'Medium';
  return 'Low';
};

export const mapResponseScenarioToScenario = (item: ResponseScenarioItem): Scenario => {
  const checklist = item.steps.map((step) => ({
    id: step.id,
    step: step.step,
    description: step.content,
    priority: toUiPriority(step.priority),
  }));

  return {
    id: item.scenario_id,
    name: item.name,
    type: inferScenarioType(item.applicable_event_type),
    status: 'active',
    description: item.applicable_event_type,
    steps: checklist.length,
    lastUpdate: new Date().toISOString(),
    author: `User ${item.user_id}`,
    usageCount: 0,
    checklist,
  };
};

export const getGovernmentResponseScenarios = async (params?: {
  name?: string;
  applicable_event_type?: string;
}): Promise<Scenario[]> => {
  const response = await apiClient
    .get<GetResponseScenariosApiResponse>('/response-scenarios', { params })
    .then((res) => res.data);

  return response.data.map(mapResponseScenarioToScenario);
};

/**
 * Fetch a single response scenario by ID
 */
export const getGovernmentResponseScenarioById = async (scenarioId: number): Promise<Scenario | null> => {
  try {
    const response = await apiClient
      .get<GetResponseScenariosApiResponse>('/response-scenarios', { params: { scenario_id: scenarioId } })
      .then((res) => res.data);
    
    // Filter to find the exact scenario with matching ID
    if (response.data && response.data.length > 0) {
      const matchedScenario = response.data.find(s => s.scenario_id === scenarioId);
      if (matchedScenario) {
        return mapResponseScenarioToScenario(matchedScenario);
      }
    }
    
    // Fallback to mock data if API doesn't return the scenario
    console.warn(`Scenario ${scenarioId} not found from API, using mock data`);
    const mockScenario = SCENARIOS.find(s => s.id === scenarioId);
    return mockScenario || null;
  } catch (error) {
    console.error('Failed to fetch scenario by ID, falling back to mock data:', error);
    // Fallback to mock data on API error
    const mockScenario = SCENARIOS.find(s => s.id === scenarioId);
    return mockScenario || null;
  }
};

const normalizePriority = (value: string): 'high' | 'medium' | 'low' => {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high' || normalized === 'cao') return 'high';
  if (normalized === 'medium' || normalized === 'trung_binh' || normalized === 'trung bình') return 'medium';
  if (normalized === 'low' || normalized === 'thap' || normalized === 'thấp') return 'low';
  return 'medium';
};

export const toCreateResponseScenarioPayload = (scenario: Scenario): CreateResponseScenarioPayload => ({
  name: scenario.name,
  applicable_event_type: scenario.description,
  steps: scenario.checklist.map((item) => ({
    step: item.step,
    content: item.description,
    priority: normalizePriority(item.priority),
  })),
});

export const toUpdateResponseScenarioPayload = (scenario: Scenario): UpdateResponseScenarioPayload => ({
  name: scenario.name,
  applicable_event_type: scenario.description,
  steps: scenario.checklist.map((item) => ({
    step: item.step,
    content: item.description,
    priority: normalizePriority(item.priority),
  })),
});

export const createGovernmentResponseScenario = async (
  payload: CreateResponseScenarioPayload
): Promise<CreateResponseScenarioApiResponse> => {
  return apiClient.post('/response-scenarios', payload).then((res) => res.data);
};

export const updateGovernmentResponseScenario = async (
  id: number,
  payload: UpdateResponseScenarioPayload
): Promise<UpdateResponseScenarioApiResponse> => {
  return apiClient.put(`/response-scenarios/${id}`, payload).then((res) => res.data);
};

export const deleteGovernmentResponseScenario = async (
  id: number
): Promise<DeleteResponseScenarioApiResponse> => {
  return apiClient.delete(`/response-scenarios/${id}`).then((res) => res.data);
};
