<script>
	import '../app.css';
	import 'carbon-components-svelte/css/all.css';
	import { theme } from '../stores/theme';
	import {
		Header,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		SideNavDivider,
		SkipToContent,
		HeaderUtilities,
		Theme,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider
	} from 'carbon-components-svelte';
	import Fade from 'carbon-icons-svelte/lib/Fade.svelte';
	import { browser } from '$app/environment';
	import { SettingsAdjust, Upload } from 'carbon-icons-svelte';
	import { hasData } from '../stores/import-data';
	import CallToAction from '../components/CallToAction.svelte';

	let isSideNavOpen = false;
	let isSettingsOpen = false;

	$: browser && document.documentElement.setAttribute('theme', $theme);
</script>

<Header company="Eetmeter" platformName="Analyser" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction bind:isOpen={isSettingsOpen} icon={SettingsAdjust}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Settings</HeaderPanelDivider>
				<Theme
					render="toggle"
					toggle={{
						themes: ['g10', 'g90'],
						labelA: 'Enable dark mode',
						labelB: 'Disable dark mode',
						hideLabel: true,
						size: 'sm'
					}}
				/>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail>
	<SideNavItems>
		<SideNavLink icon={Fade} text="Link 1" href="/" isSelected />
		<SideNavLink icon={Fade} text="Link 2" href="/" />
		<SideNavLink icon={Fade} text="Link 3" href="/" />
		<SideNavMenu icon={Fade} text="Menu">
			<SideNavMenuItem href="/" text="Link 1" />
			<SideNavMenuItem href="/" text="Link 2" />
			<SideNavMenuItem href="/" text="Link 3" />
		</SideNavMenu>
		<SideNavDivider />
		<SideNavLink icon={Fade} text="Link 4" href="/" />
	</SideNavItems>
</SideNav>

{#if $hasData}
	<slot />
{:else}
	<CallToAction icon={Upload} action="Import data" />
{/if}
