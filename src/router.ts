import { createRouter, createWebHistory } from 'vue-router';
import TheGame from '@/components/TheGame.vue';
import TheHistory from '@/components/TheHistory.vue';
import { useSessionStore } from '@/stores';
import { LOCAL_STORAGE_ROUND_COUNTER } from '@/constants';

export const ROUTE_NAMES = {
  GAME: 'game',
  ROUND: 'round',
  HISTORY: 'history'
} as const;

const routes = [
  { path: '/', name: ROUTE_NAMES.GAME, component: TheGame },
  { path: '/:id', name: ROUTE_NAMES.ROUND, component: TheGame },
  { path: '/history', name: ROUTE_NAMES.HISTORY, component: TheHistory }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const sessionStore = useSessionStore();

  if (to.name !== ROUTE_NAMES.ROUND) {
    return true;
  }

  const paramId = Number(to.params.id);
  const isNumber = !Number.isNaN(paramId);
  const storedRoundCounter = Number(localStorage.getItem(LOCAL_STORAGE_ROUND_COUNTER));

  if (!isNumber || paramId < 0) {
    return {
      name: ROUTE_NAMES.ROUND,
      params: { id: storedRoundCounter }
    };
  }

  if (!sessionStore.gameStarted) {
    return { name: ROUTE_NAMES.GAME };
  }

  return true;
});
