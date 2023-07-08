<script lang="ts">
	import { Button, FileUploaderItem } from 'carbon-components-svelte';
	import type { FileHandler } from '../../types/files';
	import { ProcessErrorType } from '../../types/files.js';
	import { createFileHandler } from '../../lib/consumptions';
	import { isSameFile } from '../../lib/files';

	let files: FileList | null = null;
	let input: HTMLInputElement | null = null;
	export let fileHandlers: FileHandler[] = [];

	$: if (files !== null) {
		for (const file of files) {
			// ignore duplicates
			if (fileHandlers.some((f) => isSameFile(f.file, file))) continue;
			const handler = createFileHandler(file);
			handler.then(() => {
				// Trigger reactivity
				fileHandlers = fileHandlers;
			});
			fileHandlers.push(handler);
		}
		// Clear input to allow reuploading the same file
		if (input !== null) input.value = '';
	}
</script>

<p class:bx--file--label={true}>Upload files</p>
<p class:bx--label-description={true}>Only .xml files are accepted</p>
<Button as let:props kind="tertiary" class="mb-4">
	<label {...props}>
		<input class="hidden" bind:files bind:this={input} multiple type="file" accept="text/xml" />
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
