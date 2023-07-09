import { db } from './db';
import type { Nutrient, ProductNutrient } from '../types/schema';

export function productNutrients(
	productId: number
): Promise<{ name: string; amount: number; unit: string }[]> {
	return Promise.all([
		db.productNutrients.where({ productId }).toArray(),
		db.nutrients.toArray()
	]).then(([productNutrients, nutrients]: [ProductNutrient[], Nutrient[]]) => {
		return productNutrients.reduce((list, p) => {
			if (p.per100Gram <= 0) return list;
			const nutrient = nutrients.find((n) => n.id === p.nutrientId);
			return [...list, { name: nutrient.name, amount: p.per100Gram, unit: nutrient.unit }];
		}, []);
	});
}
