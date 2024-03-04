<script setup lang="ts">
import { type Ref, ref, watch, computed, onMounted } from 'vue';
import ManagePlayers from './ManagePlayers.vue';
import Points from './Points.vue';
import type { Player, Players, PlayerName } from '@/types';

type Props = {
  players: Player[];
  gameStarted: boolean;
};
const props = defineProps<Props>();
const emit = defineEmits(['updatePlayers', 'updateGameStarted']);
const playersData = computed(() => props.players);

function resetGame() {
  if (
    confirm('Es-tu sûr de vouloir remettre les compteurs à 0 et garder les mêmes joueurs ?') ===
    true
  ) {
    for (let player of players.value) {
      player.points = 0;
      player.roundPoints = 0;
    }
  }
}

function resetPlayers() {
  if (confirm('Es-tu sûr de vouloir annuler la partie et changer de joueurs ?') == true) {
    players.value = [];
    gameStarted.value = false;
    idCount.value = 0;
  }
}
</script>

<template>
  <button type="button" @click="resetGame">Recommencer la partie</button>
  <button type="button" @click="resetPlayers">Changer de joueurs</button>
  <button type="button" @click="alert('TODO: Historique')">Historique</button>
  <button type="button" @click="alert('TODO: règles')">Règles</button>
</template>

<style scoped></style>
