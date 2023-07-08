<script lang="ts">
	import { db } from '../../lib/db';
	import ExploreTable from './ExploreTable.svelte';
</script>

<ExploreTable
	collection={db.products}
	title="Products"
	description="Collection of unique products imported."
	headers={[
		{ key: 'id', value: 'ID' },
		{ key: 'name', value: 'Name' },
		{ key: 'brand', value: 'Brand' },
		{ key: 'nevo', value: 'NEVO' }
	]}
	formatter={(item) => ({
		...item,
		nevo: item.nevo ? item.nevo : '',
		brand: item.brand ? item.brand : ''
	})}
/>
