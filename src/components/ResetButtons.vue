<script setup lang="ts">
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
</script>

<template>
  <button type="button" @click="gameStore.resetGame">Recommencer la partie</button>
  <button type="button" @click="playersStore.resetPlayers">Changer de joueurs</button>
  <button type="button" @click="alert('TODO: Historique')">Historique</button>
  <button type="button" @click="alert('TODO: règles')">Règles</button>
</template>

<style scoped></style>
