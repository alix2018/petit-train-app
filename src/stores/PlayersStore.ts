import { type Ref, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { ROUTE_NAMES } from '@/router';
import { useRouter } from 'vue-router';
import { LOCAL_STORAGE_PLAYERS_ARRAY } from '@/constants';
import type { Player, Players, PlayerName } from '@/types';
import { useSessionStore } from '@/stores';

export const usePlayersStore = defineStore('players', () => {
  const players: Ref<Players> = ref([]);

  const sessionStore = useSessionStore();
  const router = useRouter();

  watch(
    () => players,
    (newValue) => {
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_ARRAY, JSON.stringify(newValue.value));
    },
    { deep: true }
  );

  function addPlayer(newPlayerName: PlayerName) {
    players.value.push({
      id: crypto.randomUUID(),
      name: newPlayerName ?? '',
      previousScore: 0,
      roundPoints: null
    });
  }

  function getRoundScore(player: Player): number {
    return player.previousScore + (player.roundPoints ?? 0);
  }

  function updatePlayers(updatedPlayers: Player[]) {
    players.value = updatedPlayers;
  }

  function resetPlayers() {
    players.value = [];
    sessionStore.resetSession();
    router.push({ name: ROUTE_NAMES.GAME });
  }

  return { players, addPlayer, getRoundScore, updatePlayers, resetPlayers };
});
