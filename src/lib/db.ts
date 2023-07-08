import Dexie, { type Table } from 'dexie';
import type { Consumption } from '../types/schema';

export class LocalDatabase extends Dexie {
	consumptions!: Table<Consumption>;

	constructor() {
		super('eetmeterdb');
		this.version(1).stores({
			consumptions: '++id, consumedAt, product'
		});
	}
}

export const db = new LocalDatabase();
