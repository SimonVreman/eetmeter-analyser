<script lang="ts">
	import { InlineLoading, Loading, Modal } from 'carbon-components-svelte';
	import { demo, newUser } from '../../stores/demo';
	import { enterDemoMode } from '../../lib/demo';
	import { clearChartCache } from '../../stores/charts';

	let open = true;
	let loading = false;

	function close() {
		$newUser = false;
		open = false;
	}

	function enterDemo() {
		loading = true;
		$demo = true;
		enterDemoMode()
			.then(() => {
				clearChartCache();
				close();
			})
			.finally(() => {
				loading = false;
			});
	}
</script>

{#if loading}
	<Loading />
{/if}

<Modal
	bind:open
	modalHeading="Welcome!"
	primaryButtonText="Demo mode"
	secondaryButtonText="Cancel"
	primaryButtonDisabled={loading}
	preventCloseOnClickOutside={loading}
	on:click:button--secondary={close}
	on:submit={enterDemo}
>
	<div class="relative">
		<p class="pb-8">
			Do you want to try the dashboard with some demo data first? You can always toggle demo mode
			using the settings menu at the top right. You can also enable dark mode there ;)
		</p>
		{#if loading}
			<InlineLoading class="absolute bottom-0" description="Loading demo data..." />
		{/if}
	</div>
</Modal>
