<script setup lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
</script>

<template>
  <section class="buttons-wrapper">
    <Button label="Historique" severity="secondary" />
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
