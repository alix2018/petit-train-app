import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import {
  LOCAL_STORAGE_GAME_STARTED,
  LOCAL_STORAGE_ROUND_COUNTER,
  LOCAL_STORAGE_ROUNDS_HISTORY
} from '@/constants';

export const useSessionStore = defineStore('session', () => {
  const DEFAULT_ROUND_NUMBER = 12;

  const gameStarted = ref(false);
  const roundCounter = ref(DEFAULT_ROUND_NUMBER);
  const enableCounting = ref(false);
  const roundsHistory = ref<
    { round: number; previousScore: Record<string, number>; roundPoints: Record<string, number> }[]
  >([]);

  watch(gameStarted, (val) => {
    localStorage.setItem(LOCAL_STORAGE_GAME_STARTED, val.toString());
  });

  watch(roundCounter, (val) => {
    localStorage.setItem(LOCAL_STORAGE_ROUND_COUNTER, val.toString());
  });

  watch(
    roundsHistory,
    (val) => {
      localStorage.setItem(LOCAL_STORAGE_ROUNDS_HISTORY, JSON.stringify(val));
    },
    { deep: true }
  );

  function readStorage() {
    return {
      gameStarted: JSON.parse(localStorage.getItem(LOCAL_STORAGE_GAME_STARTED) ?? 'false'),
      roundCounter: JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ROUND_COUNTER) ?? String(DEFAULT_ROUND_NUMBER)
      ),
      roundsHistory: JSON.parse(localStorage.getItem(LOCAL_STORAGE_ROUNDS_HISTORY) ?? '[]')
    };
  }

  function startGame() {
    gameStarted.value = true;
  }

  function resetSession() {
    roundCounter.value = DEFAULT_ROUND_NUMBER;
    enableCounting.value = false;
    roundsHistory.value = [];
    gameStarted.value = false;
  }

  function saveRoundHistory({
    roundNumber,
    players
  }: {
    roundNumber: number;
    players: { id: string; previousScore: number; roundPoints: number | null }[];
  }) {
    const previousScore: Record<string, number> = {};
    const roundPoints: Record<string, number> = {};

    players.forEach((p) => {
      previousScore[p.id] = p.previousScore ?? 0;
      roundPoints[p.id] = p.roundPoints ?? 0;
    });

    const existing = roundsHistory.value.find((r) => r.round === roundNumber);
    if (existing) {
      existing.previousScore = previousScore;
      existing.roundPoints = roundPoints;
    } else {
      roundsHistory.value.push({ round: roundNumber, previousScore, roundPoints });
    }
  }

  return {
    DEFAULT_ROUND_NUMBER,
    gameStarted,
    roundCounter,
    enableCounting,
    roundsHistory,
    readStorage,
    startGame,
    resetSession,
    saveRoundHistory
  };
});
