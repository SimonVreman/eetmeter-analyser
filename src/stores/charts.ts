import { derived, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getTotalMacros, getCaloricHistory, getFullDomain } from '../lib/chart-data';
import type { CachedChartData, DataPoint } from '../types/charts';

function cachedStore<T>(key: string, dataLoader: () => Promise<T>): CachedChartData {
	if (!browser) {
		const w = writable([]);
		return {
			subscribe: w.subscribe,
			set: w.set,
			reload: () => {
				return;
			}
		};
	}

	const cacheKey = `cache:chart:${key}`;
	const stored = localStorage.getItem(cacheKey);
	const _store = writable(stored ? JSON.parse(stored) : []);

	const loader = () =>
		dataLoader().then((result) => {
			_store.set(result);
			localStorage.setItem(cacheKey, JSON.stringify(result));
		});

	if (!stored) loader();

	return {
		subscribe: _store.subscribe,
		set: (v) => {
			localStorage.setItem(cacheKey, JSON.stringify(v));
			return _store.set(v);
		},
		reload: loader
	};
}

export const caloricHistory = cachedStore<DataPoint[]>('caloric-history', getCaloricHistory);
export const domain = cachedStore<number[]>('domain', getFullDomain);
export const totalMacros = derived(domain, (domain, set) => {
	set([]);
	if (!browser) return;
	const [start, end]: [number, number] = domain;
	getTotalMacros(new Date(start), new Date(end)).then(set);
});

const cached: CachedChartData[] = [caloricHistory, domain];

export function clearChartCache() {
	const toRemove: string[] = [];
	for (const key in localStorage) if (key.startsWith('cache:charts')) toRemove.push(key);
	toRemove.forEach((key) => localStorage.removeItem(key));
	cached.forEach((s) => s.reload());
}
