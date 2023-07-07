<script lang="ts">
	import { Button, FileUploaderItem } from 'carbon-components-svelte';
	import { browser } from '$app/environment';
	import xml2js from 'xml2js';
	import type { FileHandler } from '../../types/files';
	import { ProcessErrorType } from '../../types/files.js';

	let files: FileList | null = null;
	let fileHandlers: FileHandler[] = [];

	$: if (browser && files !== null) {
		for (const file of files) {
			const handler: FileHandler = file.text().then((content) =>
				xml2js
					.parseStringPromise(content, {})
					.then((r) => {
						handler.success = true;
						handler.data = r;
					})
					.catch((e) => {
						handler.success = false;
						handler.error = {
							type: ProcessErrorType.PARSER,
							message: e.message
						};
					})
					.finally(() => {
						handler.done = true;
						// Trigger reactivity
						fileHandlers = fileHandlers;
					})
			);
			handler.name = file.name;
			handler.done = false;
			fileHandlers.push(handler);
		}
		files = null;
	}

	export let importedFiles;
	$: importedFiles = fileHandlers.filter((f) => f.done && f.success).map((f) => f.data);
</script>

<Button as let:props>
	<label {...props}>
		<input class="hidden" bind:files multiple type="file" accept="text/xml" />
		Add files
	</label>
</Button>
{#each fileHandlers as file}
	<FileUploaderItem
		invalid={file?.success === false}
		name={file.name}
		errorSubject={file.error &&
			(file.error.type === ProcessErrorType.PARSER ? 'Failed to parse' : 'Invalid data structure')}
		errorBody={file.error && file.error.message}
		status={file.done ? (file.success ? 'complete' : 'edit') : 'uploading'}
		on:delete={() => {
			fileHandlers = fileHandlers.filter((f) => f !== file);
		}}
	/>
{/each}

<Button disabled={!fileHandlers.every((f) => f.done && f.success)}>Import</Button>
