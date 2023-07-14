<script lang="ts">
	import { Loading, Modal } from 'carbon-components-svelte';
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
	on:click:button--secondary={close}
	on:submit={enterDemo}
>
	<p>
		Do you want to try the dashboard with some demo data first? You can always toggle demo mode
		using the settings menu at the top right. You can also enable dark mode there ;)
	</p>
</Modal>
