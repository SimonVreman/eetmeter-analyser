import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Mirrors internal carbon theme, for read access only.
const initial = browser ? localStorage.getItem('theme') : 'g10';
export const theme = writable(initial);
