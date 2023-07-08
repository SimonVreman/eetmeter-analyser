<script lang="ts">
	import { db } from '../../lib/db';
	import ExploreTable from './ExploreTable.svelte';
</script>

<ExploreTable
	collection={db.consumptions}
	title="Consumptions"
	description="All individual consumption items imported."
	headers={[
		{ key: 'id', value: 'ID' },
		{ key: 'date', value: 'Date' },
		{ key: 'period', value: 'Period' },
		{ key: 'productId', value: 'ProductId' },
		{ key: 'grams', value: 'Amount (g)' }
	]}
/>
