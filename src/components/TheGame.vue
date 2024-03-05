<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AddPlayers from './AddPlayers.vue';
import CountPoints from './CountPoints.vue';
import ResetButtons from './ResetButtons.vue';
import { useGameStore, usePlayersStore } from '@/stores';
import {
  LOCAL_STORAGE_PLAYERS_ARRAY,
  LOCAL_STORAGE_GAME_STARTED,
  LOCAL_STORAGE_ROUND_COUNTER
} from '@/constants';

const gameStore = useGameStore();
const playersStore = usePlayersStore();

const storageData = computed(() => {
  const playersArrayStorageValue = localStorage.getItem(LOCAL_STORAGE_PLAYERS_ARRAY);
  const gameStartedStorageValue = localStorage.getItem(LOCAL_STORAGE_GAME_STARTED);
  const roundCounterStorageValue = localStorage.getItem(LOCAL_STORAGE_ROUND_COUNTER);

  return {
    playersArray: playersArrayStorageValue ? JSON.parse(playersArrayStorageValue) : [],
    gameStarted: gameStartedStorageValue ? JSON.parse(gameStartedStorageValue) : false,
    roundCounter: roundCounterStorageValue
      ? JSON.parse(roundCounterStorageValue)
      : gameStore.DEFAULT_ROUND_NUMBER
  };
});

onMounted(() => {
  if (storageData.value.playersArray.length > 0) {
    for (let player of storageData.value.playersArray) {
      player.roundPoints = 0;
    }
    playersStore.players = storageData.value.playersArray;
  }
  gameStore.gameStarted = storageData.value.gameStarted;
  gameStore.roundCounter = storageData.value.roundCounter;
});
</script>

<template>
  <header v-if="!gameStore.gameStarted">
    <AddPlayers />
    <button type="button" @click="gameStore.startGame" class="start-game">
      Commencer la partie
    </button>
  </header>

  <CountPoints />

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
./CountPoints.vue
