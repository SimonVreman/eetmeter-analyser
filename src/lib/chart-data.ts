import { db } from './db';
import { NutrientType } from '../types/schema';
import { calculateCorrectedAverage, fillEmptyDays } from './charts';
import type { DataPoint, TreeMapPoint } from '../types/charts';
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
					group: nutrients.find((n) => n.id === +id).name,
					value: counts[+id]
				}));
			});
		});
}

export async function getBrandMap(start: Date, end: Date): Promise<TreeMapPoint[]> {
	const counts: Map<string, Map<string, { name: string; value: number }>> = new Map();
	const productGrams: Map<number, number> = new Map();
	await db.consumptions
		.where('date')
		.between(start, end)
		.each((c) => {
			productGrams.has(c.productId)
				? productGrams.set(c.productId, productGrams.get(c.productId) + c.grams)
				: productGrams.set(c.productId, c.grams);
		});
	const totalApproximation = await db.consumptions.count();
	const labelThreshold = totalApproximation * 0.001;
	return db.products
		.where('id')
		.anyOf([...productGrams.keys()])
		.each((p) => {
			const brand = p.brand ?? 'Algemeen';
			if (!counts.has(brand)) counts.set(brand, new Map());
			const brandMap = counts.get(brand);
			const productKey = p.nevo ? `${p.nevo}` : p.guid;
			if (!brandMap.has(productKey)) {
				brandMap.set(productKey, { name: p.name, value: productGrams.get(p.id ?? -1) ?? 0 });
			} else {
				brandMap.get(productKey).value += productGrams.get(p.id ?? -1) ?? 0;
			}
		})
		.then(() =>
			[...counts.keys()].map((brand) => ({
				name: brand,
				children: [...counts.get(brand).keys()].map((k) => {
					const point = counts.get(brand).get(k);
					return { ...point, showLabel: point.value > labelThreshold };
				})
			}))
		);
}

export async function getMacroHistory(): Promise<DataPoint[]> {
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
		.then(() =>
			db.productNutrients
				.where('nutrientId')
				.anyOf([NutrientType.FAT, NutrientType.CARBOHYDRATES, NutrientType.PROTEIN])
				.toArray()
		)
		.then((productNutrients) => {
			const macroHistory: DataPoint[] = [];
			productHistory.forEach((points: { grams: number; product: number }[], date: number) => {
				const value = points.reduce(
					(totals, p) => {
						const nutrients = productNutrients.filter((e) => e.productId === p.product);
						nutrients.forEach((n) => {
							const calories =
								((p.grams * n.per100Gram) / 100) * (n.nutrientId === NutrientType.FAT ? 9 : 4);
							if (n.nutrientId === NutrientType.FAT) {
								totals.fat += calories;
							} else if (n.nutrientId === NutrientType.CARBOHYDRATES) {
								totals.carbohydrates += calories;
							} else {
								totals.protein += calories;
							}
						});
						return totals;
					},
					{ protein: 0, fat: 0, carbohydrates: 0 }
				);
				const dateObj = new Date(date);
				macroHistory.push(
					{ group: 'Protein', date: dateObj, value: value.protein },
					{ group: 'Carbohydrates', date: dateObj, value: value.carbohydrates },
					{ group: 'Fat', date: dateObj, value: value.fat }
				);
			});
			return macroHistory;
		});
}
