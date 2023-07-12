<script lang="ts">
	import { domain, macroHistory } from '../../stores/charts.js';
	import { StackedAreaChart } from '@carbon/charts-svelte';
	import { theme } from '../../stores/theme';

	const options = {
		height: '400px',
		axes: {
			left: {
				mapsTo: 'value',
				stacked: true,
				percentage: true,
				ticks: {
					formatter: (d) => `${d}%`
				}
			},
			bottom: {
				mapsTo: 'date',
				scaleType: 'time',
				domain: $domain
			}
		},
		legend: { enabled: false },
		curve: 'curveMonotoneX',
		timeScale: { addSpaceOnEdges: 0 },
		data: {
			loading: true
		},
		theme: $theme,
		title: 'Daily macro split (kcal)'
	};

	$: {
		options.theme = $theme;
		options.data.loading = !$macroHistory.length;
		options.axes.bottom.domain = $domain;
	}
</script>

<div style="height: 400px">
	<StackedAreaChart data={$macroHistory} {options} />
</div>
