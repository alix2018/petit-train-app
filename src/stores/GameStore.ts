import { type Ref, ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { ROUTE_NAMES } from '@/router';
import {
  LOCAL_STORAGE_PLAYERS_ARRAY,
  LOCAL_STORAGE_GAME_STARTED,
  LOCAL_STORAGE_ROUND_COUNTER,
  LOCAL_STORAGE_ROUNDS_HISTORY
} from '@/constants';
import type { Players } from '@/types';
import { usePlayersStore } from '@/stores';
import { useRoute, useRouter } from 'vue-router';

export const useGameStore = defineStore('game', () => {
  const DEFAULT_ROUND_NUMBER = 12;
  const gameStarted: Ref<boolean> = ref(false);
  const currentRound: Ref<number | null> = ref(null);
  const roundCounter: Ref<number> = ref(DEFAULT_ROUND_NUMBER);
  const enableCounting: Ref<boolean> = ref(false);
  const roundsHistory = ref<
    { round: number; previousScore: Record<string, number>; roundPoints: Record<string, number> }[]
  >([]);

  const playersStore = usePlayersStore();
  const route = useRoute();
  const router = useRouter();

  const storageData = computed(() => {
    const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
    const gameStartedStorageValue = localStorage.getItem(LOCAL_STORAGE_GAME_STARTED);
    const roundCounterStorageValue = localStorage.getItem(LOCAL_STORAGE_ROUND_COUNTER);
    const roundsHistoryStorageValue = localStorage.getItem(LOCAL_STORAGE_ROUNDS_HISTORY);

    return {
      playersArray: playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [],
      gameStarted: gameStartedStorageValue ? JSON.parse(gameStartedStorageValue) : false,
      roundCounter: roundCounterStorageValue
        ? JSON.parse(roundCounterStorageValue)
        : DEFAULT_ROUND_NUMBER,
      roundsHistory: roundsHistoryStorageValue ? JSON.parse(roundsHistoryStorageValue) : []
    };
  });

  let initialized = false;

  function initGame() {
    if (initialized) {
      return;
    }
    initialized = true;

    if (storageData.value.playersArray.length > 0) {
      for (const player of storageData.value.playersArray) {
        player.roundScore = 0;
        player.roundPoints = null;
      }

      playersStore.players = storageData.value.playersArray;
    }

    gameStarted.value = storageData.value.gameStarted;
    roundCounter.value = storageData.value.roundCounter;
    roundsHistory.value = storageData.value.roundsHistory;

    const paramsId = route.params.id ? Number(route.params.id) : null;
    currentRound.value = paramsId ?? roundCounter.value;
  }

  const isUpdatingRound = computed(() => {
    return currentRound.value !== null && currentRound.value !== roundCounter.value;
  });

  watch(isUpdatingRound, (newValue) => {
    if (newValue) {
      const currentRoundHistory = roundsHistory.value.find(
        (history) => history.round === currentRound.value
      );

      playersStore.players.forEach((player) => {
        const previousScore = roundsHistory.value.reduce((total, history) => {
          if (history.round > currentRound.value) {
            return total + (history.roundPoints[player.id] ?? 0);
          }

          return total;
        }, 0);

        const roundPoints = currentRoundHistory?.roundPoints[player.id] ?? 0;

        player.previousScore = previousScore;
        player.roundPoints = roundPoints;
        player.roundScore = previousScore + roundPoints;
      });
    } else if (currentRound.value === roundCounter.value) {
      playersStore.players.forEach((player) => {
        const previousScore = roundsHistory.value.reduce((total, history) => {
          if (history.round > currentRound.value) {
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
      currentRound.value = newValue ? Number(newValue) : roundCounter.value;

      hydrateRound(currentRound.value);
    },
    {
      immediate: true
    }
  );

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
    const previousScore: Record<string, number> = {};
    const roundPoints: Record<string, number> = {};

    players.forEach((player) => {
      previousScore[player.id] = player.previousScore ?? 0;
    });

    players.forEach((player) => {
      roundPoints[player.id] = player.roundPoints ?? 0;
    });

    const existingRound = roundsHistory.value.find((r) => r.round === roundNumber);

    if (existingRound) {
      existingRound.previousScore = previousScore;
      existingRound.roundPoints = roundPoints;
    } else {
      roundsHistory.value.push({
        round: roundNumber,
        previousScore,
        roundPoints
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
        player.roundScore = 0;
        player.previousScore = 0;
        player.roundPoints = null;
        roundCounter.value = DEFAULT_ROUND_NUMBER;
        enableCounting.value = false;
        roundsHistory.value = [];
        router.push({ name: ROUTE_NAMES.GAME });
      }
    }
  }

  function hydrateRound(round: number) {
    const history = roundsHistory.value.find((r) => r.round === round);

    if (!history) {
      return;
    }

    playersStore.players.forEach((player) => {
      player.roundPoints = history.roundPoints[player.id] ?? null;
      player.previousScore = history.previousScore[player.id] ?? 0;
      player.roundScore = player.previousScore + (player.roundPoints ?? 0);
    });
  }

  return {
    gameStarted,
    enableCounting,
    currentRound,
    roundsHistory,
    isUpdatingRound,
    initGame,
    hydrateRound,
    saveRoundHistory,
    startGame,
    resetGame,
    roundCounter,
    DEFAULT_ROUND_NUMBER
  };
});
