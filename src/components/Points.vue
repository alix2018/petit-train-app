<script setup lang="ts">
import { type Ref, ref, computed } from 'vue';
import type { Player } from '@/types';

type Props = {
  players: Player[];
  gameStarted: boolean;
};
const props = defineProps<Props>();
const emit = defineEmits(['updatePlayers']);
// const playersRound: Ref<Player[]> = ref(props.players);
const playersRound = computed(() => {
  const players = props.players;
  for (let i = 0; i < players.length; i++) {
    players[i].roundPoints = 0;
  }
  return players;
});
const enableCounting: Ref<boolean> = ref(false);
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
  for (let i = 0; i < playersRound.value.length; i++) {
    playersRound.value[i].points = playersRound.value[i].roundPoints ?? 0;
    playersRound.value[i].roundPoints = 0;
  }
}

function closeRound() {
  console.log('Round finished!');
  if (confirm("Es-tu sûr d'avoir fini le tour x ?") == true) {
    updatePlayersPoints();
    emit('updatePlayers', playersRound.value as Player[]);
    enableCounting.value = false;
  }
}
</script>

<template>
  <section v-if="gameStarted" class="dominos">
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
      <template v-if="playersRound.length > 0">
        <tr v-for="player in playersRound" :key="player.id">
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
              <span>{{ player.roundPoints ?? 0 }}</span>
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
