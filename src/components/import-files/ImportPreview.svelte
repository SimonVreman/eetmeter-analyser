<script>
	import { Button, ButtonSet, DataTable, InlineNotification, Tile } from 'carbon-components-svelte';
	import RightPanel from '../layout/RightPanel.svelte';

	export let files = [];
	export let totalLength;
	export let hasInvalid = false;
	$: {
		console.log(files[0]);
		totalLength = files.reduce((acc, file) => acc + file.Consumpties.Consumptie.length, 0);
	}
</script>

<RightPanel>
	<span slot="header">Summary of import</span>
	<div slot="content" class="h-full">
		{#if files && files.length}
			{#if hasInvalid}
				<InlineNotification
					kind="warning"
					title="Missing data:"
					subtitle="Some files could not be processed."
				/>
			{/if}
			<DataTable
				headers={[
					{ key: 'metric', value: 'Metric' },
					{ key: 'value', value: 'Value' }
				]}
				rows={[
					{
						id: 'a',
						metric: 'Total consumptions',
						value: totalLength
					}
				]}
				class="mt-4"
				slot="content"
			/>
		{:else}
			<div class="flex flex-col justify-center h-full">
				<h3 class="mb-2">Upload files to see a preview</h3>
				<p class="">
					After you upload some files, we will show a preview of what you have uploaded here.
				</p>
			</div>
		{/if}
	</div>
	<ButtonSet class="-mx-4 -mb-4 mt-10" style="width: calc(100% + 2rem)" slot="footer">
		<Button style="width: 50%; max-width: none" size="lg" kind="secondary">Cancel</Button>
		<Button style="width: 50%; max-width: none" size="lg" disabled={!files || !files.length}
			>Submit</Button
		>
	</ButtonSet>
</RightPanel>
