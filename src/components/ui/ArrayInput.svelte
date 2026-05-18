<script>
  let { onSubmit, defaultSize = 10, maxSize = 100, maxValue = 200 } = $props();

  let text = $state('');
  let error = $state(null);

  function handleSubmit() {
    error = null;

    const parts = text
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (parts.length === 0) {
      error = 'Wpisz przynajmniej 2 liczby.';
      return;
    }

    const numbers = parts.map(Number);

    if (numbers.some((n) => isNaN(n))) {
      error = 'Wszystkie wartości muszą być liczbami.';
      return;
    }

    if (numbers.length < 2) {
      error = 'Potrzeba przynajmniej 2 elementów.';
      return;
    }

    if (numbers.length > maxSize) {
      error = `Maksymalnie ${maxSize} elementów.`;
      return;
    }

    onSubmit(numbers);
  }

  function handleRandom() {
    error = null;
    const arr = Array.from({ length: defaultSize }, () =>
      Math.floor(Math.random() * maxValue) + 1
    );
    text = arr.join(', ');
    onSubmit(arr);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') handleSubmit();
  }
</script>

<div class="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
  <label class="block text-sm text-slate-300 font-medium">
    Tablica do sortowania
  </label>

  <div class="flex gap-2">
    <input
      type="text"
      bind:value={text}
      onkeydown={handleKeydown}
      placeholder="np. 38, 12, 45, 7, 23"
      class="flex-1 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none placeholder:text-slate-600"
    />
    <button
      onclick={handleSubmit}
      class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
    >
      Sortuj
    </button>
    <button
      onclick={handleRandom}
      class="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
    >
      Losuj
    </button>
  </div>

  {#if error}
    <p class="text-xs text-red-400">{error}</p>
  {/if}
</div>
