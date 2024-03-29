import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_PLAYERS_ARRAY } from '@/constants';
import type { Player, Players, PlayerName } from '@/types';
import { useGameStore } from '@/stores';

export const usePlayersStore = defineStore('players', () => {
  const gameStore = useGameStore();
  const idCount: Ref<number> = ref(0);
  const players: Ref<Players> = ref([]);
  // TO TEST;
  // const players: Ref<Players> = ref([
  //   { id: 1, name: 'Steph', points: 0 },
  //   { id: 2, name: 'Nico', points: 0 }
  // ]);

  watch(
    () => players,
    (newValue) => {
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_ARRAY, JSON.stringify(newValue.value));
    },
    { deep: true }
  );

  function addPlayer(newPlayerName: PlayerName) {
    players.value.push({
      id: idCount.value,
      name: newPlayerName,
      points: 0,
      roundPoints: 0,
      tempInputPoints: null
    });
    idCount.value++;
  }

  function resetPlayers() {
    if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?') == true) {
      players.value = [];
      idCount.value = 0;
      gameStore.gameStarted = false;
      gameStore.enableCounting = false;
      gameStore.roundCounter = gameStore.DEFAULT_ROUND_NUMBER;
    }
  }

  function updatePlayers(updatedPlayers: Player[]) {
    players.value = updatedPlayers;
  }

  return { players, addPlayer, updatePlayers, resetPlayers };
});
