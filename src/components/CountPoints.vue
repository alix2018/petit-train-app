<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import Sortable from 'sortablejs';
import type { Player } from '@/types';
import { useGameStore, usePlayersStore, useSessionStore } from '@/stores';
import { useRouter } from 'vue-router';

const gameStore = useGameStore();
const playersStore = usePlayersStore();
const sessionStore = useSessionStore();
const router = useRouter();

const playersRoundData = computed(() => playersStore.players);
const isResultsPage = computed(() => sessionStore.roundCounter === -1);

function countRoundScore() {
  sessionStore.enableCounting = true;
}

function handleRoundPointsInput(event: Event, player: Player) {
  const inputPoints = (event.target as HTMLInputElement).valueAsNumber;
  player.roundPoints = Number.isNaN(inputPoints) ? null : inputPoints;
}

function updatePlayersPoints() {
  for (let player of playersRoundData.value) {
    player.previousScore = playersStore.getRoundScore(player);
    player.roundPoints = null;
  }
}

function resetRoundPoints() {
  for (let player of playersRoundData.value) {
    player.roundPoints = null;
  }
}

function closeRound() {
  if (gameStore.currentRound === null) {
    return;
  }

  const message = gameStore.isEditMode
    ? `Es-tu sûr de vouloir appliquer les changements pour le tour ${gameStore.currentRound} ?`
    : `Es-tu sûr d'avoir fini le tour ${gameStore.currentRound} ?`;

  if (confirm(message) === true) {
    sessionStore.saveRoundHistory({
      roundNumber: gameStore.currentRound!,
      players: playersStore.players
    });
    updatePlayersPoints();
    playersStore.updatePlayers(playersRoundData.value);
    sessionStore.enableCounting = false;

    if (!gameStore.isEditMode) {
      sessionStore.roundCounter--;
    }

    gameStore.currentRound = sessionStore.roundCounter;
    router.push(`/${gameStore.currentRound}`);
  }
}

const startingPlayer = computed(() => {
  if (
    !sessionStore.gameStarted ||
    isResultsPage.value ||
    gameStore.currentRound === null ||
    playersStore.players.length === 0
  )
    return null;
  const roundIndex = sessionStore.DEFAULT_ROUND_NUMBER - gameStore.currentRound;
  const idx = roundIndex % playersStore.players.length;
  return playersStore.players[idx];
});

const rowClass = (player: Player) => {
  return [{ 'row-highlighted': isWinner(player) }];
};

function isWinner(player: Player) {
  return (
    sessionStore.roundCounter < sessionStore.DEFAULT_ROUND_NUMBER &&
    sessionStore.gameStarted &&
    winners.value.some((winner) => winner.name === player.name)
  );
}

const winners = computed(() => {
  if (playersStore.players.length === 0) {
    return [];
  }

  const minPoints = playersStore.players.reduce((min, player) => {
    return player.previousScore < min ? player.previousScore : min;
  }, playersStore.players[0].previousScore);

  return playersStore.players.filter((player) => player.previousScore === minPoints);
});

function deletePlayer(player: Player) {
  playersStore.players = playersStore.players.filter((element) => element.id !== player.id);
}

function onRowReorder(event: { value: Player[] }) {
  playersStore.players = event.value;
}

function showCurrentPlayer(player: Player) {
  return player.id === startingPlayer.value?.id && !gameStore.isEditMode;
}

// Touch devices only — desktop keeps PrimeVue's reorderableRows (HTML5 DnD)
const isTouchDevice = 'ontouchstart' in window;
const tableWrapper = ref<HTMLElement | null>(null);
let sortableInstance: Sortable | null = null;

function initSortable() {
  sortableInstance?.destroy();
  sortableInstance = null;
  const tbody = tableWrapper.value?.querySelector('tbody');
  if (!tbody) {
    return;
  }
  sortableInstance = Sortable.create(tbody as HTMLElement, {
    animation: 150,
    handle: '.drag-handle-cell',
    onEnd(event) {
      const { oldIndex, newIndex } = event;
      if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
        return;
      }
      const reordered = [...playersStore.players];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      playersStore.players = reordered;
      nextTick(initSortable);
    }
  });
}

