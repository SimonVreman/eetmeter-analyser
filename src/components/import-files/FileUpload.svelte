<script>
	import { Button, FileUploaderItem } from 'carbon-components-svelte';
	import { browser } from '$app/environment';
	import xml2js from 'xml2js';

	let files = [];
	let fileHandlers = [];

	$: if (browser) {
		for (let i = 0; i < files.length; i++) {
			const file = files.item(i);
			const handler = file.text().then((content) =>
				xml2js
					.parseStringPromise(content, {})
					.then((r) => {
						handler.success = true;
						handler.data = r;
					})
					.catch(() => (handler.success = false))
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
		files = [];
	}

	export let importedFiles = [];
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
		status={file.done ? (file.success ? 'complete' : 'edit') : 'uploading'}
		on:delete={() => {
			fileHandlers = fileHandlers.filter((f) => f !== file);
		}}
	/>
{/each}
