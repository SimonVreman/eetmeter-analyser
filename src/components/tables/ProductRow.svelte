<script lang="ts">
	import type { Product } from '../../types/schema';
	import NutrientSummary from './NutrientSummary.svelte';
	import { productNutrients } from '../../lib/explore';

	export let row: Product;

	let rows: { name: string; amount: number; unit: string }[];

	$: if (row && row.id) {
		productNutrients(row.id).then((nutrients) => {
			rows = nutrients;
		});
	}
</script>

<div class="my-4">
	<NutrientSummary {rows} />
</div>
