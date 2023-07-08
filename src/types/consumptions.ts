import { Dayjs } from 'dayjs';

export interface EetmeterExportSummary {
	consumptions: number;
	from: Dayjs;
	to: Dayjs;
}

export interface EetmeterExport {
	Consumpties: Consumptions;
}

export interface Consumptions {
	$: ExportAttributes;
	Consumptie: Consumption[];
}

export interface ExportAttributes {
	Email: string;
	Naam: string;
	Van: string;
	Tot: string;
}

export interface Consumption {
	$: ConsumptionAttributes;
	Datum: Date[];
	Product: Product[];
	Nutrienten: { [key: string]: Nutrients[] }[];
}

export interface ConsumptionAttributes {
	Periode: Period;
}

export enum Period {
	Avondeten = 'Avondeten',
	Lunch = 'Lunch',
	Ontbijt = 'Ontbijt',
	Tussendoor = 'Tussendoor'
}

export interface Date {
	Dag: string[];
	Maand: string[];
	Jaar: string[];
}

export interface Nutrients {
	_: string;
	$: NutrientsAttributes;
}

export interface NutrientsAttributes {
	Code: string;
	Eenheid: UnitEnum;
	WaardePer100Gram?: string;
}

export enum UnitEnum {
	G = 'g',
	Kcal = 'kcal',
	Mg = 'mg',
	Μg = 'µg'
}

export interface Product {
	$: ProductAttributes;
	Guid: string[];
	Merk?: string[];
	Naam: string[];
	Bereiding: Preperation[];
	Eenheid: Unit[];
}

export interface ProductAttributes {
	NEVO: string;
	VcCode: string;
	IsMerkProduct: IsProduct;
	IsEigenProduct: IsProduct;
}

export enum IsProduct {
	Ja = 'Ja',
	Nee = 'Nee'
}

export enum Preperation {
	Bereid = 'Bereid',
	BereidInOven = 'Bereid in oven',
	BereidMetOlieOfVetEnZout = 'Bereid (met olie of vet en zout)',
	BereidZonderOlieOfVet = 'Bereid (zonder olie of vet)',
	GebakkenMetOlieOfVet = 'Gebakken (met olie of vet)',
	Gekookt = 'Gekookt',
	GekooktOfGewoktZonderOlieOfVet = 'Gekookt of gewokt (zonder olie of vet)',
	NVT = 'N.v.t.',
	Onbereid = 'Onbereid',
	Rauw = 'Rauw'
}

export interface Unit {
	$: UnitAttributes;
	Naam: string[];
	Aantal: string[];
}

export interface UnitAttributes {
	GramPerEenheid: string;
}
