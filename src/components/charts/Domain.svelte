<script lang="ts">
	import { DatePicker, DatePickerInput, DatePickerSkeleton } from 'carbon-components-svelte';
	import { domain } from '../../stores/charts';
	import dayjs from 'dayjs';

	let valueFrom;
	let valueTo;

	const format = 'YYYY-MM-DD';
	const toFormat = (x) => dayjs(x).format(format);
	const toDate = (x) => dayjs(x, format);

	$: valueFrom = toFormat(dayjs($domain[0] as number));
	$: valueTo = toFormat(dayjs($domain[1] as number));

	function updateRange() {
		$domain = [toDate(valueFrom).startOf('day').valueOf(), toDate(valueTo).endOf('day').valueOf()];
	}
</script>

<div>
	{#if $domain[0] && $domain[1]}
		<DatePicker
			on:change={updateRange}
			datePickerType="range"
			bind:valueFrom
			bind:valueTo
			dateFormat="Y-m-d"
		>
			<DatePickerInput labelText="Start date" />
			<DatePickerInput labelText="End date" />
		</DatePicker>
	{:else}
		<DatePickerSkeleton range={true} />
	{/if}
</div>
