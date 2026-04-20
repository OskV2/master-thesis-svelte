import { writable } from 'svelte/store';

function createQuizStore() {
  const { subscribe, set, update } = writable({
    isActive: false,
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    score: null,
    selectedAlgorithms: [],
    questionCount: 10
  });

  return {
    subscribe,

    setSelectedAlgorithms: (algorithms) => update(s => ({ ...s, selectedAlgorithms: algorithms })),

    setQuestionCount: (count) => update(s => ({ ...s, questionCount: count })),

    startQuiz: (questions) => update(s => ({
      ...s,
      isActive: true,
      questions,
      answers: new Array(questions.length).fill(null),
      currentQuestionIndex: 0,
      score: null
    })),

    answerQuestion: (questionIndex, answer) => update(s => {
      const answers = [...s.answers];
      answers[questionIndex] = answer;
      return { ...s, answers };
    }),

    nextQuestion: () => update(s => {
      if (s.currentQuestionIndex < s.questions.length - 1) {
        return { ...s, currentQuestionIndex: s.currentQuestionIndex + 1 };
      }
      return s;
    }),

    prevQuestion: () => update(s => {
      if (s.currentQuestionIndex > 0) {
        return { ...s, currentQuestionIndex: s.currentQuestionIndex - 1 };
      }
      return s;
    }),

    goToQuestion: (index) => update(s => ({ ...s, currentQuestionIndex: index })),

    finishQuiz: () => update(s => {
      let correct = 0;
      s.questions.forEach((q, i) => {
        if (s.answers[i] === q.correctAnswer) correct++;
      });
      return {
        ...s,
        isActive: false,
        score: {
          correct,
          total: s.questions.length,
          percentage: Math.round((correct / s.questions.length) * 100)
        }
      };
    }),

    resetQuiz: () => update(s => ({
      ...s,
      isActive: false,
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      score: null
    }))
  };
}

export const quizStore = createQuizStore();
