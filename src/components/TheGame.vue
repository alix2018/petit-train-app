<script setup lang="ts">
import { type Ref, ref, watch, computed, onMounted } from 'vue';
import ManagePlayers from './ManagePlayers.vue';
import Points from './Points.vue';
import type { Player, Players, PlayerName } from '@/types';

const players: Ref<Players> = ref([]);
// TO TEST
// const players: Ref<Players> = ref([
//   { id: 1, name: 'Steph', points: 0 },
//   { id: 2, name: 'Nico', points: 0 }
// ]);
// const gameStarted: Ref<boolean> = ref(true);
const gameStarted: Ref<boolean> = ref(false);
const idCount: Ref<number> = ref(0);
const LOCAL_STORAGE_PLAYERS_ARRAY = 'playersArray';
const LOCAL_STORAGE_GAME_STARTED = 'gameStarted';

const storageData = computed(() => {
  const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
  const gameStartedStorageValue = localStorage.getItem(LOCAL_STORAGE_GAME_STARTED);

  return {
    playersArray: playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [],
    gameStarted: gameStartedStorageValue ? JSON.parse(gameStartedStorageValue) : false
  };
});

watch(gameStarted, (newValue) => {
  localStorage.setItem(LOCAL_STORAGE_GAME_STARTED, newValue.toString());
});

watch(
  () => players,
  (newValue) => {
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_ARRAY, JSON.stringify(newValue.value));
  },
  { deep: true }
);

function addPlayer(newPlayerName: PlayerName) {
  players.value.push({ id: idCount.value, name: newPlayerName, points: 0, roundPoints: 0 });
  idCount.value++;
}

function updatePlayers(updatedPlayers: Player[]) {
  players.value = updatedPlayers;
}

function startGame() {
  gameStarted.value = true;
}

function resetGame() {
  if (
    confirm('Es-tu sûr de vouloir remettre les compteurs à 0 et garder les mêmes joueurs ?') ===
    true
  ) {
    for (let player of players.value) {
      player.points = 0;
      player.roundPoints = 0;
    }
  }
}

function resetPlayers() {
  if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?') == true) {
    players.value = [];
    gameStarted.value = false;
    idCount.value = 0;
  }
}

onMounted(() => {
  if (storageData.value.playersArray.length > 0) {
    players.value = storageData.value.playersArray;
  }
  gameStarted.value = storageData.value.gameStarted;
});
</script>

<template>
  <template v-if="!gameStarted">
    <ManagePlayers @submit="addPlayer" />
    <button type="button" @click="startGame" class="start-game">Commencer la partie</button>
  </template>

  <Points @updatePlayersPoints="updatePlayers" :players="players" :gameStarted="gameStarted" />
  <footer class="footer">
    <!-- <ResetButtons :players="players" @updatePlayersPoints="updatePlayers" @updateGameStarted></ResetButton> -->
    <button type="button" @click="resetGame">Recommencer la partie</button>
    <button type="button" @click="resetPlayers">Changer de joueurs</button>
    <button type="button" @click="alert('TODO: Historique')">Historique</button>
    <button type="button" @click="alert('TODO: règles')">Règles</button>
  </footer>
</template>

<style scoped>
.start-game {
  margin: 20px 0;
}

.footer {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 5px;
}
</style>
