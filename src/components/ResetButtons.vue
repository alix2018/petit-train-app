<script setup lang="ts">
import { usePlayersStore } from '@/stores/players';

const store = usePlayersStore();
</script>

<template>
  <button type="button" @click="store.resetGame">Recommencer la partie</button>
  <button type="button" @click="store.resetPlayers">Changer de joueurs</button>
  <button type="button" @click="alert('TODO: Historique')">Historique</button>
  <button type="button" @click="alert('TODO: règles')">Règles</button>
</template>

<style scoped></style>
