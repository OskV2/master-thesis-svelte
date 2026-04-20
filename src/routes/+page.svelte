<script>
  import { getAlgorithmsByCategory } from '$lib/algorithms.js';
  import { ArrowRight } from 'lucide-svelte';

  const categories = getAlgorithmsByCategory();
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Hero -->
  <div class="mb-12">
    <h1 class="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
      Algorytmy i Struktury Danych
    </h1>
    <p class="text-lg text-slate-400 max-w-2xl">
      Interaktywne wizualizacje algorytmów sortowania, wyszukiwania wzorców
      i struktur danych. Wybierz algorytm, aby zobaczyć jak działa krok po
      kroku.
    </p>
  </div>

  <!-- Algorithm grid by category -->
  <div class="space-y-10">
    {#each categories as category}
      <section>
        <div class="mb-4">
          <h2 class="text-xl font-semibold text-slate-200">
            {category.label}
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            {category.description}
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each category.algorithms as algo}
            <a
              href="/algorithm/{algo.slug}"
              class="group block p-5 rounded-xl bg-surface-light border border-slate-700/50 hover:border-primary-500/50 hover:bg-surface-lighter/50 transition-all duration-200"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
                    {algo.name}
                  </h3>
                  <p class="text-xs font-display text-slate-500 mt-0.5">
                    {algo.nameEn}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  class="text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all mt-1"
                />
              </div>

              <p class="text-sm text-slate-400 mb-4 leading-relaxed line-clamp-2">
                {algo.description}
              </p>

              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <span class="inline-flex items-center gap-1.5 text-xs font-display text-slate-400">
                  <span class="text-slate-500">Avg</span>
                  <span class="text-primary-400">{algo.complexity.time.average}</span>
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-display text-slate-400">
                  <span class="text-slate-500">Worst</span>
                  <span class="text-primary-400">{algo.complexity.time.worst}</span>
                </span>
                <span class="inline-flex items-center gap-1.5 text-xs font-display text-slate-400">
                  <span class="text-slate-500">Mem</span>
                  <span class="text-primary-400">{algo.complexity.space}</span>
                </span>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>
