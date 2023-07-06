<script>
	import { Button } from 'carbon-components-svelte';

	export let icon;
	export let action;
</script>

<div class="flex items-center justify-center">
	<Button {icon}>{action}</Button>
</div>
