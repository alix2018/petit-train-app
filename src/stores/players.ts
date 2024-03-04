import { type Ref, ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { LOCAL_STORAGE_PLAYERS_ARRAY, LOCAL_STORAGE_GAME_STARTED } from '@/constants';
import type { Player, Players, PlayerName } from '@/types';

export const usePlayersStore = defineStore('players', () => {
  // PLAYERS
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
      console.log('watch - new value PLAYERS', players);
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_ARRAY, JSON.stringify(newValue.value));
    },
    { deep: true }
  );

  function addPlayer(newPlayerName: PlayerName) {
    players.value.push({ id: idCount.value, name: newPlayerName, points: 0, roundPoints: 0 });
    idCount.value++;
  }

  function resetPlayers() {
    if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?') == true) {
      players.value = [];
      gameStarted.value = false;
      idCount.value = 0;
    }
  }

  function updatePlayers(updatedPlayers: Player[]) {
    players.value = updatedPlayers;
  }

  // GAME
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
      for (const player of players.value) {
        player.points = 0;
        player.roundPoints = 0;
      }
    }
  }

  return { players, gameStarted, addPlayer, updatePlayers, resetPlayers, startGame, resetGame };
});
