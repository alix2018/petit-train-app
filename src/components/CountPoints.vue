<script setup lang="ts">
import { computed } from 'vue';
import type { Player } from '@/types';
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
const playersRoundData = computed(() => playersStore.players);

function countRoundPoints() {
  gameStore.enableCounting = true;
  for (let player of playersRoundData.value) {
    player.roundPoints = player.points;
  }
}

function updateRoundPoints({
  player,
  roundPoints
}: {
  player: Player;
  roundPoints: number | null;
}) {
  player.roundPoints = Number(player.points + (roundPoints || 0));
}

function updatePlayersPoints() {
  for (let player of playersRoundData.value) {
    player.points = player.roundPoints ? player.roundPoints : player.points;
    player.roundPoints = 0;
    player.tempInputPoints = null;
  }
}

function resetRoundPoints() {
  for (let player of playersRoundData.value) {
    player.roundPoints = 0;
    player.tempInputPoints = null;
  }
}

function closeRound() {
  if (confirm(`Es-tu sûr d'avoir fini le tour ${gameStore.roundCounter} ?`) === true) {
    updatePlayersPoints();
    playersStore.updatePlayers(playersRoundData.value);
    gameStore.enableCounting = false;
    gameStore.roundCounter--;
  }
}
</script>

<template>
  <h1 v-if="gameStore.gameStarted">Tour: Double {{ gameStore.roundCounter }}</h1>

  <section class="table-section">
    <DataTable
      v-if="playersRoundData.length > 0"
      :value="playersRoundData"
      size="small"
      showGridlines
      removableSort
      scrollable
      class="data-table"
    >
      <!-- TODO: Highlight user with best score - https://primevue.org/datatable/#conditional_style -->
      <Column field="name" header="Noms" :sortable="!gameStore.enableCounting" />
      <Column
        field="points"
        header="Points"
        key="roundPoints"
        :sortable="!gameStore.enableCounting"
      >
        <template #body="{ data: player }">
          <section class="row-points">
            <span>{{ player.points }}</span>
            <template v-if="gameStore.enableCounting">
              +
              <input
                type="number"
                :id="player.id.toString()"
                class="input-points"
                @input="updateRoundPoints({ player, roundPoints: $event?.target?.valueAsNumber })"
              />
              =
              <span>{{ player.roundPoints }}</span>
            </template>
          </section>
        </template>
      </Column>
    </DataTable>
    <Button
      v-if="gameStore.gameStarted && !gameStore.enableCounting"
      type="button"
      class="count-round-points"
      label="Compter les points 🎯"
      severity="secondary"
      raised
      @click="countRoundPoints"
    />
    <section v-if="gameStore.enableCounting && gameStore.roundCounter > 0" class="close-round">
      <Button
        type="button"
        class="back-round"
        label="Retour"
        severity="secondary"
        raised
        @click="
          gameStore.enableCounting = false;
          resetRoundPoints();
        "
      />
      <Button
        type="button"
        label="Finir le tour ✔"
        severity="success"
        raised
        @click="closeRound"
      />
    </section>
  </section>
</template>

<style scoped>
.table-section {
  display: flex;
  flex-direction: column;
  padding-top: 40px;
  width: 100%;
}

.data-table.p-datatable-table {
  border-radius: 8px;
}

table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
}

.row-points {
  display: flex;
  align-items: center;
}

.input-points {
  width: 60px;
  font-size: 1rem;
  color: #334155;
  background: #ffffff;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  appearance: none;
}

.count-round-points {
  margin-top: 20px;
}

.close-round {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
