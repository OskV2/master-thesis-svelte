<script>
  import { visualizationStore } from '$stores/visualizationStore.js';

  let store = $derived($visualizationStore);
</script>

<div class="inline-flex items-center bg-surface-light border border-slate-700/50 rounded-lg p-1">
  {#each ['svg', 'canvas'] as mode}
    <button
      onclick={() => visualizationStore.setRenderMode(mode)}
      class="px-3 py-1.5 rounded-md text-xs font-display font-medium uppercase tracking-wide transition-colors {store.renderMode === mode
        ? 'bg-primary-600/20 text-primary-400'
        : 'text-slate-500 hover:text-slate-300'}"
    >
      {mode}
    </button>
  {/each}
</div>
