<script>
  import { visualizationStore } from '$stores/visualizationStore.js';
  import { Play, Pause, ChevronsLeft, ChevronsRight, RotateCcw } from 'lucide-svelte';

  const SPEED_OPTIONS = [1000, 500, 200, 50];

  let store = $derived($visualizationStore);
</script>

<div class="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
  <!-- Progress bar -->
  <div class="space-y-1.5">
    <div class="flex justify-between text-xs font-display text-slate-500">
      <span>Krok {store.currentStep + 1} z {store.totalSteps}</span>
    </div>
    <input
      type="range"
      min={0}
      max={Math.max(store.totalSteps - 1, 0)}
      value={store.currentStep}
      oninput={(e) => visualizationStore.goToStep(Number(e.target.value))}
      class="w-full h-1.5 bg-surface-lighter rounded-full appearance-none cursor-pointer accent-primary-500"
    />
  </div>

  <!-- Controls row -->
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div class="flex items-center gap-1.5">
      <button
        onclick={() => visualizationStore.reset()}
        disabled={store.currentStep === 0}
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        title="Resetuj"
      >
        <RotateCcw size={18} />
        Reset
      </button>

      <button
        onclick={() => visualizationStore.stepBackward()}
        disabled={store.currentStep === 0 || store.isPlaying}
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        title="Poprzedni krok"
      >
        <ChevronsLeft size={18} />
        Poprzedni
      </button>

      <button
        onclick={() => store.isPlaying ? visualizationStore.pause() : visualizationStore.play()}
        disabled={store.currentStep >= store.totalSteps - 1 && !store.isPlaying}
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {#if store.isPlaying}
          <Pause size={18} />
          Pauza
        {:else}
          <Play size={18} />
          Play
        {/if}
      </button>

      <button
        onclick={() => visualizationStore.stepForward()}
        disabled={store.currentStep >= store.totalSteps - 1 || store.isPlaying}
        class="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Następny
        <ChevronsRight size={18} />
      </button>
    </div>

    <!-- Speed selector -->
    <div class="flex items-center gap-1 ml-auto">
      <span class="text-xs text-slate-500">Prędkość:</span>
      {#each SPEED_OPTIONS as ms}
        <button
          onclick={() => visualizationStore.setSpeed(ms)}
          class="px-2 py-1 rounded text-xs font-display {store.speed === ms
            ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
            : 'text-slate-500 hover:text-slate-300'}"
        >
          {ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`}
        </button>
      {/each}
    </div>
  </div>
</div>
