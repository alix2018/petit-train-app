<script setup lang="ts">
import { type Ref, ref } from 'vue'
import Players from './Players.vue'
import Points from './Points.vue'

type Player = string | null
const players: Ref<Player[]> = ref([])

function updatePlayers(newPlayer: Player) {
  console.log('updatePlayers- new list:', newPlayer)
  players.value.push(newPlayer)
}
</script>

<template>
  <Players @submit="updatePlayers" />
  {{ players }}

  <Points />
  <footer>
    <button type="button" onclick="alert('Hello world!')">Reset</button>
    <button type="button" onclick="alert('Hello world!')">Règles</button>
  </footer>
</template>

<style scoped></style>
