import { apiClient } from '../api-config';

export interface NotiEvent {
  noti_event_id: number;
  user_id: number;
  name: string;
  description: string;
  type: string;
  issue_at: string;
  is_read: boolean;
}

export interface NotiEventsResponse {
  success: boolean;
  data: NotiEvent[];
  total: number;
  limit: number;
  offset: number;
}

export const listNotiEvents = async (
  limit = 50,
  offset = 0,
): Promise<NotiEventsResponse> => {
  const res = await apiClient.get<NotiEventsResponse>('/alerts/events', {
    params: { limit, offset },
  });
  return res.data;
};

export const markEventRead = async (eventId: number): Promise<void> => {
  await apiClient.patch(`/alerts/events/${eventId}/read`);
};

export const markAllEventsRead = async (): Promise<void> => {
  await apiClient.patch('/alerts/events/read-all');
};
