<script setup lang="ts">
import { computed } from 'vue';
import { usePlayersStore, useGameStore, useSessionStore } from '@/stores';
import { useRouter } from 'vue-router';

const playersStore = usePlayersStore();
const gameStore = useGameStore();
const sessionStore = useSessionStore();
const router = useRouter();

const isResultsPage = computed(() => sessionStore.roundCounter === -1);

function onEditHistory(selectedRound: number) {
  gameStore.hydrateRound(selectedRound);
  router.push(`/${selectedRound}`);
}

const roundsTotalScore = computed(() => {
  const result: Record<string, number> = {};

  playersStore.players.forEach((player) => {
    result[player.id] = 0;
  });

  sessionStore.roundsHistory.forEach((round) => {
    for (const playerId in round.roundPoints) {
      result[playerId] += round.roundPoints[playerId];
    }
  });

  return result;
});
</script>

<template>
  <img src="/src/assets/back-arrow.svg" class="back-button" @click="$router.back()" />
  <h1 class="title">Historique</h1>
  <DataTable
    v-if="sessionStore.roundsHistory.length > 0"
    :value="sessionStore.roundsHistory"
    stripedRows
    showGridlines
    scrollable
    size="small"
    class="historique-table"
  >
    <Column field="tour" frozen>
      <template #header>
        <span style="font-weight: bold; width: 48px">Tour</span>
      </template>

      <template #body="{ data }">
        <div class="round-column">
          <p>{{ data.round }}</p>
          <img
            v-if="!isResultsPage"
            src="/src/assets/edit.svg"
            height="16px"
            @click="onEditHistory(data.round)"
          />
        </div>
      </template>

      <template #footer>
        <span style="font-weight: bold">Total</span>
      </template>
    </Column>

    <Column v-for="player in playersStore.players" :key="player.id" :header="String(player.name)">
      <template #body="{ data }">
        <span class="players-score">{{ data.roundPoints[player.id] ?? 0 }}</span>
      </template>

      <template #footer>
        <span class="footer">{{ roundsTotalScore[player.id] }}</span>
      </template>
    </Column>
  </DataTable>
  <p v-else>Il n'y a pas encore d'historique</p>
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
  margin-bottom: 16px;
}

.historique-table {
  margin-top: 20px;
  overflow-x: auto;
  width: 100%;
}

.round-column {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.round-column > p,
.footer {
  font-weight: bold;
}

.round-column > img {
  cursor: pointer;
}

.players-score,
.footer {
  display: block;
  text-align: right;
}

:deep(.p-datatable-wrapper > table > tfoot > tr > td) {
  background-color: #ffdc73;
}
</style>
