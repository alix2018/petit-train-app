<script setup lang="ts">
import { type Ref, ref } from 'vue';
import Players from './Players.vue';
import Points from './Points.vue';

type Player = string | null;
const players: Ref<{ name: Player; points: number }[]> = ref([]);
const gameStarted: Ref<boolean> = ref(false);
function updatePlayers(newPlayer: Player) {
  players.value.push({ name: newPlayer, points: 0 });
}

// Players: : { name: string, points: number }[]
// [ { name: 'Steph', points: 0 }, { name: 'Nico', points: 0 } ];

function startGame() {
  gameStarted.value = true;
}
</script>

<template>
  <template v-if="!gameStarted">
    <Players @submit="updatePlayers" />
    <button type="button" @click="startGame">Commencer la partie</button>
  </template>

  <Points :players="players" />
  <footer>
    <button type="button" onclick="alert('TODO: reset points!')">Reset points</button>
    <button type="button" onclick="alert('TODO: reset players')">Reset players</button>
    <button type="button" onclick="alert('TODO: règles')">Règles</button>
  </footer>
</template>

<style scoped></style>
