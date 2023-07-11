import type { Consumption, Date as SplitDate, Nutrient, Product } from '../types/consumptions';
import type {
	Consumption as DBConsumption,
	ProductNutrient as DBProductNutrient
} from '../types/schema';
import { NutrientType, ConsumptionPeriod as DBConsumptionPeriod } from '../types/schema';
import { Period } from '../types/consumptions';
import { db } from './db';

export function importConsumption(
	consumption: Consumption,
	products: { id: number; guid: string }[]
): Promise<number> {
	const consumedUnit = consumption.Product[0].Eenheid[0];
	const productId = products.find((product) => product.guid === consumption.Product[0].Guid[0]).id;
	return db.consumptions.add({
		date: parseDate(consumption.Datum[0]),
		period: parseMoment(consumption.$.Periode),
		grams: +consumedUnit.Aantal[0] * +consumedUnit.$.GramPerEenheid,
		productId
	} as DBConsumption);
}

export function importProduct(
	product: Product,
	nutrients: { [key: string]: Nutrient[] }
): Promise<{ id: number; guid: string }> {
	return db.products
		.add({
			guid: product.Guid[0],
			name: product.Naam[0],
			nevo: +product.$.NEVO === -1 ? undefined : +product.$.NEVO,
			brand: product.Merk ? product.Merk[0] : undefined
		})
		.then(async (id) => {
			db.productNutrients.bulkAdd(
				Object.getOwnPropertyNames(nutrients).map((nutrient) =>
					parseProductNutrient(id, nutrients[nutrient][0])
				)
			);
			return id ? { id, guid: product.Guid[0] } : id;
		})
		.catch('ConstraintError', () =>
			db.products
				.where({ guid: product.Guid[0] })
				.first()
				.then((p) => (p ? { id: p.id, guid: p.guid } : p))
		);
}

function parseProductNutrient(product: number, nutrient: Nutrient): DBProductNutrient {
	return {
		productId: product,
		nutrientId: parseNutrient(+nutrient.$.Code),
		per100Gram: +nutrient.$.WaardePer100Gram
	} as DBProductNutrient;
}

function parseMoment(moment: Period): DBConsumptionPeriod {
	switch (moment) {
		case Period.Ontbijt:
			return DBConsumptionPeriod.BREAKFAST;
		case Period.Lunch:
			return DBConsumptionPeriod.LUNCH;
		case Period.Avondeten:
			return DBConsumptionPeriod.DINNER;
		case Period.Tussendoor:
			return DBConsumptionPeriod.OTHER;
	}
}

function parseDate(date: SplitDate): Date {
	return new Date(
		`${date.Jaar[0]}-${date.Maand[0].padStart(2, '0')}-${date.Dag[0].padStart(
			2,
			'0'
		)}T00:00:00.000Z`
	);
}

function parseNutrient(code: number): NutrientType {
	switch (code) {
		case 1001:
			return NutrientType.ENERGY;
		case 3001:
			return NutrientType.FAT;
		case 3003:
			return NutrientType.SATURATED_FAT;
		case 5001:
			return NutrientType.CARBOHYDRATES;
		case 2002:
			return NutrientType.PROTEIN;
		case 6001:
			return NutrientType.FIBER;
		case 9012:
			return NutrientType.SALT;
		case 8001:
			return NutrientType.ALCOHOL;
		case 7001:
			return NutrientType.WATER;
		case 9006:
			return NutrientType.SODIUM;
		case 9007:
			return NutrientType.POTASSIUM;
		case 9001:
			return NutrientType.CALCIUM;
		case 9008:
			return NutrientType.MAGNESIUM;
		case 9003:
			return NutrientType.IRON;
		case 10001:
			return NutrientType.SELENIUM;
		case 9009:
			return NutrientType.ZINC;
		case 11001:
			return NutrientType.VITAMIN_A;
		case 11009:
			return NutrientType.VITAMIN_D;
		case 11010:
			return NutrientType.VITAMIN_E;
		case 11005:
			return NutrientType.VITAMIN_B1;
		case 11006:
			return NutrientType.VITAMIN_B2;
		case 11007:
			return NutrientType.VITAMIN_B6;
		case 11028:
			return NutrientType.FOLIC_ACID;
		case 11008:
			return NutrientType.VITAMIN_B12;
		case 11014:
			return NutrientType.NICOTINIC_ACID;
		case 11011:
			return NutrientType.VITAMIN_C;
		case 10003:
			return NutrientType.IODINE;
		case 9002:
			return NutrientType.PHOSPHORUS;
		case 5002:
			return NutrientType.SUGARS;
		case 2003:
			return NutrientType.PLANT_PROTEIN;
	}
}
