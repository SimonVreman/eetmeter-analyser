<script lang="ts">
	import { Content, Tile } from 'carbon-components-svelte';
	import CaloricHistory from '../components/charts/CaloricHistory.svelte';
	import Domain from '../components/charts/Domain.svelte';
	import TotalMacros from '../components/charts/TotalMacros.svelte';
</script>

<Content>
	<div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
		<h1>Dashboard</h1>
		<div class="flex justify-center w-full sm:justify-end">
			<Domain />
		</div>
	</div>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<div class="col-span-1 -mx-8 lg:col-span-2 md:mx-0">
			<Tile>
				<CaloricHistory />
			</Tile>
		</div>
		<div class="col-span-1 -mx-8 md:mx-0">
			<Tile>
				<TotalMacros />
			</Tile>
		</div>
	</div>
</Content>
