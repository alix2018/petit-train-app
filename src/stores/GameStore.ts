import { type Ref, ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { ROUTE_NAMES } from '@/router';
import { LOCAL_STORAGE_PLAYERS_ARRAY } from '@/constants';
import { useSessionStore } from '@/stores';
import { usePlayersStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';

export const useGameStore = defineStore('game', () => {
  const sessionStore = useSessionStore();
  const playersStore = usePlayersStore();
  const route = useRoute();
  const router = useRouter();

  const currentRound: Ref<number | null> = ref(null);

  let initialized = false;

  function initGame() {
    if (initialized) return;
    initialized = true;

    const storage = sessionStore.readStorage();
    const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
    const storedPlayers = playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [];

    if (storedPlayers.length > 0) {
      for (const player of storedPlayers) {
        player.roundScore = 0;
        player.roundPoints = null;
      }
      playersStore.players = storedPlayers;
    }

    sessionStore.gameStarted = storage.gameStarted;
    sessionStore.roundCounter = storage.roundCounter;
    sessionStore.roundsHistory = storage.roundsHistory;

    const paramsId = route.params.id ? Number(route.params.id) : null;
    currentRound.value = paramsId ?? sessionStore.roundCounter;
  }

  const isUpdatingRound = computed(
    () => currentRound.value !== null && currentRound.value !== sessionStore.roundCounter
  );

  watch(isUpdatingRound, (newValue) => {
    if (newValue) {
      const currentRoundHistory = sessionStore.roundsHistory.find(
        (h) => h.round === currentRound.value
      );

      playersStore.players.forEach((player) => {
        const previousScore = sessionStore.roundsHistory.reduce((total, history) => {
          if (history.round > currentRound.value!) {
            return total + (history.roundPoints[player.id] ?? 0);
          }
          return total;
        }, 0);

        const roundPoints = currentRoundHistory?.roundPoints[player.id] ?? 0;

        player.previousScore = previousScore;
        player.roundPoints = roundPoints;
        player.roundScore = previousScore + roundPoints;
      });
    } else if (currentRound.value === sessionStore.roundCounter) {
      playersStore.players.forEach((player) => {
        const previousScore = sessionStore.roundsHistory.reduce((total, history) => {
          if (history.round > currentRound.value!) {
            return total + (history.roundPoints[player.id] ?? 0);
          }
          return total;
        }, 0);

        player.previousScore = previousScore;
        player.roundPoints = null;
        player.roundScore = previousScore;
      });
    }
  });

  watch(
    () => route.params.id,
    (newValue) => {
      currentRound.value = newValue ? Number(newValue) : sessionStore.roundCounter;
      hydrateRound(currentRound.value);
    },
    { immediate: true }
  );

  function hydrateRound(round: number) {
    const history = sessionStore.roundsHistory.find((r) => r.round === round);
    if (!history) return;

    playersStore.players.forEach((player) => {
      player.roundPoints = history.roundPoints[player.id] ?? null;
      player.previousScore = history.previousScore[player.id] ?? 0;
      player.roundScore = player.previousScore + (player.roundPoints ?? 0);
    });
  }

  function startGame() {
    sessionStore.startGame();
  }

  function resetGame() {
    if (
      confirm('Es-tu sûr de vouloir remettre les compteurs à 0 et garder les mêmes joueurs ?') ===
      true
    ) {
      for (const player of playersStore.players) {
        player.roundScore = 0;
        player.previousScore = 0;
        player.roundPoints = null;
      }
      sessionStore.resetSession();
      router.push({ name: ROUTE_NAMES.GAME });
    }
  }

  return {
    currentRound,
    isUpdatingRound,
    initGame,
    hydrateRound,
    startGame,
    resetGame
  };
});
