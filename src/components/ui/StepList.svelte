<script>
  import { tick } from 'svelte';

  let { steps = [], currentStep = 0, onStepClick, height = 300 } = $props();

  let listEl = $state(null);

  const TYPE_COLORS = {
    start: 'bg-slate-500',
    compare: 'bg-amber-500',
    swap: 'bg-red-500',
    sorted: 'bg-emerald-500',
    done: 'bg-emerald-400',
    pivot: 'bg-purple-500',
    partition: 'bg-indigo-500',
    split: 'bg-cyan-500',
    'merge-start': 'bg-blue-500',
    merge: 'bg-blue-400',
    merged: 'bg-teal-500',
    'lps-start': 'bg-slate-500',
    'lps-compare': 'bg-amber-500',
    'lps-match': 'bg-emerald-500',
    'lps-fallback': 'bg-orange-500',
    'lps-set': 'bg-slate-400',
    'lps-done': 'bg-emerald-400',
    'search-start': 'bg-slate-500',
    'search-compare': 'bg-amber-500',
    'search-match': 'bg-emerald-500',
    'search-mismatch': 'bg-red-500',
    'search-found': 'bg-emerald-400',
    'search-done': 'bg-emerald-400',
    'insert-compare': 'bg-amber-500',
    'insert-place': 'bg-emerald-500',
    'search-not-found': 'bg-red-400',
    'delete-find': 'bg-amber-500',
    'delete-case': 'bg-orange-500',
    'delete-done': 'bg-emerald-400',
    'traverse-visit': 'bg-indigo-500',
  };

  const TYPE_LABELS = {
    start: 'Start',
    compare: 'Porównanie',
    swap: 'Zamiana',
    sorted: 'Posortowany',
    done: 'Koniec',
    pivot: 'Pivot',
    partition: 'Partycja',
    split: 'Podział',
    'merge-start': 'Scalanie',
    merge: 'Scalanie',
    merged: 'Scalono',
    'lps-start': 'Start LPS',
    'lps-compare': 'LPS porówn.',
    'lps-match': 'LPS zgodność',
    'lps-fallback': 'LPS cofnięcie',
    'lps-set': 'LPS ustaw',
    'lps-done': 'LPS gotowa',
    'search-start': 'Start szuk.',
    'search-compare': 'Porównanie',
    'search-match': 'Zgodność',
    'search-mismatch': 'Niezgodność',
    'search-found': 'Znaleziono!',
    'search-done': 'Koniec szuk.',
    'insert-compare': 'Porównanie',
    'insert-place': 'Wstawiono',
    'search-not-found': 'Nie znaleziono',
    'delete-find': 'Szukanie',
    'delete-case': 'Usuwanie',
    'delete-done': 'Usunięto',
    'traverse-visit': 'Odwiedzono',
  };

  function getBadgeColor(type) {
    return TYPE_COLORS[type] ?? 'bg-slate-500';
  }

  function getBadgeLabel(type) {
    return TYPE_LABELS[type] ?? type;
  }

  $effect(() => {
    // trigger on currentStep change
    currentStep;
    tick().then(() => {
      if (!listEl) return;
      const item = listEl.querySelector('[data-active="true"]');
      if (!item) return;
      const itemTop = item.offsetTop - listEl.offsetTop;
      const scrollTarget = itemTop - listEl.clientHeight / 2 + item.offsetHeight / 2;
      listEl.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    });
  });
</script>

<div
  bind:this={listEl}
  class="overflow-y-auto rounded-xl bg-surface-light border border-slate-700/50 p-2"
  style="height: {height}px"
>
  {#each steps as step, index}
    {@const isActive = index === currentStep}
    {@const isPast = index < currentStep}
    <button
      data-active={isActive ? 'true' : undefined}
      onclick={() => onStepClick?.(index)}
      class="w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-start gap-2 {isActive
        ? 'bg-primary-600/20 border border-primary-500/30'
        : isPast
          ? 'opacity-50 hover:opacity-80 hover:bg-surface-lighter/30'
          : 'hover:bg-surface-lighter/30'}"
    >
      <span class="text-slate-600 font-display w-5 shrink-0 text-right">
        {index + 1}
      </span>

      <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold text-white shrink-0 {getBadgeColor(step.type)}">
        {getBadgeLabel(step.type)}
      </span>

      <span class="leading-relaxed {isActive ? 'text-slate-200' : 'text-slate-400'}">
        {step.description}
      </span>
    </button>
  {/each}
</div>
