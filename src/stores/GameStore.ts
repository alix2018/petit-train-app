import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_GAME_STARTED, LOCAL_STORAGE_ROUND_COUNTER } from '@/constants';
import { usePlayersStore } from '@/stores';

export const useGameStore = defineStore('game', () => {
  const DEFAULT_ROUND_NUMBER = 12;
  const playersStore = usePlayersStore();
  const gameStarted: Ref<boolean> = ref(false);
  const enableCounting: Ref<boolean> = ref(false);
  const roundCounter: Ref<number> = ref(DEFAULT_ROUND_NUMBER);
  // TO TEST
  // const gameStarted: Ref<boolean> = ref(true);
  // const enableCounting: Ref<boolean> = ref(true);

  watch(gameStarted, (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_GAME_STARTED, newValue.toString());
  });

  function startGame() {
    gameStarted.value = true;
  }

  watch(roundCounter, (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_ROUND_COUNTER, newValue.toString());
  });

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
      }
    }
  }

  return { gameStarted, enableCounting, startGame, resetGame, roundCounter, DEFAULT_ROUND_NUMBER };
});
