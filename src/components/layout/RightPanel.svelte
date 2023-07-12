<script>
	import { Tile } from 'carbon-components-svelte';
</script>

<!-- spacer -->
<div class="hidden md:block max-w-sm lg:max-w-lg w-full -mr-8 shrink-0" />

<Tile
	class="-mx-8 -mb-8 mt-4 min-w-fit md:min-w-0 md:w-full md:m-0 md:max-w-sm lg:max-w-lg flex flex-col md:fixed md:top-12 md:right-0 md:h-[calc(100vh-3rem)]"
>
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
