<script lang="ts">
	import { totalMacros } from '../../stores/charts.js';
	import { DonutChart } from '@carbon/charts-svelte';
	import { theme } from '../../stores/theme';

	const options = {
		height: '400px',
		donut: {
			center: {
				label: 'Energy'
			}
		},
		data: {
			loading: true
		},
		theme: $theme,
		title: 'Total macros (kcal)'
	};

	$: {
		options.theme = $theme;
		options.data.loading = !$totalMacros.length;
	}
</script>

<div style="height: 400px">
	<DonutChart data={$totalMacros} {options} />
</div>
