<script>
	import { Tile } from 'carbon-components-svelte';
</script>

<!-- spacer -->
<div class="max-w-lg w-full -mr-8 shrink-0" />

<Tile class="max-w-lg w-full flex flex-col fixed top-12 right-0" style="height: calc(100vh - 3rem)">
	<div class="grow-0 header text-xl font-semibold">
		<slot name="header" />
	</div>
	<div class="grow-1 h-full">
		<slot name="content" />
	</div>
	<slot name="footer" />
</Tile>

<style lang="postcss">
	.header {
		@apply -mx-4 -mt-4 p-4 border-b border-[var(--cds-ui-03)] border-solid;
	}
</style>
