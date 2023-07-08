export interface Consumption {
	id?: number;
	date: Date;
	period: ConsumptionPeriod;
	productId: string;
	grams: number;
}

export enum ConsumptionPeriod {
	BREAKFAST = 'BREAKFAST',
	LUNCH = 'LUNCH',
	DINNER = 'DINNER',
	OTHER = 'OTHER'
}

export interface ConsumptionNutrient {
	id?: number;
	nutrientId: number;
	type: NutrientType;
	amount: number;
}

export interface Product {
	id?: string;
	name: string;
	nevo?: number;
	brand?: string;
}

export interface ProductNutrient {
	id?: number;
	name: string;
	nutrientId: number;
	type: NutrientType;
	per100Gram: number;
}

export interface Nutrient {
	id?: number;
	name: string;
	unit: string;
}

export enum NutrientType {
	ENERGY = 1,
	FAT = 2,
	SATURATED_FAT = 3,
	CARBOHIDRATES = 4,
	PROTEIN = 5,
	FIBER = 5,
	SALT = 6,
	ALCOHOL = 7,
	WATER = 8,
	SODIUM = 9,
	POTASSIUM = 10,
	CALCIUM = 11,
	MAGNESIUM = 12,
	IRON = 13,
	SELENIUM = 14,
	ZINC = 15,
	VITAMIN_A = 16,
	VITAMIN_D = 17,
	VITAMIN_E = 18,
	VITAMIN_B1 = 19,
	VITAMIN_B2 = 20,
	VITAMIN_B6 = 21,
	FOLIC_ACID = 22,
	VITAMIN_B12 = 23,
	NICOTINIC_ACID = 24,
	VITAMIN_C = 25,
	IODINE = 26,
	PHOSPHORUS = 27,
	SUGARS = 28,
	PLANT_PROTEIN = 29
}
