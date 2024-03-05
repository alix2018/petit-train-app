<script setup lang="ts">
import { type Ref, ref, onMounted } from 'vue';
import type { PlayerName } from '@/types';
import { usePlayersStore } from '@/stores';

const playersStore = usePlayersStore();
const playerName: Ref<PlayerName> = ref(null);
const playerNameInput: Ref<HTMLInputElement | null> = ref(null);

function savePlayer() {
  if (playerName.value) {
    playersStore.addPlayer(playerName.value);
    playerName.value = null;
  }
}
</script>

<template>
  <header>
    <form @submit.prevent="savePlayer">
      <label>Joueurs:</label>
      <InputText
        type="text"
        id="player"
        ref="playerNameInput"
        v-model="playerName"
        minlength="1"
        autofocus
      />
      <Button type="submit" label="Ajouter" raised />
    </form>
  </header>
</template>

<style scoped></style>
