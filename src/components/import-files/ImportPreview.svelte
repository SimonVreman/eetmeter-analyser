<script lang="ts">
	import { Button, ButtonSet, DataTable, InlineNotification } from 'carbon-components-svelte';
	import RightPanel from '../layout/RightPanel.svelte';
	import type { FileHandler } from '../../types/files';
	import type { EetmeterExportSummary } from '../../types/consumptions';
	import { importConsumptions, summarize } from '../../lib/consumptions';
	import { Dayjs } from 'dayjs';
	import { notifications } from '../../stores/notifications';
	import { MessageType } from '../../types/notifications';

	export let fileHandlers: FileHandler[] = [];

	let files: EetmeterExportSummary[];
	let totalLength: number;
	let hasInvalid: boolean;
	let isImporting = false;
	let start: Dayjs;
	let end: Dayjs;

	$: {
		let valid = true;
		let length = 0;
		let validFiles: EetmeterExportSummary[] = [];
		fileHandlers.forEach((f) => {
			if (!f.done) return;
			if (!f.success || !f.data) {
				valid = false;
				return;
			}
			const summary = summarize(f.data);
			validFiles.push(summary);
			length += summary.consumptions;
		});
		totalLength = length;
		hasInvalid = !valid;
		files = validFiles.sort((a, b) => a.from - b.from);
		if (files.length) {
			start = files[0].from;
			end = files[files.length - 1].to;
		}
	}

	function clearFiles() {
		fileHandlers = [];
	}

	function importFiles() {
		isImporting = true;
		importConsumptions(
			fileHandlers.reduce((valid, f) => {
				if (f.done && f.success && f.data) {
					valid.push(f.data);
				}
				return valid;
			}, [])
		)
			.then(() => {
				clearFiles();
				notifications.send({
					title: 'Import successful',
					subtitle: 'Your data was imported successfully',
					type: MessageType.SUCCESS
				});
			})
			.catch(() => {
				notifications.send({
					title: 'Import failed',
					subtitle: 'Something went wrong while importing the files',
					type: MessageType.ERROR
				});
			})
			.finally(() => {
				isImporting = false;
			});
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
			<div>
				{start.format('D MMM YYYY')} to {end.format('D MMM YYYY')}
			</div>
		{:else}
			<div class="flex flex-col justify-center h-full">
				<h3 class="mb-2">Upload files to see a summary</h3>
				<p class="">
					After you add some files, we will show a preview of what you have uploaded here.
				</p>
			</div>
		{/if}
	</div>
	<ButtonSet class="-mx-4 -mb-4 mt-10" style="width: calc(100% + 2rem)" slot="footer">
		<Button
			style="width: 50%; max-width: none"
			size="lg"
			kind="secondary"
			on:click={clearFiles}
			disabled={isImporting}>Clear</Button
		>
		<Button
			style="width: 50%; max-width: none"
			size="lg"
			on:click={importFiles}
			disabled={!files || !files.length || hasInvalid || isImporting}>Import</Button
		>
	</ButtonSet>
</RightPanel>
