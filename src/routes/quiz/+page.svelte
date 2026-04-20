<script>
  import { ALGORITHMS } from '$lib/algorithms.js';
  import { quizStore } from '$stores/quizStore.js';
  import allQuestions from '$lib/data/quizQuestions.json';
  import {
    FlaskConical,
    CheckCircle2,
    XCircle,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
  } from 'lucide-svelte';

  let store = $derived($quizStore);

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  // Setup state
  let selected = $state(ALGORITHMS.map((a) => a.id));

  let questionCount = $derived(
    allQuestions.filter((q) => selected.includes(q.algorithmId)).length
  );

  function toggle(id) {
    if (selected.includes(id)) {
      selected = selected.filter((s) => s !== id);
    } else {
      selected = [...selected, id];
    }
    quizStore.setSelectedAlgorithms(selected);
  }

  function handleStart() {
    const pool = allQuestions.filter((q) => selected.includes(q.algorithmId));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    quizStore.startQuiz(shuffled);
  }

  function handleReset() {
    quizStore.resetQuiz();
  }

  // Derived quiz state
  let question = $derived(store.questions[store.currentQuestionIndex]);
  let currentAnswer = $derived(store.answers[store.currentQuestionIndex]);
  let isLast = $derived(store.currentQuestionIndex === store.questions.length - 1);
  let allAnswered = $derived(store.answers.every((a) => a !== null));
  let passed = $derived(store.score ? store.score.percentage >= 60 : false);
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- Setup screen -->
  {#if !store.isActive && !store.score}
    <div class="max-w-xl mx-auto">
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-primary-600/20 flex items-center justify-center mx-auto mb-4">
          <FlaskConical size={28} class="text-primary-400" />
        </div>
        <h1 class="text-2xl font-bold text-white font-display">Test wiedzy</h1>
        <p class="text-slate-400 mt-2">
          Sprawdź swoją znajomość algorytmów i struktur danych.
        </p>
      </div>

      <div class="bg-surface-light border border-slate-700/50 rounded-xl p-5 mb-6">
        <h2 class="font-semibold text-slate-200 mb-3">Wybierz zakres testu</h2>
        <div class="grid gap-2">
          {#each ALGORITHMS as algo}
            {@const count = allQuestions.filter((q) => q.algorithmId === algo.id).length}
            <label
              class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors {selected.includes(algo.id)
                ? 'bg-primary-600/10 border border-primary-500/30'
                : 'bg-surface-lighter/30 border border-transparent hover:border-slate-600'}"
            >
              <input
                type="checkbox"
                checked={selected.includes(algo.id)}
                onchange={() => toggle(algo.id)}
                class="accent-primary-500"
              />
              <div class="flex-1">
                <span class="text-sm text-slate-200">{algo.name}</span>
                <span class="text-xs text-slate-500 ml-2">{algo.nameEn}</span>
              </div>
              <span class="text-xs text-slate-500">{count} pyt.</span>
            </label>
          {/each}
        </div>
      </div>

      <button
        onclick={handleStart}
        disabled={selected.length === 0 || questionCount === 0}
        class="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Rozpocznij test ({questionCount}
        {questionCount === 1 ? 'pytanie' : questionCount < 5 ? 'pytania' : 'pytań'})
      </button>
    </div>
  {/if}

  <!-- Question screen -->
  {#if store.isActive && question}
    <div class="max-w-2xl mx-auto">
      <!-- Progress -->
      <div class="mb-6">
        <div class="flex items-center justify-between text-sm text-slate-400 mb-2">
          <span>Pytanie {store.currentQuestionIndex + 1} z {store.questions.length}</span>
          <span>{store.answers.filter((a) => a !== null).length} / {store.questions.length} odpowiedzi</span>
        </div>
        <div class="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            class="h-full bg-primary-500 rounded-full transition-all duration-300"
            style="width: {((store.currentQuestionIndex + 1) / store.questions.length) * 100}%"
          ></div>
        </div>
      </div>

      <!-- Question card -->
      <div class="bg-surface-light border border-slate-700/50 rounded-xl p-6 mb-4">
        <p class="text-slate-100 font-medium text-base leading-relaxed mb-6">
          {question.question}
        </p>

        <div class="grid gap-2">
          {#each question.options as option, i}
            {@const letter = OPTION_LETTERS[i]}
            {@const isSelected = currentAnswer === option}
            <button
              onclick={() => quizStore.answerQuestion(store.currentQuestionIndex, option)}
              class="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all {isSelected
                ? 'border-primary-500 bg-primary-600/15 text-slate-100'
                : 'border-slate-700/50 bg-surface-lighter/20 text-slate-300 hover:border-slate-500 hover:bg-surface-lighter/40'}"
            >
              <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors {isSelected
                ? 'bg-primary-600 text-white'
                : 'bg-surface-lighter text-slate-400'}">
                {letter}
              </span>
              <span class="text-sm">{option}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex gap-3">
        <button
          onclick={() => quizStore.prevQuestion()}
          disabled={store.currentQuestionIndex === 0}
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light border border-slate-700/50 text-slate-300 hover:bg-surface-lighter hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Wstecz
        </button>

        <div class="flex-1"></div>

        {#if isLast}
          <button
            onclick={() => quizStore.finishQuiz()}
            disabled={!allAnswered}
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Zakończ test
            <CheckCircle2 size={16} />
          </button>
        {:else}
          <button
            onclick={() => quizStore.nextQuestion()}
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Dalej
            <ChevronRight size={16} />
          </button>
        {/if}
      </div>

      <!-- Question dots -->
      <div class="flex flex-wrap gap-1.5 mt-5 justify-center">
        {#each store.questions as _, i}
          <button
            onclick={() => quizStore.goToQuestion(i)}
            class="w-7 h-7 rounded-full text-xs font-display transition-colors {i === store.currentQuestionIndex
              ? 'bg-primary-600 text-white'
              : store.answers[i] !== null
                ? 'bg-emerald-700/60 text-emerald-300'
                : 'bg-surface-light border border-slate-700/50 text-slate-500 hover:border-slate-500'}"
          >
            {i + 1}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Results screen -->
  {#if !store.isActive && store.score}
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 {passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}">
          {#if passed}
            <CheckCircle2 size={40} class="text-emerald-400" />
          {:else}
            <XCircle size={40} class="text-red-400" />
          {/if}
        </div>
        <h2 class="text-3xl font-bold text-white font-display mb-1">
          {store.score.percentage}%
        </h2>
        <p class="text-slate-400">
          {store.score.correct} z {store.score.total} poprawnych odpowiedzi
        </p>
        <p class="text-sm text-slate-500 mt-1">
          {passed
            ? 'Dobra robota! Znasz te algorytmy.'
            : 'Spróbuj jeszcze raz — powtórka czyni mistrza!'}
        </p>
      </div>

      <div class="space-y-3 mb-8">
        {#each store.questions as q, i}
          {@const userAnswer = store.answers[i]}
          {@const isCorrect = userAnswer === q.correctAnswer}
          <div class="rounded-xl border p-4 {isCorrect
            ? 'border-emerald-700/50 bg-emerald-900/10'
            : 'border-red-700/50 bg-red-900/10'}">
            <div class="flex items-start gap-3">
              <div class="shrink-0 mt-0.5">
                {#if isCorrect}
                  <CheckCircle2 size={16} class="text-emerald-400" />
                {:else}
                  <XCircle size={16} class="text-red-400" />
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-200 mb-2">{q.question}</p>
                {#if !isCorrect}
                  <div class="space-y-1 text-xs">
                    <p class="text-red-400">Twoja odpowiedź: {userAnswer ?? '—'}</p>
                    <p class="text-emerald-400">Poprawna: {q.correctAnswer}</p>
                  </div>
                {:else}
                  <p class="text-xs text-emerald-400">{q.correctAnswer}</p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <button
        onclick={handleReset}
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-light border border-slate-700/50 text-slate-200 hover:bg-surface-lighter transition-colors"
      >
        <RotateCcw size={16} />
        Spróbuj ponownie
      </button>
    </div>
  {/if}
</div>
