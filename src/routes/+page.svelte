<script>
	import { onMount } from 'svelte';
	import Heading from '../components/Heading.svelte';
	import { typesenseInstantsearchAdapter } from '$lib/typesense';
	import instantsearch from 'instantsearch.js';
	import { configure, infiniteHits, refinementList } from 'instantsearch.js/es/widgets';

	onMount(async () => {
		const RenderChord = (await import('$lib/reactChords')).default;

		const search = instantsearch({
			indexName: 'guitar-chords',
			searchClient: typesenseInstantsearchAdapter().searchClient,
			future: {
				preserveSharedStateOnUnmount: true
			}
		});

		search.addWidgets([
			configure({
				hitsPerPage: 12,
				enablePersonalization: true
			}),
			infiniteHits({
				container: '#infiniteHits',
				templates: {
					item(hit, { html, components }) {
						// @ts-ignore
						const chord = html([RenderChord(hit.positions[0])]);
						const positionCount = hit.positions.length;

						return html`
							<h2 class="chord_name">
								${components.Highlight({ attribute: 'key', hit })}${hit.suffix}
							</h2>
							${chord}
							<span class="posCount"
								>${positionCount > 1 ? positionCount + ' positions' : '1 position'}</span
							>
						`;
					}
				}
			}),
			// Refinement lists
			refinementList({
				container: '#key_refinementList',
				attribute: 'key',
				sortBy: ['name'],
				limit: 7,
				showMore: true,
				showMoreLimit: 100
			}),
			refinementList({
				container: '#suffix_refinementList',
				attribute: 'suffix',
				limit: 8,
				showMore: true,
				showMoreLimit: 100,
				searchable: true,
				searchablePlaceholder: 'Search suffixes...'
			}),
			refinementList({
				container: '#capo_refinementList',
				attribute: 'positions.capo'
			})
		]);

		search.start();
	});
</script>

<svelte:head>
	<title>Guitar chords search Sveltekit | Typesense</title>
</svelte:head>

<main>
	<Heading />
	<div id="flex_row">
		<aside class="SearchAndFilter">
			<h3>Key</h3>
			<div id="key_refinementList"></div>
			<h3>Suffix</h3>
			<div id="suffix_refinementList"></div>
			<h3>Capo</h3>
			<div id="capo_refinementList"></div>
		</aside>
		<div id="infiniteHits"></div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: calc(3rem + 3.5vmax) 1rem;
		min-height: 100vh;
		min-height: 100dvh;
		gap: 5rem;
		width: 100%;
		max-width: min(1200px, 100vw);
		margin: auto;
		position: relative;
	}
	#flex_row {
		display: flex;
		width: 100%;
		align-items: flex-start;
		gap: 2rem;
		min-height: 474px;
	}
	#infiniteHits {
		flex: 1;
	}
</style>
