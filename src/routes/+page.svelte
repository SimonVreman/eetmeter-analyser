<script lang="ts">
	import { Content, Tile } from 'carbon-components-svelte';
	import CaloricHistory from '../components/charts/CaloricHistory.svelte';
	import Domain from '../components/charts/Domain.svelte';
</script>

<Content>
	<div class="mb-4 flex justify-between">
		<h1 class="">Dashboard</h1>
		<Domain />
	</div>
	<Tile>
		<CaloricHistory />
	</Tile>
</Content>
