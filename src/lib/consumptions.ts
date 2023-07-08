import type { Consumption, EetmeterExport, EetmeterExportSummary } from '../types/consumptions';
import type { ProcessError, FileHandler } from '../types/files';
import type { Consumption as DBConsumption } from '../types/schema';
import { ProcessErrorType } from '../types/files';
import dayjs from 'dayjs';
import { db } from './db';
import xml2js from 'xml2js';
import { importConsumption } from './importer';

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

export function createFileHandler(file: File) {
	const handler = file
		.text()
		.then((content) => parseConsumptionXML(content, handler))
		.finally(() => (handler.done = true)) as FileHandler;
	handler.file = file;
	handler.name = file.name;
	handler.done = false;
	return handler;
}

async function parseConsumptionXML(content: string, handler: FileHandler): Promise<never> {
	return xml2js
		.parseStringPromise(content, {})
		.then((r) => {
			const { success, error } = validate(r);
			handler.success = success;
			handler.error = error;
			if (success) handler.data = r;
		})
		.catch((e) => {
			handler.success = false;
			handler.error = {
				type: ProcessErrorType.PARSER,
				message: e.message
			};
		});
}

export async function importConsumptions(files: EetmeterExport[]): Promise<[]> {
	return Promise.all(
		files.reduce((promises, file) => {
			return [...promises, ...file.Consumpties.Consumptie.map(importConsumption)];
		}, [])
	);
}
