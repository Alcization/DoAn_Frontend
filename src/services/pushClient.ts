import {
  getVapidPublicKey,
  registerPushSubscription,
} from './api/pushSubscriptions';

const SW_PATH = '/sw.js';

const urlBase64ToUint8Array = (base64: string): ArrayBuffer => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Std = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64Std);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out.buffer;
};

export const pushSupported = (): boolean =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

export const currentPermission = (): NotificationPermission => {
  if (typeof Notification === 'undefined') return 'denied';
  return Notification.permission;
};

export const ensureServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  const existing = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (existing) return existing;
  const reg = await navigator.serviceWorker.register(SW_PATH);
  await navigator.serviceWorker.ready;
  return reg;
};

export const enablePushNotifications = async (): Promise<void> => {
  if (!pushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const reg = await ensureServiceWorker();

  const existingSub = await reg.pushManager.getSubscription();
  if (existingSub) {
    await registerPushSubscription(existingSub.toJSON());
    return;
  }

  const publicKey = await getVapidPublicKey();
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });
  await registerPushSubscription(subscription.toJSON());
};

export const disablePushOnThisDevice = async (): Promise<void> => {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (!reg) return;
  const sub = await reg.pushManager.getSubscription();
  if (sub) await sub.unsubscribe();
};
