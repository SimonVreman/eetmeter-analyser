<script>
	import '../app.css';
	import 'carbon-components-svelte/css/all.css';
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
		HeaderPanelDivider,
		HeaderPanelLink,
		Toggle,
		ToggleSkeleton
	} from 'carbon-components-svelte';
	import Fade from 'carbon-icons-svelte/lib/Fade.svelte';
	import { SettingsAdjust, Upload } from 'carbon-icons-svelte';
	import { hasData } from '../stores/import-data';
	import CallToAction from '../components/CallToAction.svelte';

	let isSideNavOpen = false;
	let isSettingsOpen = false;
	let darkMode = 'g90';
</script>

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
						persist
					/>
					<span class="w-full ml-4"
						>{darkMode === 'g90' ? 'Disable dark mode' : 'Enable dark mode'}</span
					>
				</div>
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
