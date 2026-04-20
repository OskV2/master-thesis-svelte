<script>
  import { onMount } from 'svelte';
  import { kmpSearchSteps } from '$lib/algorithms/kmp.js';
  import { visualizationStore } from '$stores/visualizationStore.js';
  import KmpVisualizationSVG from './KmpVisualizationSVG.svelte';
  import StepList from '$components/ui/StepList.svelte';

  const DEFAULT_TEXT = 'ABABDABACDABABCABAB';
  const DEFAULT_PATTERN = 'ABABCABAB';

  let store = $derived($visualizationStore);

  let text = $state(DEFAULT_TEXT);
  let pattern = $state(DEFAULT_PATTERN);
  let error = $state(null);

  onMount(() => {
    const generated = kmpSearchSteps(DEFAULT_TEXT, DEFAULT_PATTERN);
    visualizationStore.loadAlgorithm({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN }, generated);
  });

  // Auto-play tick
  $effect(() => {
    if (!store.isPlaying) return;
    const timer = setInterval(() => visualizationStore.stepForward(), store.speed);
    return () => clearInterval(timer);
  });

  function handleSearch() {
    error = null;
    if (text.length === 0) { error = 'Wpisz tekst.'; return; }
    if (pattern.length === 0) { error = 'Wpisz wzorzec.'; return; }
    if (pattern.length > text.length) { error = 'Wzorzec dłuższy od tekstu.'; return; }

    const generated = kmpSearchSteps(text, pattern);
    visualizationStore.loadAlgorithm({ text, pattern }, generated);
  }

  let step = $derived(store.steps[store.currentStep]);
</script>

{#if step}
  <div>
    <!-- Input -->
    <div class="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex-1">
          <label class="block text-xs text-slate-500 mb-1 font-display">Tekst</label>
          <input
            type="text"
            value={text}
            oninput={(e) => { text = e.target.value.toUpperCase(); e.target.value = text; }}
            class="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs text-slate-500 mb-1 font-display">Wzorzec</label>
          <input
            type="text"
            value={pattern}
            oninput={(e) => { pattern = e.target.value.toUpperCase(); e.target.value = pattern; }}
            class="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div class="flex items-end">
          <button
            onclick={handleSearch}
            class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
          >
            Szukaj
          </button>
        </div>
      </div>
      {#if error}
        <p class="text-xs text-red-400">{error}</p>
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
        <KmpVisualizationSVG {step} height={450} />
      </div>
    </div>
  </div>
{/if}
