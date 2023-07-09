<script lang="ts">
	import { db } from '../../lib/db';
	import type { Consumption, Product } from '../../types/schema';
	import { SkeletonText, Tile } from 'carbon-components-svelte';
	import { productNutrients } from '../../lib/explore';
	import NutrientSummary from './NutrientSummary.svelte';

	export let row: Consumption;

	let rows: { name: string; amount: number; unit: string }[];
	let product: Product;

	$: if (row) {
		db.products.get(row.productId).then((res) => {
			if (res) product = res;
		});
	}

	$: if (product && product.id) {
		productNutrients(product.id).then((nutrients) => {
			rows = nutrients.map((n) => ({
				...n,
				amount: (n.amount * row.grams) / 100
			}));
		});
	}
</script>

<div class="my-4">
	{#if product && rows}
		<p class="mb-4">{product.brand ? product.brand + ' - ' : ''}{product.name}</p>
	{:else}
		<SkeletonText />
	{/if}
	<NutrientSummary {rows} />
</div>
