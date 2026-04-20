<script>
  import { onMount } from 'svelte';
  import { visualizationStore } from '$stores/visualizationStore.js';
  import SortingBarsSVG from './SortingBarsSVG.svelte';
  import SortingBarsCanvas from './SortingBarsCanvas.svelte';
  import ArrayInput from '$components/ui/ArrayInput.svelte';
  import StepList from '$components/ui/StepList.svelte';

  const FALLBACK_ARRAY = [38, 12, 45, 7, 23, 56, 31, 18, 42, 9];

  let { generateSteps, defaultArray = FALLBACK_ARRAY } = $props();

  let store = $derived($visualizationStore);

  onMount(() => {
    const generated = generateSteps(defaultArray);
    visualizationStore.loadAlgorithm(defaultArray, generated);
  });

  // Auto-play tick
  $effect(() => {
    if (!store.isPlaying) return;
    const timer = setInterval(() => {
      visualizationStore.stepForward();
    }, store.speed);
    return () => clearInterval(timer);
  });

  function handleNewArray(arr) {
    const generated = generateSteps(arr);
    visualizationStore.loadAlgorithm(arr, generated);
  }

  let step = $derived(store.steps[store.currentStep]);

  // Normalize: bubble/quick use "sorted", merge uses "merging"
  let sortedIndices = $derived.by(() => {
    if (!step) return [];
    if (step.sorted) {
      return Array.isArray(step.sorted) ? step.sorted : [...step.sorted];
    }
    return step.merging ?? [];
  });
</script>

{#if step}
  <div>
    <ArrayInput onSubmit={handleNewArray} />

    <div class="mt-3 flex flex-col lg:flex-row gap-3">
      <div class="w-full lg:w-[30%] shrink-0 order-2 lg:order-1">
        <StepList
          steps={store.steps}
          currentStep={store.currentStep}
          onStepClick={(i) => visualizationStore.goToStep(i)}
          height={450}
        />
      </div>

      <div class="flex-1 min-w-0 order-1 lg:order-2">
        {#if store.renderMode === 'svg'}
          <SortingBarsSVG
            array={step.array}
            comparing={step.comparing ?? []}
            sorted={sortedIndices}
            height={450}
          />
        {:else}
          <SortingBarsCanvas
            array={step.array}
            comparing={step.comparing ?? []}
            sorted={sortedIndices}
            height={450}
          />
        {/if}
      </div>
    </div>
  </div>
{/if}
