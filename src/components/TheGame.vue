<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import AddPlayers from './AddPlayers.vue';
import CountPoints from './CountPoints.vue';
import ResetButtons from './ResetButtons.vue';
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
</script>

<template>
  <header v-if="!gameStore.gameStarted">
    <h1>Train Mexicain</h1>
    <AddPlayers />
  </header>

  <CountPoints />

  <Button
    v-if="playersStore.players.length >= 2 && !gameStore.gameStarted"
    type="button"
    label="Commencer la partie 🚂"
    class="start-game"
    severity="secondary"
    raised
    @click="gameStore.startGame"
  />

  <footer class="footer">
    <ResetButtons />
  </footer>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.start-game {
  margin: 20px 0;
  width: 100%;
}

.footer {
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 5px;
}
</style>
