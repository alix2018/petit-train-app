<script setup lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';
import { useRouter } from 'vue-router';

const gameStore = useGameStore();
const playersStore = usePlayersStore();

const router = useRouter();
</script>

<template>
  <section v-if="gameStore.gameStarted" class="buttons-wrapper">
    <Button label="Historique" severity="secondary" @click="router.push({ name: 'history' })" />
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
