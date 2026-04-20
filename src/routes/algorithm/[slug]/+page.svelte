<script>
  import { getAlgorithmBySlug } from '$lib/algorithms.js';
  import { ArrowLeft, Info } from 'lucide-svelte';
  import PlaybackControls from '$components/ui/PlaybackControls.svelte';
  import RenderModeToggle from '$components/ui/RenderModeToggle.svelte';
  import BubbleSortView from '$components/algorithms/BubbleSortView.svelte';
  import QuickSortView from '$components/algorithms/QuickSortView.svelte';
  import MergeSortView from '$components/algorithms/MergeSortView.svelte';
  import KmpView from '$components/algorithms/KmpView.svelte';
  import BstView from '$components/algorithms/BstView.svelte';

  let { data } = $props();
  const algorithm = $derived(getAlgorithmBySlug(data.slug));
</script>

{#if !algorithm}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
    <p class="text-slate-400">Nie znaleziono algorytmu.</p>
    <a href="/" class="text-primary-400 hover:underline mt-2 inline-block">
      Wróć do listy
    </a>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb / Back -->
    <a
      href="/"
      class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors mb-6"
    >
      <ArrowLeft size={16} />
      Wszystkie algorytmy
    </a>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white font-display">
          {algorithm.name}
        </h1>
        <p class="text-sm text-slate-500 font-display mt-1">
          {algorithm.nameEn}
        </p>
      </div>
      <RenderModeToggle />
    </div>

    <!-- Complexity info -->
    <div class="flex flex-wrap gap-3 mb-6">
      {#each Object.entries(algorithm.complexity.time) as [key, val]}
        <div class="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display">
          <span class="text-slate-500 capitalize">{key}: </span>
          <span class="text-primary-400">{val}</span>
        </div>
      {/each}
      <div class="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display">
        <span class="text-slate-500">Pamięć: </span>
        <span class="text-primary-400">{algorithm.complexity.space}</span>
      </div>
    </div>

    <!-- Visualization area -->
    {#if algorithm.slug === 'bubble-sort'}
      <BubbleSortView />
    {:else if algorithm.slug === 'quicksort'}
      <QuickSortView />
    {:else if algorithm.slug === 'merge-sort'}
      <MergeSortView />
    {:else if algorithm.slug === 'kmp'}
      <KmpView />
    {:else if algorithm.slug === 'bst'}
      <BstView />
    {/if}

    <!-- Playback controls -->
    <div class="mt-4">
      <PlaybackControls />
    </div>

    <!-- Description -->
    <div class="mt-8 p-5 rounded-xl bg-surface-light border border-slate-700/50">
      <div class="flex items-center gap-2 mb-3">
        <Info size={16} class="text-primary-400" />
        <h2 class="font-semibold text-slate-200">Opis algorytmu</h2>
      </div>
      <p class="text-sm text-slate-400 leading-relaxed">
        {algorithm.description}
      </p>
    </div>
  </div>
{/if}
