<script setup lang="ts">
// type Player = string | null

type Props = {
  players: Player;
};
defineProps<Props>();
</script>

<template>
  <section>
    <p>Points:</p>
    <table style="width: 100%">
      <tr>
        <th>Noms</th>
        <th>Points</th>
      </tr>
      <template v-if="players.length > 0">
        <tr v-for="player in players">
          <td>{{ player.name }}</td>
          <td>{{ player.points }}</td>
        </tr>
      </template>
    </table>
  </section>
</template>

<style scoped>
table,
th,
td {
  border: 1px solid black;
}
</style>
