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
			.then((c) => c?.date.getTime() ?? dayjs().subtract(1, 'day').valueOf()),
		db.consumptions
			.orderBy('date')
			.last()
			.then((c) => c?.date.getTime() ?? new Date().getTime())
	]);
}

export async function getTotalMacros(start: Date, end: Date): Promise<DataPoint[]> {
	const productHistory: { product: number; grams: number }[] = [];
	const counts = {
		[NutrientType.PROTEIN]: 0,
		[NutrientType.FAT]: 0,
		[NutrientType.CARBOHYDRATES]: 0
	};
	return db.consumptions
		.where('date')
		.between(start, end)
		.each((c) => {
			productHistory.push({ product: c.productId, grams: c.grams });
		})
		.then(() =>
			db.productNutrients
				.where('nutrientId')
				.anyOf([NutrientType.FAT, NutrientType.CARBOHYDRATES, NutrientType.PROTEIN])
				.toArray()
		)
		.then((productNutrients) => {
			productHistory.forEach((p) => {
				const nutrients = productNutrients.filter((e) => e.productId === p.product);
				nutrients.forEach((n) => {
					counts[n.nutrientId] +=
						((p.grams * n.per100Gram) / 100) * (n.nutrientId === NutrientType.FAT ? 9 : 4);
				});
			});
			return db.nutrients.toArray().then((nutrients) => {
				return Object.keys(counts).map((id) => ({
					group: nutrients[id].name,
					value: counts[id]
				}));
			});
		});
}
