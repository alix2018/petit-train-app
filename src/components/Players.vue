<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';

type Player = string | null;
const player: Ref<Player> = ref(null);
// const players: Ref<Player[]> = ref([])
const playerInput = ref(null);
const emit = defineEmits(['submit']);

onMounted(() => {
  if (playerInput.value) {
    playerInput.value.focus();
  }
});

function savePlayer() {
  if (player.value) {
    // players.value.push(player.value)
    emit('submit', player.value);
    player.value = null;
  }
}
</script>

<template>
  <header>
    <form @submit.prevent="savePlayer">
      <label>Joueurs:</label>
      <input type="text" id="player" ref="playerInput" v-model="player" minlength="1" size="10" />
      <button type="submit">Ajouter</button>
    </form>
  </header>
</template>

<style scoped></style>
