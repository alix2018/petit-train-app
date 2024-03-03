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
const playersStorage = computed(() => {
  const storageValue = localStorage.getItem('playersArray');
  return storageValue ? JSON.parse(storageValue) : [];
});
const gameStartedStorage = computed(() => {
  const storageValue = localStorage.getItem('gameStarted');
  return storageValue ? JSON.parse(storageValue) : false;
});

onMounted(() => {
  if (playersStorage.value.length > 0) {
    players.value = playersStorage.value;
  }
  gameStarted.value = gameStartedStorage.value;
});

watch(gameStarted, (newValue, oldValue) => {
  localStorage.setItem('gameStarted', newValue.toString());
});

watch(
  () => players,
  (newValue, oldValue) => {
    localStorage.setItem('playersArray', JSON.stringify(newValue.value));
  },
  { deep: true }
);

function addPlayer(newPlayerName: PlayerName) {
  players.value.push({ id: idCount.value, name: newPlayerName, points: 0 });
  idCount.value++;
}

function updatePlayersPoints(updatedPlayers: Player[]) {
  players.value = updatedPlayers;
}

function startGame() {
  gameStarted.value = true;
}
</script>

<template>
  <template v-if="!gameStarted">
    <ManagePlayers @submit="addPlayer" />
    <button type="button" @click="startGame" class="start-game">Commencer la partie</button>
  </template>

  <Points
    @updatePlayersPoints="updatePlayersPoints"
    :players="players"
    :gameStarted="gameStarted"
  />
  <footer class="footer">
    <button type="button" onclick="alert('TODO: reset points!')">Reset points</button>
    <button type="button" onclick="alert('TODO: reset players')">Reset players</button>
    <button type="button" onclick="alert('TODO: Historique')">Historique</button>
    <button type="button" onclick="alert('TODO: règles')">Règles</button>
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
