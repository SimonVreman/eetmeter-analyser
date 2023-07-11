import { db } from './db';
import { NutrientType } from '../types/schema';
import { calculateCorrectedAverage, fillEmptyDays } from './charts';
import type { DataPoint } from '../types/charts';
import dayjs from 'dayjs';

export async function getCaloricHistory(): Promise<DataPoint[]> {
	const productHistory: Map<number, { product: number; grams: number }[]> = new Map();
	return db.consumptions
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
			const caloricHistory: DataPoint[] = [];
			productHistory.forEach((points: { grams: number; product: number }[], date: number) => {
				const value = points.reduce((sum, p) => {
					const energy = productEnergy.find((e) => e.productId === p.product);
					return sum + (energy ? (p.grams * energy.per100Gram) / 100 : 0);
				}, 0);
				caloricHistory.push({ group: 'caloric history', date: new Date(date), value });
			});
			return caloricHistory;
		})
		.then(fillEmptyDays)
		.then(calculateCorrectedAverage);
}

export async function getFullDomain(): Promise<number[]> {
	return Promise.all([
		db.consumptions
			.orderBy('date')
			.first()
			.then((c) => c?.date.getTime() ?? dayjs().subtract(1, 'day').get('second')),
		db.consumptions
			.orderBy('date')
			.last()
			.then((c) => c?.date.getTime() ?? new Date().getTime())
	]);
}
