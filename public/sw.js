/* Service Worker for Web Push (location alert) */

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
	let payload = {};
	try {
		payload = event.data ? event.data.json() : {};
	} catch (_) {
		payload = {};
	}

	const title = payload.title || 'Weather alert';
	const options = {
		body: payload.body || '',
		icon: '/icons/alert-192.png',
		badge: '/icons/alert-72.png',
		data: payload,
		tag: `alert-${payload.rule_id || 'generic'}`,
		renotify: true,
		requireInteraction: payload.severity === 'critical',
	};
	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const data = event.notification.data || {};
	const targetUrl = data.location_id
		? `/normal/persona?location=${data.location_id}`
		: '/normal/persona';

	event.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if ('focus' in client) {
					client.navigate(targetUrl).catch(() => { });
					return client.focus();
				}
			}
			return self.clients.openWindow(targetUrl);
		}),
	);
});
