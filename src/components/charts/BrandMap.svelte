<script lang="ts">
	import { brandMap } from '../../stores/charts.js';
	import { TreemapChart } from '@carbon/charts-svelte';
	import { theme } from '../../stores/theme';
	import { SkeletonPlaceholder } from 'carbon-components-svelte';

	const options = {
		height: '600px',
		theme: $theme,
		title: 'Consumed grams per product by brand',
		legend: { enabled: false }
	};

	$: {
		options.theme = $theme;
	}
</script>

<div style="height: 600px">
	{#if $brandMap.length}
		<TreemapChart data={$brandMap} {options} />
	{:else}
		<div class="flex justify-center items-center w-full h-full"><SkeletonPlaceholder /></div>
	{/if}
</div>
