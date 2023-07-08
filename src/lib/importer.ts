import type {
	Consumption,
	Date as SplitDate,
	Nutrient,
	Period,
	Product
} from '../types/consumptions';
import type {
	Consumption as DBConsumption,
	ConsumptionNutrient as DBConsumptionNutrient,
	ProductNutrient as DBProductNutrient,
	ConsumptionPeriod as DBConsumptionPeriod,
	NutrientType,
	Product as DBProduct
} from '../types/schema';
import { db } from './db';

export function importConsumption(consumption: Consumption): Promise<DBConsumption> {
	return importProduct(consumption.Product[0], consumption.Nutrienten[0]).then((product) => {
		const consumedUnit = consumption.Product[0].Eenheid[0];
		return db.consumptions
			.add({
				date: parseDate(consumption.Datum[0]),
				period: parseMoment(consumption.$.Periode),
				productId: product.id,
				grams: +consumedUnit.Aantal[0] * +consumedUnit.$.GramPerEenheid
			} as DBConsumption)
			.then(async (consumption) => {
				await Promise.all(
					Object.getOwnPropertyNames(consumption.Nutrienten[0]).map((nutrient) =>
						importConsumptionNutrient(consumption, nutrient[nutrient])
					)
				);
				return consumption;
			});
	});
}

function importConsumptionNutrient(
	consumption: DBConsumption,
	nutrient: Nutrient
): Promise<DBConsumptionNutrient> {
	return db.consumptionNutrients.add({
		consumptionId: consumption.id,
		nutrientId: parseNutrient(+nutrient.$.Code),
		amount: +nutrient._
	} as DBConsumptionNutrient);
}

function importProduct(
	product: Product,
	nutrients: { [key: string]: Nutrient[] }
): Promise<DBProduct> {
	return db.products
		.filter((p) => p.guid === product.Guid[0])
		.first()
		.then((existing) => {
			if (!existing) throw product;
			return existing;
		})
		.catch((product: Product) => importNewProduct(product, nutrients));
}

function importNewProduct(
	product: Product,
	nutrients: { [key: string]: Nutrient[] }
): Promise<DBProduct> {
	return db.products
		.add({
			guid: product.Guid[0],
			name: product.Naam[0],
			nevo: +product.$.NEVO,
			brand: product.Merk ? product.Merk[0] : undefined
		})
		.then(async (product) => {
			await Promise.all(
				Object.getOwnPropertyNames(nutrients).map((nutrient) =>
					importProductNutrient(product, nutrient[nutrient])
				)
			);
			return product;
		});
}

function importProductNutrient(
	product: DBProduct,
	nutrient: Nutrient
): Promise<DBConsumptionNutrient> {
	return db.productNutrients.add({
		consumptionId: product.id,
		nutrientId: parseNutrient(+nutrient.$.Code),
		amount: +nutrient._
	} as DBProductNutrient);
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
	return new Date(`${date.Jaar}-${date.Maand}-${date.Dag}`);
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
			return NutrientType.CARBOHIDRATES;
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
