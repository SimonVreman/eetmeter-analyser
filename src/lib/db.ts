import Dexie, { type Table } from 'dexie';
import type { Consumption, Nutrient, Product, ProductNutrient } from '../types/schema';
import { NutrientType } from '../types/schema';

export class LocalDatabase extends Dexie {
	nutrients: Table<Nutrient>;
	consumptions!: Table<Consumption>;
	products!: Table<Product>;
	productNutrients!: Table<ProductNutrient>;

	constructor() {
		super('eetmeterdb');
		this.version(1).stores({
			nutrients: '++id, name, unit',
			consumptions: '++id, date, period, productId, grams',
			products: '++id, &guid, name, nevo, brand',
			productNutrients: '++id, productId, nutrientId, type, per100Gram'
		});
	}
}

export const db = new LocalDatabase();

db.on('populate', () =>
	db.nutrients.bulkAdd([
		{ id: NutrientType.ENERGY, name: 'Energy', unit: 'kcal' },
		{ id: NutrientType.FAT, name: 'Fat', unit: 'g' },
		{ id: NutrientType.SATURATED_FAT, name: 'Saturated fat', unit: 'g' },
		{ id: NutrientType.CARBOHIDRATES, name: 'Carbohydrates', unit: 'g' },
		{ id: NutrientType.PROTEIN, name: 'Protein', unit: 'g' },
		{ id: NutrientType.FIBER, name: 'Fiber', unit: 'g' },
		{ id: NutrientType.SALT, name: 'Salt', unit: 'g' },
		{ id: NutrientType.ALCOHOL, name: 'Alcohol', unit: 'g' },
		{ id: NutrientType.WATER, name: 'Water', unit: 'g' },
		{ id: NutrientType.SODIUM, name: 'Sodium', unit: 'mg' },
		{ id: NutrientType.POTASSIUM, name: 'Potassium', unit: 'mg' },
		{ id: NutrientType.CALCIUM, name: 'Calcium', unit: 'mg' },
		{ id: NutrientType.MAGNESIUM, name: 'Magnesium', unit: 'mg' },
		{ id: NutrientType.IRON, name: 'Iron', unit: 'mg' },
		{ id: NutrientType.SELENIUM, name: 'Selenium', unit: 'µg' },
		{ id: NutrientType.ZINC, name: 'Zinc', unit: 'mg' },
		{ id: NutrientType.VITAMIN_A, name: 'Vitamin A', unit: 'µg' },
		{ id: NutrientType.VITAMIN_B1, name: 'Vitamin B1', unit: 'mg' },
		{ id: NutrientType.VITAMIN_B2, name: 'Vitamin B2', unit: 'mg' },
		{ id: NutrientType.VITAMIN_B6, name: 'Vitamin B6', unit: 'mg' },
		{ id: NutrientType.VITAMIN_B12, name: 'Vitamin B12', unit: 'µg' },
		{ id: NutrientType.VITAMIN_C, name: 'Vitamin C', unit: 'mg' },
		{ id: NutrientType.VITAMIN_D, name: 'Vitamin D', unit: 'µg' },
		{ id: NutrientType.VITAMIN_E, name: 'Vitamin E', unit: 'mg' },
		{ id: NutrientType.FOLIC_ACID, name: 'Folic acid', unit: 'µg' },
		{ id: NutrientType.NICOTINIC_ACID, name: 'Nicotinic acid', unit: 'mg' },
		{ id: NutrientType.IODINE, name: 'Iodine', unit: 'µg' },
		{ id: NutrientType.PHOSPHORUS, name: 'Phosphorus', unit: 'mg' },
		{ id: NutrientType.SUGARS, name: 'Sugars', unit: 'g' },
		{ id: NutrientType.PLANT_PROTEIN, name: 'Plant protein', unit: 'g' }
	])
);
