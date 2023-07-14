<script lang="ts">
	import { Column, Content, Grid, Row, Tab, TabContent, Tabs } from 'carbon-components-svelte';
	import ConsumptionTable from '../../components/tables/ConsumptionTable.svelte';
	import NutrientsTable from '../../components/tables/NutrientsTable.svelte';
	import ProductTable from '../../components/tables/ProductTable.svelte';
	import MetaHead from '../../components/head/MetaHead.svelte';
</script>

<MetaHead title="Explore" description="Explore all your imported data." />

<Content class="flex">
	<Grid class="w-full shrink">
		<Row>
			<Column>
				<h1 class="mb-8">Explore data</h1>
				<div class="-mx-12 md:mx-0">
					<Tabs type="container">
						<Tab label="Products" />
						<Tab label="Consumptions" />
						<Tab label="Nutrients" />
						<svelte:fragment slot="content">
							<TabContent><ProductTable /></TabContent>
							<TabContent><ConsumptionTable /></TabContent>
							<TabContent><NutrientsTable /></TabContent>
						</svelte:fragment>
					</Tabs>
				</div>
			</Column>
		</Row>
	</Grid>
</Content>
