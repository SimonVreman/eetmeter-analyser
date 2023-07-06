import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'theme:';
export const theme = writable(
	browser ? localStorage.getItem(STORAGE_KEY + 'theme') || 'g90' : 'g90'
);

theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem(STORAGE_KEY + 'theme', value);
	}
});