if (isTouchDevice) {
  onMounted(() => {
    if (!sessionStore.gameStarted) {
      nextTick(initSortable);
    }
  });

  watch([() => sessionStore.gameStarted, () => playersRoundData.value.length], ([started]) => {
    if (!started) {
      nextTick(initSortable);
    } else {
      sortableInstance?.destroy();
      sortableInstance = null;
    }
  });

  onUnmounted(() => {
    sortableInstance?.destroy();
  });
}
</script>

<template>
  <template v-if="sessionStore.gameStarted">
    <img v-if="!isResultsPage" :src="`/double${gameStore.currentRound}.png`" height="70px" />
    <h1 v-else>🎉 Résultats 🎉</h1>
  </template>

  <section class="table-section">
    <div ref="tableWrapper">
      <DataTable
        v-if="playersRoundData.length > 0"
        :value="playersRoundData"
        :rowClass="rowClass"
        dataKey="id"
        size="small"
        showGridlines
        removableSort
        scrollable
        class="data-table"
        :reorderableRows="!sessionStore.gameStarted"
        @rowReorder="onRowReorder"
      >
        <Column
          v-if="!sessionStore.gameStarted"
          rowReorder
          headerStyle="width: 4rem"
          bodyStyle="text-align: center;"
          bodyClass="drag-handle-cell"
        />
        <Column v-if="!sessionStore.gameStarted" style="width: 2.5rem; text-align: center">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>
        <Column field="name" header="Noms" :sortable="!sessionStore.enableCounting">
          <template #body="{ data: player }">
            <span v-if="showCurrentPlayer(player)">🚩</span>
            <span v-if="isWinner(player)">🏆</span>
            {{ player.name }}
          </template>
        </Column>
        <Column
          field="previousScore"
          header="Points"
          key="roundScore"
          :sortable="!sessionStore.enableCounting"
        >
          <template #body="{ data: player }">
            <section class="row-points">
              <span>{{ player.previousScore }}</span>

              <template v-if="sessionStore.enableCounting || gameStore.isEditMode">
                +
                <input
                  type="number"
                  :id="player.id.toString()"
                  :value="player.roundPoints ?? ''"
                  class="input-points"
                  @input="handleRoundPointsInput($event, player)"
                />
                =
                <span>{{ playersStore.getRoundScore(player) }}</span>
              </template>
            </section>
          </template>
        </Column>
        <Column v-if="!sessionStore.gameStarted" style="width: 10%">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="deletePlayer(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Button
      v-if="
        sessionStore.gameStarted &&
        !sessionStore.enableCounting &&
        !isResultsPage &&
        !gameStore.isEditMode
      "
      type="button"
      class="count-round-score"
      label="Compter les points 🎯"
      severity="secondary"
      raised
      @click="countRoundScore"
    />
    <section
      v-if="(sessionStore.enableCounting && sessionStore.roundCounter >= 0) || gameStore.isEditMode"
      class="close-round"
    >
      <Button
        v-if="gameStore.isEditMode"
        type="button"
        class="back-round"
        :label="`← Retour au tour ${sessionStore.roundCounter}`"
        severity="secondary"
        raised
        @click="$router.push(`${sessionStore.roundCounter}`)"
      />
      <Button
        v-if="!gameStore.isEditMode"
        type="button"
        class="back-round"
        label="Annuler"
        severity="secondary"
        raised
        @click="
          sessionStore.enableCounting = false;
          resetRoundPoints();
        "
      />
      <Button
        v-if="sessionStore.roundCounter === 0 && !gameStore.isEditMode"
        type="button"
        label="Finir la partie 🏁"
        severity="contrast"
        raised
        @click="closeRound"
      />
      <Button
        v-else
        type="button"
        :label="gameStore.isEditMode ? 'Modifier 💥' : 'Finir le tour ✔'"
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

.count-round-score {
  margin-top: 20px;
}

:deep(.row-highlighted) {
  background-color: #ffdc73;
}

.close-round {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 20px;
}
</style>
