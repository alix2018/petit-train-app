<script setup lang="ts">
import { onMounted } from 'vue';
import { useGameStore } from '@/stores';

const gameStore = useGameStore();

onMounted(() => {
  gameStore.initGame();
});
</script>

<template>
  <router-view />
</template>

<style scoped></style>
