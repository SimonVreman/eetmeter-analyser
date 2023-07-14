<script>
	import 'carbon-components-svelte/css/all.css';
	import '@carbon/styles/css/styles.css';
	import '@carbon/charts-svelte/styles.css';
	import '../app.css';
	import {
		Header,
		SideNav,
		SideNavItems,
		SideNavLink,
		SideNavDivider,
		SkipToContent,
		HeaderUtilities,
		Theme,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		Button,
		Loading
	} from 'carbon-components-svelte';
	import { Dashboard, DataTable, SettingsAdjust, Upload } from 'carbon-icons-svelte';
	import { page } from '$app/stores';
	import Notifications from '../components/notifications/Notifications.svelte';
	import { theme } from '../stores/theme';
	import { demo, newUser } from '../stores/demo';
	import DemoBanner from '../components/intro/DemoBanner.svelte';
	import IntroModal from '../components/intro/IntroModal.svelte';
	import { enterDemoMode, exitDemoMode } from '$lib/demo';
	import { clearChartCache } from '../stores/charts';

	let isSideNavOpen = false;
	let isSettingsOpen = false;
	let darkMode = 'g90';
	let segment;
	let loading = false;

	function toggleDemo() {
		loading = true;
		($demo ? exitDemoMode : enterDemoMode)()
			.then(() => {
				clearChartCache();
				$demo = !$demo;
			})
			.finally(() => {
				loading = false;
			});
	}

	$: {
		const split = $page.url.pathname.split('/');
		segment = split && split.length > 1 ? split[1] : '';
	}

	$: $theme = darkMode;
</script>

<Theme bind:theme={darkMode} persist />

{#if $newUser}
	<IntroModal />
{/if}
{#if $demo}
	<DemoBanner />
{/if}
{#if loading}
	<Loading />
{/if}

<Header company="Eetmeter" platformName="Analyser" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction bind:isOpen={isSettingsOpen} icon={SettingsAdjust}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Settings</HeaderPanelDivider>
				<div class="ml-4 flex items-center">
					<Theme
						render="toggle"
						toggle={{
							themes: ['g10', 'g90'],
							labelA: '',
							labelB: '',
							hideLabel: true
						}}
						bind:theme={darkMode}
					/>
					<span class="w-full ml-4"
						>{darkMode === 'g90' ? 'Disable dark mode' : 'Enable dark mode'}</span
					>
				</div>
				<Button class="absolute w-full bottom-0" on:click={toggleDemo} disabled={loading}
					>{$demo ? 'Leave demo' : 'Enter demo'}</Button
				>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail>
	<SideNavItems>
		<SideNavLink icon={Dashboard} text="Dashboard" href="/" isSelected={segment === ''} />
		<SideNavLink
			icon={DataTable}
			text="Explore"
			href="/explore"
			isSelected={segment === 'explore'}
		/>
		<SideNavDivider />
		<SideNavLink icon={Upload} text="Import" href="/import" isSelected={segment === 'import'} />
	</SideNavItems>
</SideNav>

<slot />

<Notifications />
