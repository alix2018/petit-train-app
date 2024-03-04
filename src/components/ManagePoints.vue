<script setup lang="ts">
import { type Ref, ref, computed } from 'vue';
import type { Player } from '@/types';
import { useGameStore, usePlayersStore } from '@/stores';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
const playersRoundData = computed(() => playersStore.players);
const enableCounting: Ref<boolean> = ref(false);
// TO TEST
// const enableCounting: Ref<boolean> = ref(true);

function countRoundPoints() {
  enableCounting.value = true;
}

function updateRoundPoints({
  player,
  roundPoints
}: {
  player: Player;
  roundPoints: number | null;
}) {
  player.roundPoints = player.points + (roundPoints ?? 0);
}

function updatePlayersPoints() {
  for (let player of playersRoundData.value) {
    player.points = player.roundPoints ? player.roundPoints : player.points;
    player.roundPoints = 0;
  }
}

function closeRound() {
  if (confirm("Es-tu sûr d'avoir fini le tour x ?") === true) {
    updatePlayersPoints();
    playersStore.updatePlayers(playersRoundData.value);
    enableCounting.value = false;
  }
}
</script>

<template>
  <section v-if="gameStore.gameStarted" class="dominos">
    <h1>Domino: 12</h1>
    <button
      v-if="!enableCounting"
      type="button"
      @click="countRoundPoints"
      class="count-round-points"
    >
      Compter les points
    </button>
  </section>
  <section>
    <table>
      <tr>
        <th>Noms</th>
        <th>Points</th>
      </tr>
      <template v-if="playersRoundData.length > 0">
        <tr v-for="player in playersRoundData" :key="player.id">
          <td>{{ player.name }}</td>
          <td class="row-points">
            <span>{{ player.points }}</span>
            <div v-if="enableCounting">
              +
              <input
                type="number"
                :id="player.id.toString()"
                class="input-points"
                width="5"
                @input="updateRoundPoints({ player, roundPoints: $event?.target?.valueAsNumber })"
              />
              =
              <span>{{ player.roundPoints }}</span>
            </div>
          </td>
        </tr>
      </template>
    </table>
    <button v-if="enableCounting" class="close-round" type="button" @click="closeRound">
      Finir le tour
    </button>
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
  width: 50px;
}

.close-round {
  margin-top: 10px;
  float: right;
}
</style>
