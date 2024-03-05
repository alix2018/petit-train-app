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
  <section v-if="gameStore.gameStarted" class="dominos">
    <h1>Domino: {{ gameStore.roundCounter }}</h1>
    <Button
      v-if="!gameStore.enableCounting"
      type="button"
      class="count-round-points"
      label="Compter les points 🎯"
      raised
      @click="countRoundPoints"
    />
  </section>
  <section>
    <DataTable
      v-if="playersRoundData.length > 0"
      :value="playersRoundData"
      size="small"
      showGridlines
      removableSort
      scrollable
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
              <InputNumber
                :id="player.id.toString()"
                :min="0"
                class="input-points"
                v-model="player.tempInputPoints"
                @input="
                  updateRoundPoints({
                    player,
                    roundPoints: $event?.value
                  })
                "
              />
              =
              <span>{{ player.roundPoints }}</span>
            </template>
          </section>
        </template>
      </Column>
    </DataTable>
    <Button
      v-if="gameStore.enableCounting && gameStore.roundCounter > 0"
      type="button"
      class="back-round"
      label="Retour"
      raised
      @click="
        gameStore.enableCounting = false;
        resetRoundPoints();
      "
    />
    <Button
      v-if="gameStore.enableCounting && gameStore.roundCounter > 0"
      type="button"
      class="close-round"
      label="Finir le tour ✔"
      raised
      @click="closeRound"
    />
  </section>
</template>

<style scoped>
.dominos {
  font-size: 30px;
  text-align: center;
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
}

.input-points {
  /* width: 20px;
  display: inline; */
}

.close-round {
  margin-top: 10px;
  float: right;
}
</style>
