<script>
	import { Column, Content, Grid, OutboundLink, Row } from 'carbon-components-svelte';
	import FileUpload from '../../components/import-files/FileUpload.svelte';
	import ImportPreview from '../../components/import-files/ImportPreview.svelte';
	import MetaHead from '../../components/head/MetaHead.svelte';

	export let fileHandlers = [];
</script>

<MetaHead title="Import" description="Import your own data." />

<Content class="md:flex">
	<Grid class="w-full shrink">
		<Row>
			<Column>
				<h1>Import data</h1>
				<p class="big-paragraph">Add .xml exports from Mijn Eetmeter to analyse.</p>
				<p class="mb-6">
					These can be downloaded through <OutboundLink
						size="lg"
						href="https://mijn.voedingscentrum.nl/nl/dashboard/eetmeter/overzicht/"
						>your personal Eetmeter overview</OutboundLink
					> Simply select the 'e-mail maandoverzicht' option, pick XML as the format and select the month
					you want to import. Repeat this for each month you want to import here, they can all be imported
					at once.
				</p>
				<FileUpload bind:fileHandlers />
			</Column>
		</Row>
	</Grid>
	<ImportPreview bind:fileHandlers />
</Content>
