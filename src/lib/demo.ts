import { db, LocalDatabase } from './db';
import Dexie from 'dexie';

const IMPORT_OPTIONS = { clearTablesBeforeImport: true, acceptNameDiff: true };

export function enterDemoMode(): Promise<void> {
	return import('dexie-export-import').then(({ exportDB, importInto }) =>
		exportDB(db)
			.then((blob) => importInto(new LocalDatabase('eetmeterdb-backup'), blob, IMPORT_OPTIONS))
			.then(() =>
				fetch('/demo.dxdb')
					.then((res) => res.blob())
					.then((blob) => importInto(db, blob, IMPORT_OPTIONS))
			)
	);
}

export async function exitDemoMode(): Promise<never> {
	return import('dexie-export-import').then(({ exportDB, importInto }) =>
		Dexie.exists('eetmeterdb-backup').then((exists) => {
			if (exists) {
				const backup = new LocalDatabase('eetmeterdb-backup');
				return exportDB(backup)
					.then((blob) => importInto(db, blob, IMPORT_OPTIONS))
					.then(() => backup.delete());
			}
			return Promise.all([
				db.consumptions.clear(),
				db.products.clear(),
				db.productNutrients.clear()
			]);
		})
	);
}
