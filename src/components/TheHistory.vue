<script setup lang="ts">
import { usePlayersStore, useGameStore } from '@/stores';

const playersStore = usePlayersStore();
const gameStore = useGameStore();
</script>

<template>
  <img src="/src/assets/back-arrow.svg" class="back-button" @click="$router.back()" />
  <h1 class="title">Historique</h1>
  <DataTable
    class="historique-table"
    :value="gameStore.roundsHistory"
    stripedRows
    showGridlines
    size="small"
  >
    <Column field="tour">
      <template #header>
        <span style="font-weight: bold">Tour</span>
      </template>

      <template #body="{ data }">
        <span style="font-weight: bold">{{ data.round }}</span>
      </template>
    </Column>

    <Column v-for="player in playersStore.players" :key="player.id" :header="String(player.name)">
      <template #body="{ data }">
        {{ data.scores[player.id] ?? 0 }}
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
.back-button {
  position: absolute;
  top: 32px;
  left: 32px;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.title {
  line-height: normal;
}

.historique-table {
  margin-top: 20px;
}
</style>
