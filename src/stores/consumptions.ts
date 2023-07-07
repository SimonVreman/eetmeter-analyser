import { derived, readable } from 'svelte/store';
import { persistent } from 'rhaboo/src/sand/core.js';

export const consumptions = readable(persistent('consumptions'));

export const hasConsumptions = derived(consumptions, ($data) => $data && $data.length);
