<script lang="ts">
	import { caloricHistory, domain } from '../../stores/charts.js';
	import { ComboChart } from '@carbon/charts-svelte';
	import { ChartTypes } from '@carbon/charts';
	import { theme } from '../../stores/theme';

	const options = {
		height: '400px',
		curve: 'curveMonotoneX',
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
				scaleType: 'time',
				domain: $domain
			}
		},
		legend: { enabled: false },
		comboChartTypes: [
			{ type: ChartTypes.AREA, correspondingDatasets: ['caloric history (corrected average)'] },
			{ type: ChartTypes.SCATTER, correspondingDatasets: ['caloric history'] }
		],
		timeScale: { addSpaceOnEdges: 0 },
		data: {
			loading: true
		},
		theme: $theme,
		title: 'Caloric intake history (kcal)'
	};

	$: {
		options.theme = $theme;
		options.data.loading = !$caloricHistory.length;
		options.axes.bottom.domain = $domain;
	}
</script>

<div style="height: 400px">
	<ComboChart data={$caloricHistory} {options} />
</div>
