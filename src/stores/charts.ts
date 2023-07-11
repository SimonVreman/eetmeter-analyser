import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { db } from '../lib/db';
import { NutrientType } from '../types/schema';
import { average, fillEmptyDays } from '../lib/charts';

function createCaloricHistoryStore() {
	if (!browser) return writable([]);
	const stored = localStorage.getItem('cache:charts:caloricHistory');
	const _caloricHistory = writable(stored ? JSON.parse(stored) : []);

	if (stored) return _caloricHistory;

	const productHistory: Map<number, { product: number; grams: number }[]> = new Map();
	const caloricHistory: { group: string; date: Date; value: number }[] = [];
	db.consumptions
		.orderBy('date')
		.each((c) => {
			const point = { product: c.productId, grams: c.grams };
			const key = c.date.getTime();
			productHistory.has(key)
				? productHistory.get(key).push(point)
				: productHistory.set(key, [point]);
		})
		.then(() => db.productNutrients.where('nutrientId').equals(NutrientType.ENERGY).toArray())
		.then((productEnergy) => {
			productHistory.forEach((points, date) => {
				const value = points.reduce((sum, p) => {
					const energy = productEnergy.find((e) => e.productId === p.product);
					return sum + (energy ? (p.grams * energy.per100Gram) / 100 : 0);
				}, 0);
				caloricHistory.push({ group: 'caloric history', date: new Date(date), value });
			});
			return caloricHistory;
		})
		.then(fillEmptyDays)
		.then((history) => {
			_caloricHistory.set(history);
			localStorage.setItem('cache:charts:caloricHistory', JSON.stringify(history));
		});

	return _caloricHistory;
}

export const caloricHistory = createCaloricHistoryStore();
