<script lang="ts">
	import {
		Button,
		ButtonSet,
		DataTable,
		DataTableSkeleton,
		InlineNotification,
		Loading
	} from 'carbon-components-svelte';
	import RightPanel from '../layout/RightPanel.svelte';
	import type { FileHandler } from '../../types/files';
	import type { EetmeterExportSummary } from '../../types/consumptions';
	import { importConsumptions, summarize } from '../../lib/consumptions';
	import { Dayjs } from 'dayjs';
	import { notifications } from '../../stores/notifications';
	import { MessageType } from '../../types/notifications';
	import { goto } from '$app/navigation';
	import { clearChartCache } from '../../stores/charts';

	export let fileHandlers: FileHandler[] = [];

	let files: EetmeterExportSummary[];
	let totalLength: number;
	let hasInvalid: boolean;
	let hasLoading: boolean;
	let isImporting = false;
	let start: Dayjs;
	let end: Dayjs;

	$: {
		files = fileHandlers
			.reduce((list, f) => {
				if (!f.done || !f.success || !f.data) return list;
				const summary = summarize(f.data);
				return [...list, summary];
			}, [])
			.sort((a, b) => a.from - b.from);
		totalLength = files.reduce((sum, f) => sum + f.consumptions, 0);
		hasInvalid = fileHandlers.some((f) => f.done === true && f.success !== true);
		hasLoading = fileHandlers.some((f) => f.done !== true);

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
		notifications.send({
			title: 'Starting import',
			subtitle: 'We are processing your files, this should not take long.',
			type: MessageType.INFO
		});
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
					subtitle: 'Your data was imported successfully.',
					type: MessageType.SUCCESS
				});
				return goto('/');
			})
			.catch((e) => {
				notifications.send({
					title: 'Import failed',
					subtitle: 'Something went wrong while importing your files.',
					type: MessageType.ERROR
				});
			})
			.finally(() => {
				clearChartCache();
				isImporting = false;
			});
	}
</script>

<RightPanel>
	<span slot="header">Summary of import</span>
	<div slot="content" class="h-full">
		{#if isImporting}
			<Loading />
		{/if}
		{#if files && files.length}
			{#if hasInvalid}
				<InlineNotification
					kind="warning"
					title="Missing data:"
					subtitle="Some files could not be processed."
				/>
			{/if}
			<div>
				{#if hasLoading}
					<DataTableSkeleton
						class="mt-4"
						showHeader={false}
						showToolbar={false}
						headers={[{ value: 'Metric' }, { value: 'Value' }]}
						rows={3}
					/>
				{:else}
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
							},
							{
								id: 'b',
								metric: 'Oldest data',
								value: start.format('DD MMM YYYY')
							},
							{
								id: 'c',
								metric: 'Newest data',
								value: end.format('DD MMM YYYY')
							}
						]}
						class="mt-4"
						slot="content"
					/>
				{/if}
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
			disabled={!files || !files.length || hasInvalid || hasLoading || isImporting}>Import</Button
		>
	</ButtonSet>
</RightPanel>
