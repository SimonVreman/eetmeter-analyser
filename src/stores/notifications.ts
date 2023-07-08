import { writable, derived } from 'svelte/store';
import type { Message } from '../types/notifications';

const TIMEOUT = 5000;

function createNotificationStore() {
	const _notifications = writable([]);

	const { subscribe } = derived(_notifications, ($_notifications, set) => {
		set($_notifications);
		if ($_notifications.length > 0) {
			const timer = setTimeout(() => {
				_notifications.update((state) => {
					state.shift();
					return state;
				});
			}, TIMEOUT);
			return () => {
				clearTimeout(timer);
			};
		}
	});

	return {
		subscribe,
		send: (m: Message) => {
			_notifications.update((state) => {
				return [...state, m];
			});
		}
	};
}

export const notifications = createNotificationStore();
