<script lang="ts">
	import { SkeletonText } from 'carbon-components-svelte';

	export let rows: { name: string; amount: number; unit: string };
</script>

{#if rows}
	<div class="max-w-sm">
		{#each rows as row}
			<div class="flex my-2">
				<span class="w-full font-bold">{row.name}</span>
				<span class="w-28">{row.amount.toFixed(2)} {row.unit}</span>
			</div>
		{/each}
	</div>
{:else}
	<SkeletonText paragraph lines={10} />
{/if}
