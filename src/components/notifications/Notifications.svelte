<script lang="ts">
	import { notifications } from '../../stores/notifications.js';
	import { ToastNotification } from 'carbon-components-svelte';
	import dayjs from 'dayjs';
</script>

<div class="absolute bottom-0 right-0">
	{#each $notifications as notification}
		<ToastNotification
			kind={notification.type}
			title={notification.title}
			subtitle={notification.subtitle}
			caption={dayjs().format('HH:mm:ss')}
		/>
	{/each}
</div>
