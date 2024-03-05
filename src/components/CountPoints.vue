<script setup lang="ts">
import { type Ref, ref, computed, onMounted } from 'vue';
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
    <button
      v-if="!gameStore.enableCounting"
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
            <div v-if="gameStore.enableCounting">
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
    <button
      v-if="gameStore.enableCounting && gameStore.roundCounter > 0"
      class="close-round"
      type="button"
      @click="closeRound"
    >
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
