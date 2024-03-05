<script setup lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
</script>

<template>
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
  <!-- <Button label="Historique" severity="secondary" @click="alert('TODO: Historique')" />
  <Button label="Règles" severity="secondary" @click="alert('TODO: règles')" /> -->
</template>

<style scoped>
Button {
  font-size: 12px;
}
</style>
