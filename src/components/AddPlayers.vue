<script setup lang="ts">
import { type Ref, ref } from 'vue';
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
  <form @submit.prevent="savePlayer">
    <InputText
      type="text"
      id="player"
      ref="playerNameInput"
      placeholder="Nom du joueur"
      v-model="playerName"
      minlength="1"
      autofocus
      autocomplete="off"
    />
    <Button type="submit" label="Ajouter" severity="contrast" raised />
  </form>
</template>

<style scoped>
section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 70%;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

form > * {
  width: 100%;
}

label {
  text-align: center;
}
</style>
