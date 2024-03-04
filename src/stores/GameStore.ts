import { type Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_GAME_STARTED } from '@/constants';
import { usePlayersStore } from '@/stores';

export const useGameStore = defineStore('game', () => {
  const playersStore = usePlayersStore();

  const gameStarted: Ref<boolean> = ref(false);
  // TO TEST
  // const gameStarted: Ref<boolean> = ref(true);

  watch(gameStarted, (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_GAME_STARTED, newValue.toString());
  });

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
      }
    }
  }

  return { gameStarted, startGame, resetGame };
});
