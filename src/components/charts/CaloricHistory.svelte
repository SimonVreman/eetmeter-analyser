<script lang="ts">
	import { caloricHistory } from '../../stores/charts.js';
	import { AreaChart } from '@carbon/charts-svelte';

	const options = {
		height: '400px',
		curve: 'curveNatural',
		bounds: {
			upperBoundMapsTo: 'max',
			lowerBoundMapsTo: 'min'
		},
		axes: {
			left: {
				title: 'Calories',
				mapsTo: 'value',
				scaleType: 'linear'
			},
			bottom: {
				mapsTo: 'date',
				scaleType: 'time'
			}
		},
		legend: { enabled: false }
	};
</script>

<AreaChart data={$caloricHistory ?? []} {options} />
