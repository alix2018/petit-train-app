<script setup lang="ts">
import { useGameStore, usePlayersStore, useSessionStore } from '@/stores';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
const sessionStore = useSessionStore();
const router = useRouter();

function handleResetGame() {
  if (confirm('Es-tu sûr de vouloir remettre les compteurs à 0 et garder les mêmes joueurs ?')) {
    gameStore.resetGame();
  }
}

function handleResetPlayers() {
  if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?')) {
    playersStore.resetPlayers();
  }
}
</script>

<template>
  <section v-if="sessionStore.gameStarted" class="buttons-wrapper">
    <Button
      v-if="!gameStore.isEditMode"
      label="Historique"
      severity="secondary"
      @click="router.push({ name: ROUTE_NAMES.HISTORY })"
    />
    <div class="reset-buttons">
      <Button
        type="button"
        label="Recommencer la partie"
        severity="primary"
        @click="handleResetGame"
        raised
      />
      <Button
        type="button"
        label="Changer de joueurs"
        severity="primary"
        @click="handleResetPlayers"
        raised
      />
    </div>
  </section>
</template>

<style scoped>
Button {
  font-size: 12px;
}

.buttons-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reset-buttons {
  display: flex;
  gap: 12px;
}
</style>
