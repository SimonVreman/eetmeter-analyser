<script>
	import { DataTable, Tile } from 'carbon-components-svelte';
	import { Analyze } from 'carbon-pictograms-svelte';

	export let files = [];
	export let total_length = 0;
	$: {
		total_length = files.reduce((acc, file) => acc + file.Consumpties.Consumptie.length, 0);
	}
</script>

<Tile>
	{#if files && files.length}
		<DataTable
			headers={[
				{ key: 'metric', value: 'Metric' },
				{ key: 'value', value: 'Value' }
			]}
			rows={[
				{
					id: 'a',
					key: 'Total consumptions',
					value: total_length
				}
			]}
		>
			<strong slot="title">Selected files</strong>
			<span slot="description" class="text-lg"> Summary of your uploaded data. </span>
		</DataTable>
	{:else}
		<div class="w-full h-full min-h-48">
			<Analyze class="mt-20 mb-3" />
			<h3 class="mb-2">Upload files to see a preview</h3>
			<p class="mb-20">
				After you upload some files, we will show a preview of what you have uploaded here.
			</p>
		</div>
	{/if}
</Tile>
