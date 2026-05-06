import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { ROUTE_NAMES } from '@/router';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_PLAYERS_ARRAY } from '@/constants';
import type { Player, Players, PlayerName } from '@/types';
import { useGameStore } from '@/stores';

export const usePlayersStore = defineStore('players', () => {
  const players: Ref<Players> = ref([]);

  const gameStore = useGameStore();
  const router = useRouter();

  watch(
    () => players,
    (newValue) => {
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_ARRAY, JSON.stringify(newValue.value));
    },
    { deep: true }
  );

  function addPlayer(newPlayerName: PlayerName) {
    players.value.push({
      id: crypto.randomUUID(),
      name: newPlayerName,
      previousScore: 0,
      roundScore: 0,
      roundPoints: null
    });
  }

  function resetPlayers() {
    if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?') == true) {
      players.value = [];
      gameStore.gameStarted = false;
      gameStore.enableCounting = false;
      gameStore.roundCounter = gameStore.DEFAULT_ROUND_NUMBER;
      gameStore.roundsHistory = [];
      router.push({ name: ROUTE_NAMES.GAME });
    }
  }

  function updatePlayers(updatedPlayers: Player[]) {
    players.value = updatedPlayers;
  }

  return { players, addPlayer, updatePlayers, resetPlayers };
});
