import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const demo = writable(browser ? JSON.parse(localStorage.getItem('demo') ?? 'false') : false);
export const newUser = writable(
	browser ? JSON.parse(localStorage.getItem('newUser') ?? 'true') : false
);

demo.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem('demo', JSON.stringify(value));
});

newUser.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem('newUser', JSON.stringify(value));
});
