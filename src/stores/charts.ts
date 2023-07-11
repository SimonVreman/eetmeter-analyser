import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getCaloricHistory, getFullDomain } from '../lib/chart-data';
import type { CachedChartDate } from '../types/charts';

function cachedStore(key: string, dataLoader: () => Promise<never>): CachedChartDate {
	if (!browser)
		return {
			subscribe: writable([]).subscribe,
			reload: () => {
				return;
			}
		};

	const stored = localStorage.getItem('cache:charts:' + key);
	const _store = writable(stored ? JSON.parse(stored) : []);

	const loader = () =>
		dataLoader().then((result) => {
			_store.set(result);
			localStorage.setItem('cache:charts:' + key, JSON.stringify(result));
		});

	if (!stored) loader();

	return {
		subscribe: _store.subscribe,
		reload: loader
	};
}

export const caloricHistory = cachedStore('caloric-history', getCaloricHistory);
export const domain = cachedStore('domain', getFullDomain);

const cached: CachedChartDate[] = [caloricHistory, domain];

export function clearChartCache() {
	const toRemove: string[] = [];
	for (const key in localStorage) if (key.startsWith('cache:charts')) toRemove.push(key);
	toRemove.forEach((key) => localStorage.removeItem(key));
	cached.forEach((s) => s.reload());
}
