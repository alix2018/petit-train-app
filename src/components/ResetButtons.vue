<script setup lang="ts">
import { useGameStore, usePlayersStore, useSessionStore } from '@/stores';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
const sessionStore = useSessionStore();
const router = useRouter();
</script>

<template>
  <section v-if="sessionStore.gameStarted" class="buttons-wrapper">
    <Button
      label="Historique"
      severity="secondary"
      @click="router.push({ name: ROUTE_NAMES.HISTORY })"
    />
    <div class="reset-buttons">
      <Button
        type="button"
        label="Recommencer la partie"
        severity="primary"
        @click="gameStore.resetGame"
        raised
      />
      <Button
        type="button"
        label="Changer de joueurs"
        severity="primary"
        @click="playersStore.resetPlayers"
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
