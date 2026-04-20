<script>
  import { onMount } from 'svelte';
  import { BST } from '$lib/algorithms/bst.js';
  import { visualizationStore } from '$stores/visualizationStore.js';
  import BstVisualizationSVG from './BstVisualizationSVG.svelte';
  import StepList from '$components/ui/StepList.svelte';

  const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80];

  let store = $derived($visualizationStore);

  let bst = $state(null);
  let inputValue = $state('');
  let error = $state(null);

  onMount(() => {
    const result = BST.buildFromArray(DEFAULT_VALUES);
    bst = result.bst;
    visualizationStore.loadAlgorithm(DEFAULT_VALUES, result.steps);
  });

  // Auto-play tick
  $effect(() => {
    if (!store.isPlaying) return;
    const timer = setInterval(() => visualizationStore.stepForward(), store.speed);
    return () => clearInterval(timer);
  });

  function runOperation(operation) {
    error = null;
    const val = Number(inputValue);
    if (isNaN(val) || inputValue.trim() === '') {
      error = 'Wpisz liczbę.';
      return;
    }

    if (!bst) return;

    let newSteps;
    switch (operation) {
      case 'insert':
        newSteps = bst.insert(val);
        break;
      case 'search':
        newSteps = bst.search(val);
        break;
      case 'delete':
        newSteps = bst.delete(val);
        break;
      default:
        return;
    }

    const allSteps = [...store.steps, ...newSteps];
    const prevLength = store.steps.length;
    visualizationStore.loadAlgorithm(null, allSteps);
    visualizationStore.goToStep(prevLength);
    inputValue = '';
  }

  function handleReset() {
    const result = BST.buildFromArray(DEFAULT_VALUES);
    bst = result.bst;
    visualizationStore.loadAlgorithm(DEFAULT_VALUES, result.steps);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') runOperation('insert');
  }

  let step = $derived(store.steps[store.currentStep]);
</script>

{#if step}
  <div>
    <!-- Input -->
    <div class="bg-surface-light border border-slate-700/50 rounded-xl p-4">
      <div class="flex flex-wrap gap-2 items-end">
        <div>
          <label class="block text-xs text-slate-500 mb-1 font-display">Wartość</label>
          <input
            type="number"
            bind:value={inputValue}
            onkeydown={handleKeydown}
            placeholder="np. 25"
            class="w-28 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <button
          onclick={() => runOperation('insert')}
          class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
        >
          Wstaw
        </button>
        <button
          onclick={() => runOperation('search')}
          class="px-4 py-2 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500"
        >
          Szukaj
        </button>
        <button
          onclick={() => runOperation('delete')}
          class="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500"
        >
          Usuń
        </button>
        <button
          onclick={handleReset}
          class="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
        >
          Reset
        </button>
      </div>
      {#if error}
        <p class="text-xs text-red-400 mt-2">{error}</p>
      {/if}
    </div>

    <!-- Visualization + step list -->
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
        <BstVisualizationSVG {step} height={450} />
      </div>
    </div>
  </div>
{/if}
