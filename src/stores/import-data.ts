import { derived, writable } from 'svelte/store';

export const data = writable([]);

export const hasData = derived(data, ($data) => $data && $data.length);
