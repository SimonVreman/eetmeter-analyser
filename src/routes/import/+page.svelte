<script>
	import { Column, Grid, Row, Tile } from 'carbon-components-svelte';
	import FileUpload from '../../components/import-files/FileUpload.svelte';
	import ImportPreview from '../../components/import-files/ImportPreview.svelte';

	let importedFiles = [];
</script>

<Grid>
	<Row>
		<Column>
			<h1>Import data</h1>
			<p class="big-paragraph">Add .xml exports from Mijn Eetmeter to analyse.</p>
			<Grid>
				<Row>
					<Column>
						<FileUpload bind:importedFiles />
					</Column>
					<Column>
						<ImportPreview files={importedFiles} />
					</Column>
				</Row>
			</Grid>
		</Column>
	</Row>
</Grid>
