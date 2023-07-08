<script lang="ts">
	import { db } from '../../lib/db';
	import ExploreTable from './ExploreTable.svelte';
</script>

<ExploreTable
	collection={db.nutrients}
	title="Nutrients"
	description="Available nutrient types, predefined."
	headers={[
		{ key: 'id', value: 'ID' },
		{ key: 'name', value: 'Name' },
		{ key: 'unit', value: 'Unit' }
	]}
/>
