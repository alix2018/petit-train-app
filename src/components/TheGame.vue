<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ManagePlayers from './ManagePlayers.vue';
import ManagePoints from './ManagePoints.vue';
import ResetButtons from './ResetButtons.vue';
import { useGameStore, usePlayersStore } from '@/stores';
import { LOCAL_STORAGE_PLAYERS_ARRAY, LOCAL_STORAGE_GAME_STARTED } from '@/constants';

const gameStore = useGameStore();
const playersStore = usePlayersStore();

const storageData = computed(() => {
  const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
  const gameStartedStorageValue = localStorage.getItem(LOCAL_STORAGE_GAME_STARTED);

  return {
    playersArray: playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [],
    gameStarted: gameStartedStorageValue ? JSON.parse(gameStartedStorageValue) : false
  };
});

onMounted(() => {
  if (storageData.value.playersArray.length > 0) {
    playersStore.players = storageData.value.playersArray;
  }
  gameStore.gameStarted = storageData.value.gameStarted;
});
</script>

<template>
  <header v-if="!gameStore.gameStarted">
    <ManagePlayers />
    <button type="button" @click="gameStore.startGame" class="start-game">
      Commencer la partie
    </button>
  </header>

  <ManagePoints />

  <footer class="footer">
    <ResetButtons />
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
