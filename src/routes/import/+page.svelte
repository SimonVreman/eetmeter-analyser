<script>
	import { Column, Content, Grid, Row } from 'carbon-components-svelte';
	import FileUpload from '../../components/import-files/FileUpload.svelte';
	import ImportPreview from '../../components/import-files/ImportPreview.svelte';

	let importedFiles = [];
	let hasInvalid = false;
</script>

<Content class="flex">
	<Grid class="w-full shrink">
		<Row>
			<Column>
				<h1>Import data</h1>
				<p class="big-paragraph">Add .xml exports from Mijn Eetmeter to analyse.</p>
				<FileUpload bind:importedFiles bind:hasInvalid />
				<div class="h-screen" />
			</Column>
		</Row>
	</Grid>
	<ImportPreview files={importedFiles} {hasInvalid} />
</Content>
