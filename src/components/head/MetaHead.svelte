<script>
	import { MetaTags } from 'svelte-meta-tags';

	export let title = '';
	export let description = '';
</script>

<MetaTags {title} {description} titleTemplate="%s | Eetmeter Analyser" />
