<script lang="ts">
	import {
		Button,
		DataTable,
		DataTableSkeleton,
		Link,
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

	let page = 1;
	let pageSize = 20;
	let rows;
	let rowCount;
	let loading;
	let sortKey = ':id';
	let sortDirection = 'ascending';

	function showError(e) {
		console.log(e);
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

<div class="-mx-4">
	{#if !loading && (rowCount || rowCount === 0) && rows}
		{#if rows.length > 0}
			<DataTable sortable {title} {description} {headers} {rows} bind:sortKey bind:sortDirection />
			<Pagination bind:pageSize bind:page totalItems={rowCount} pageSizeInputDisabled />
		{:else}
			<Tile>
				<div class="max-w-lg my-8">
					<h2 class="text-2xl">Your imported data will appear here</h2>
					<p class="mt-2 mb-8">
						This is where you can browse your data, but you have not imported anything yet. To start
						exploring, head to the import page and add your data, or go to demo mode.
					</p>
					<Button href="/import">Import data</Button>
					<div class="mt-4">
						<Link>Open demo mode</Link>
					</div>
				</div>
			</Tile>
		{/if}
	{:else}
		<DataTableSkeleton showToolbar={false} headers={headers.map((h) => h.value)} rows={pageSize} />
		<PaginationSkeleton />
	{/if}
</div>
