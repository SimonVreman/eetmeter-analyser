<script lang="ts">
	import { db } from '../../lib/db';
	import type { Product } from '../../types/schema';
	import { Loading } from 'carbon-components-svelte';

	export let row: Product;

	let nutrients;

	$: if (row) {
		db.productNutrients
			.where({ productId: row.id })
			.toArray()
			.then((res) => {
				console.log(res);
				nutrients = res;
			});
	}
</script>

<div>
	{#if nutrients}
		{JSON.stringify(nutrients)}
	{:else}
		<Loading withOverlay={false} small />
	{/if}
</div>
