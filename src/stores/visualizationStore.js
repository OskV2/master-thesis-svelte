import { writable, derived } from 'svelte/store';

function createVisualizationStore() {
  const { subscribe, set, update } = writable({
    isPlaying: false,
    speed: 500,
    currentStep: 0,
    totalSteps: 0,
    inputData: [],
    steps: [],
    renderMode: 'svg'
  });

  return {
    subscribe,

    play: () => update(s => ({ ...s, isPlaying: true })),

    pause: () => update(s => ({ ...s, isPlaying: false })),

    togglePlay: () => update(s => {
      if (!s.isPlaying && s.currentStep >= s.totalSteps - 1) return s;
      return { ...s, isPlaying: !s.isPlaying };
    }),

    reset: () => update(s => ({ ...s, isPlaying: false, currentStep: 0 })),

    setSpeed: (speed) => update(s => ({ ...s, speed })),

    setRenderMode: (mode) => update(s => ({ ...s, renderMode: mode })),

    stepForward: () => update(s => {
      if (s.currentStep < s.totalSteps - 1) {
        return { ...s, currentStep: s.currentStep + 1 };
      }
      return { ...s, isPlaying: false };
    }),

    stepBackward: () => update(s => {
      if (s.currentStep > 0) {
        return { ...s, currentStep: s.currentStep - 1 };
      }
      return s;
    }),

    goToStep: (step) => update(s => ({ ...s, currentStep: step })),

    loadAlgorithm: (inputData, steps) => update(s => ({
      ...s,
      inputData,
      steps,
      totalSteps: steps.length,
      currentStep: 0,
      isPlaying: false
    }))
  };
}

export const visualizationStore = createVisualizationStore();
