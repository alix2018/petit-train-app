import { createMemoryHistory, createRouter } from 'vue-router';

import TheGame from '@/components/TheGame.vue';
import TheHistory from '@/components/TheHistory.vue';

const routes = [
  { path: '/', name: 'game', component: TheGame },
  { path: '/history', name: 'history', component: TheHistory }
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes
});
