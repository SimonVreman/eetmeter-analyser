<script lang="ts">
	import {
		DataTable,
		DataTableSkeleton,
		Pagination,
		PaginationSkeleton
	} from 'carbon-components-svelte';
	import { notifications } from '../../stores/notifications';
	import { MessageType } from '../../types/notifications';
	import { browser } from '$app/environment';
	import type { Table } from 'dexie';

	export let collection: Table<never>;
	export let headers: { key: string; value: string }[];
	export let title: string;
	export let description: string;

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
			.then((r) => (rows = r))
			.catch(showError)
			.finally(() => (loading = false));
	}
</script>

<div class="-mx-4">
	{#if !loading && (rowCount || rowCount === 0) && rows}
		<DataTable sortable {title} {description} {headers} {rows} bind:sortKey bind:sortDirection />
		<Pagination bind:pageSize bind:page totalItems={rowCount} pageSizeInputDisabled />
	{:else}
		<DataTableSkeleton showToolbar={false} headers={headers.map((h) => h.value)} rows={pageSize} />
		<PaginationSkeleton />
	{/if}
</div>
