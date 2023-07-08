<script lang="ts">
	import { notifications } from '../../stores/notifications.js';
	import { ToastNotification } from 'carbon-components-svelte';
</script>

<div class="absolute bottom-0 right-0">
	{#each $notifications as notification}
		<ToastNotification
			kind={notification.type}
			title={notification.title}
			subtitle={notification.subtitle}
			caption={notification.caption}
		/>
	{/each}
</div>
