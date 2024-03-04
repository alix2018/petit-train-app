<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';
import type { PlayerName } from '@/types';
import { usePlayersStore } from '@/stores/players';

const store = usePlayersStore();
const playerName: Ref<PlayerName> = ref(null);
const playerNameInput: Ref<HTMLInputElement | null> = ref(null);

onMounted(() => {
  if (playerNameInput.value) {
    playerNameInput.value.focus();
  }
});

function savePlayer() {
  if (playerName.value) {
    store.addPlayer(playerName.value);
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
        ref="playerNameInput"
        v-model="playerName"
        minlength="1"
        size="10"
      />
      <button type="submit">Ajouter</button>
    </form>
  </header>
</template>

<style scoped></style>
