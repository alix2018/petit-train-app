import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import {
  LOCAL_STORAGE_GAME_STARTED,
  LOCAL_STORAGE_ROUND_COUNTER,
  LOCAL_STORAGE_ROUNDS_HISTORY
} from '@/constants';
import type { Players } from '@/types';
import { usePlayersStore } from '@/stores';

export const useGameStore = defineStore('game', () => {
  const DEFAULT_ROUND_NUMBER = 12;
  const playersStore = usePlayersStore();
  const gameStarted: Ref<boolean> = ref(false);
  const enableCounting: Ref<boolean> = ref(false);
  const roundCounter: Ref<number> = ref(DEFAULT_ROUND_NUMBER);
  const roundsHistory = ref<{ round: number; scores: Record<string, number> }[]>([]);

  watch(gameStarted, (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_GAME_STARTED, newValue.toString());
  });

  watch(roundCounter, (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_ROUND_COUNTER, newValue.toString());
  });

  watch(
    roundsHistory,
    (newValue) => {
      localStorage.setItem(LOCAL_STORAGE_ROUNDS_HISTORY, JSON.stringify(newValue));
    },
    { deep: true }
  );

  function saveRoundHistory({ roundNumber, players }: { roundNumber: number; players: Players }) {
    const scores: Record<string, number> = {};

    players.forEach((player) => {
      scores[player.id] = player.tempInputPoints ?? 0;
    });

    const existingRound = roundsHistory.value.find((r) => r.round === roundNumber);

    if (existingRound) {
      existingRound.scores = scores;
    } else {
      roundsHistory.value.push({
        round: roundNumber,
        scores
      });
    }
  }

  function startGame() {
    gameStarted.value = true;
  }

  function resetGame() {
    if (
      confirm('Es-tu sûr de vouloir remettre les compteurs à 0 et garder les mêmes joueurs ?') ===
      true
    ) {
      for (const player of playersStore.players) {
        player.points = 0;
        player.roundPoints = 0;
        roundCounter.value = DEFAULT_ROUND_NUMBER;
        enableCounting.value = false;
        roundsHistory.value = [];
      }
    }
  }

  return {
    gameStarted,
    enableCounting,
    roundsHistory,
    saveRoundHistory,
    startGame,
    resetGame,
    roundCounter,
    DEFAULT_ROUND_NUMBER
  };
});
