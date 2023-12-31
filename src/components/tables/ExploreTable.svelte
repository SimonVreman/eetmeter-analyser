<script lang="ts">
	import {
		Button,
		DataTable,
		DataTableSkeleton,
		Pagination,
		PaginationSkeleton,
		Tile
	} from 'carbon-components-svelte';
	import { notifications } from '../../stores/notifications';
	import { MessageType } from '../../types/notifications';
	import { browser } from '$app/environment';
	import type { Table } from 'dexie';

	export let collection: Table<never>;
	export let headers: { key: string; value: string }[];
	export let title: string;
	export let description: string;
	export let formatter: (item: never) => never = (item) => item;
	export let expandable = false;

	let page = 1;
	let pageSize = 20;
	let rows;
	let rowCount;
	let loading;
	let sortKey = ':id';
	let sortDirection = 'ascending';

	function showError() {
		notifications.send({
			type: MessageType.ERROR,
			title: 'Failed to load data',
			subtitle: 'Something went wrong while trying to fetch your data.'
		});
	}

	$: if (browser && collection) {
		collection
			.count()
			.then((count) => {
				rowCount = count;
			})
			.catch(showError);
	}

	$: if (browser && collection) {
		loading = true;
		let ordered = collection.orderBy(sortKey);
		if (sortDirection === 'descending') ordered.reverse();

		ordered
			.offset(pageSize * (page - 1))
			.limit(pageSize)
			.toArray()
			.then((r) => (rows = r.map(formatter)))
			.catch(showError)
			.finally(() => (loading = false));
	}
</script>

<div class="-mx-4 overflow-x-auto">
	{#if !loading && (rowCount || rowCount === 0) && rows}
		{#if rows.length > 0}
			<div class="pb-2" style="min-width: 550px;">
				<DataTable
					sortable
					{expandable}
					{title}
					{description}
					{headers}
					{rows}
					bind:sortKey
					bind:sortDirection
				>
					<svelte:fragment slot="expanded-row" let:row>
						<slot {row} />
					</svelte:fragment>
				</DataTable>
				<Pagination
					class="overflow-hidden w-full"
					bind:pageSize
					bind:page
					totalItems={rowCount}
					pageSizeInputDisabled
				/>
			</div>
		{:else}
			<Tile>
				<div class="max-w-lg my-8">
					<h2 class="text-2xl">Your imported data will appear here</h2>
					<p class="mt-2 mb-8">
						This is where you can browse your data, but you have not imported anything yet. To start
						exploring, head to the import page and add your data, or go to demo mode.
					</p>
					<Button href="/import">Import data</Button>
				</div>
			</Tile>
		{/if}
	{:else}
		<div class="pb-2" style="min-width: 550px;">
			<DataTableSkeleton
				showToolbar={false}
				headers={headers.map((h) => h.value)}
				rows={pageSize}
			/>
			<PaginationSkeleton />
		</div>
	{/if}
</div>
