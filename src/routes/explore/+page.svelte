<script lang="ts">
	import { Column, Content, Grid, Row, Tab, TabContent, Tabs } from 'carbon-components-svelte';
	import ConsumptionTable from '../../components/tables/ConsumptionTable.svelte';
	import NutrientsTable from '../../components/tables/NutrientsTable.svelte';
</script>

<Content class="flex">
	<Grid class="w-full shrink">
		<Row>
			<Column>
				<h1 class="mb-8">Explore data</h1>
				<Tabs type="container">
					<Tab label="Consumptions" />
					<Tab label="Products" />
					<Tab label="Nutrients" />
					<svelte:fragment slot="content">
						<TabContent><ConsumptionTable /></TabContent>
						<TabContent>products</TabContent>
						<TabContent><NutrientsTable /></TabContent>
					</svelte:fragment>
				</Tabs>
			</Column>
		</Row>
	</Grid>
</Content>
