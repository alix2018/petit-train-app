<script setup lang="ts">
import AddPlayers from './AddPlayers.vue';
import CountPoints from './CountPoints.vue';
import ResetButtons from './ResetButtons.vue';
import { usePlayersStore, useSessionStore } from '@/stores';

const playersStore = usePlayersStore();
const sessionStore = useSessionStore();
</script>

<template>
  <div class="game-wrapper">
    <header v-if="!sessionStore.gameStarted">
      <h1>Train Mexicain</h1>
      <AddPlayers />
    </header>

    <CountPoints />

    <Button
      v-if="playersStore.players.length >= 2 && !sessionStore.gameStarted"
      type="button"
      label="Commencer la partie 🚂"
      class="start-game"
      severity="secondary"
      raised
      @click="sessionStore.startGame"
    />

    <footer class="footer">
      <ResetButtons />
    </footer>
  </div>
</template>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  align-items: center;
}

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
  display: flex;
  gap: 5px;
  margin-top: auto;
}
</style>
