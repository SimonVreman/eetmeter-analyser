import type { Consumption, EetmeterExport, EetmeterExportSummary } from '../types/consumptions';
import type { ProcessError } from '../types/files';
import type { Consumption as DBConsumption } from '../types/schema';
import { ProcessErrorType } from '../types/files';
import dayjs from 'dayjs';
import { db } from './db';

export function summarize(data: EetmeterExport): EetmeterExportSummary {
	return {
		consumptions: data.Consumpties.Consumptie.length,
		from: dayjs(data.Consumpties.$.Van.split('-').reverse().join('-')),
		to: dayjs(data.Consumpties.$.Tot.split('-').reverse().join('-'))
	};
}

export function validate(data: any): { success: boolean; error?: ProcessError } {
	const success = !!isEetmeterExport(data);
	const error: ProcessError = {
		type: ProcessErrorType.VALIDATOR,
		message: 'XML is not a valid Eetmeter export'
	};
	return { success, error: success ? undefined : error };
}

export function isEetmeterExport(data: any): data is EetmeterExport {
	return (
		data &&
		data.Consumpties &&
		data.Consumpties.$ &&
		Object.getOwnPropertyNames(data.Consumpties.$) &&
		Object.getOwnPropertyNames(data.Consumpties.$).every((key) =>
			['Email', 'Naam', 'Van', 'Tot'].includes(key)
		) &&
		data.Consumpties.Consumptie &&
		Array.isArray(data.Consumpties.Consumptie) &&
		true
	);
}

export async function importConsumptions(files: EetmeterExport[]): Promise<[]> {
	const promises = files.reduce((promises, file) => {
		const consumptions = file.Consumpties.Consumptie.map(convertToDb);
		promises.push(db.consumptions.bulkAdd(consumptions));
		return promises;
	}, []);
	return Promise.all(promises);
}

function convertToDb(consumption: Consumption): DBConsumption {
	const date = consumption.Datum[0];
	return {
		consumedAt: new Date(`${date.Jaar}-${date.Maand}-${date.Dag}`),
		productCode: consumption.Product[0].$.VcCode
	};
}
