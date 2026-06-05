import { apiClient } from '../api-config';

export interface PushSubscriptionRecord {
  subscription_id: number;
  endpoint: string;
  created_at: string;
  user_agent?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const getVapidPublicKey = async (): Promise<string> => {
  const res = await apiClient.get<ApiEnvelope<{ publicKey: string }>>(
    '/alerts/push-subscriptions/public-key',
  );
  return res.data.data.publicKey;
};

export const registerPushSubscription = async (
  subscription: PushSubscriptionJSON,
): Promise<void> => {
  await apiClient.post('/alerts/push-subscriptions', subscription);
};

export const listPushSubscriptions = async (): Promise<PushSubscriptionRecord[]> => {
  const res = await apiClient.get<ApiEnvelope<PushSubscriptionRecord[]>>(
    '/alerts/push-subscriptions',
  );
  return res.data.data;
};

export const deletePushSubscription = async (subscriptionId: number): Promise<void> => {
  await apiClient.delete(`/alerts/push-subscriptions/${subscriptionId}`);
};
