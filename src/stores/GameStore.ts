import { type Ref, ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_PLAYERS_ARRAY } from '@/constants';
import { useSessionStore, usePlayersStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router';

export const useGameStore = defineStore('game', () => {
  const sessionStore = useSessionStore();
  const playersStore = usePlayersStore();
  const route = useRoute();
  const router = useRouter();

  const currentRound: Ref<number | null> = ref(null);

  let initialized = false;

  function initGame() {
    if (initialized) {
      return;
    }

    initialized = true;

    const storage = sessionStore.readStorage();
    const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
    const storedPlayers = playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [];

    if (storedPlayers.length > 0) {
      for (const player of storedPlayers) {
        player.roundPoints = null;
      }
      playersStore.players = storedPlayers;
    }

    sessionStore.gameStarted = storage.gameStarted;
    sessionStore.roundCounter = storage.roundCounter;
    sessionStore.roundsHistory = storage.roundsHistory;

    const paramsId = route.params.id ? Number(route.params.id) : null;
    currentRound.value = paramsId ?? sessionStore.roundCounter;

    hydrateRound(currentRound.value);
  }

  const isEditMode = computed(
    () => currentRound.value !== null && currentRound.value !== sessionStore.roundCounter
  );

  watch(
    () => route.params.id,
    (newValue) => {
      currentRound.value = newValue ? Number(newValue) : sessionStore.roundCounter;

      const isEditing = currentRound.value !== sessionStore.roundCounter;

      if (sessionStore.enableCounting && !isEditing) {
        return;
      }

      playersStore.players.forEach((player) => {
        const previousScore = sessionStore.roundsHistory.reduce((total, history) => {
          if (history.round > currentRound.value!) {
            return total + (history.roundPoints[player.id] ?? 0);
          }
          return total;
        }, 0);

        const currentRoundHistory = sessionStore.roundsHistory.find(
          (h) => h.round === currentRound.value
        );

        player.previousScore = previousScore;
        player.roundPoints = isEditing ? currentRoundHistory?.roundPoints[player.id] ?? 0 : null;
      });
    },
    { immediate: true }
  );

  watch(
    () => sessionStore.gameStarted,
    (newValue) => {
      if (!newValue) {
        currentRound.value = sessionStore.DEFAULT_ROUND_NUMBER;
      }
    }
  );

  function hydrateRound(round: number) {
    const history = sessionStore.roundsHistory.find((r) => r.round === round);
    if (!history) {
      return;
    }

    playersStore.players.forEach((player) => {
      player.roundPoints = history.roundPoints[player.id] ?? null;
      player.previousScore = history.previousScore[player.id] ?? 0;
    });
  }

  function startGame() {
    sessionStore.startGame();
  }

  function resetGame() {
    for (const player of playersStore.players) {
      player.previousScore = 0;
      player.roundPoints = null;
    }
    sessionStore.resetSession();
    currentRound.value = sessionStore.roundCounter;
    router.push(ROUTE_NAMES.GAME);
  }

  return {
    currentRound,
    isEditMode,
    initGame,
    hydrateRound,
    startGame,
    resetGame
  };
});
