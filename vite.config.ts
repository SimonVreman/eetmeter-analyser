import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { optimizeCss } from 'carbon-preprocess-svelte';

export default defineConfig({
	plugins: [sveltekit(), process.env.NODE_ENV === 'production' && optimizeCss()],
	resolve: { alias: { stream: 'stream-browserify' } },
	ssr: {
		noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts', 'carbon-components'] : []
	}
});
