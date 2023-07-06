<script>
	import '../app.css';
	import 'carbon-components-svelte/css/all.css';
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
		Content
	} from 'carbon-components-svelte';
	import { Dashboard, DataTable, SettingsAdjust, Upload } from 'carbon-icons-svelte';
	import { page } from '$app/stores';

	let isSideNavOpen = false;
	let isSettingsOpen = false;
	let darkMode = 'g90';
	let segment;

	$: {
		const split = $page.url.pathname.split('/');
		segment = split && split.length > 1 ? split[1] : '';
	}
</script>

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

<Header company="Eetmeter" platformName="Analyser" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderAction bind:isOpen={isSettingsOpen} icon={SettingsAdjust}>
			<HeaderPanelLinks>
				<HeaderPanelDivider>Settings</HeaderPanelDivider>
				<div class="ml-4 flex items-center">
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

<Content>
	<slot />
</Content>
