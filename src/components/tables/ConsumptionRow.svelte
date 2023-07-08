<script lang="ts">
	import { db } from '../../lib/db';
	import type { Consumption } from '../../types/schema';
	import { Loading } from 'carbon-components-svelte';

	export let row: Consumption;

	let product;

	$: if (row) {
		db.products.get(row.productId).then((res) => {
			product = res;
		});
	}
</script>

<div>
	{#if product}
		<h1>{product.name}</h1>
	{:else}
		<Loading withOverlay={false} small />
	{/if}
</div>
