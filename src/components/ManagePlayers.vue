<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';
import type { PlayerName } from '@/types';

const playerName: Ref<PlayerName> = ref(null);
const playerInput: Ref<HTMLInputElement | null> = ref(null);
const emit = defineEmits(['submit']);

onMounted(() => {
  if (playerInput.value) {
    playerInput.value.focus();
  }
});

function savePlayer() {
  if (playerName.value) {
    emit('submit', playerName.value);
    playerName.value = null;
  }
}
</script>

<template>
  <header>
    <form @submit.prevent="savePlayer">
      <label>Joueurs:</label>
      <input
        type="text"
        id="player"
        ref="playerInput"
        v-model="playerName"
        minlength="1"
        size="10"
      />
      <button type="submit">Ajouter</button>
    </form>
  </header>
</template>

<style scoped></style>
