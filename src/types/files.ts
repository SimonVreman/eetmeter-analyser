import type { EetmeterExport } from './consumptions';

export interface ProcessError {
	type: ProcessErrorType;
	message: string;
}

export enum ProcessErrorType {
	PARSER = 'PARSER',
	VALIDATOR = 'VALIDATOR'
}

export interface FileHandler extends Promise<never> {
	file: File;
	name: string;
	done: boolean;
	success: boolean;
	error?: ProcessError;
	data?: EetmeterExport;
}
