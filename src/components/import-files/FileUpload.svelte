<script lang="ts">
	import { Button, FileUploaderItem } from 'carbon-components-svelte';
	import { browser } from '$app/environment';
	import xml2js from 'xml2js';
	import type { FileHandler } from '../../types/files';
	import { ProcessErrorType } from '../../types/files.js';
	import { validate } from '../../lib/consumptions';

	let files: FileList | null = null;
	export let fileHandlers: FileHandler[] = [];

	$: if (browser && files !== null) {
		for (const file of files) {
			const handler: FileHandler = file.text().then((content) =>
				xml2js
					.parseStringPromise(content, {})
					.then((r) => {
						const { success, error } = validate(r);
						handler.success = success;
						handler.error = error;
						if (success) handler.data = r;
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
</script>

<p class:bx--file--label={true}>Upload files</p>
<p class:bx--label-description={true}>Only .xml files are accepted</p>
<Button as let:props kind="tertiary" class="mb-4">
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
		status={file.done ? 'edit' : 'uploading'}
		on:delete={() => {
			fileHandlers = fileHandlers.filter((f) => f !== file);
		}}
	/>
{/each}
