import { createRouter, createWebHistory } from 'vue-router';

import TheGame from '@/components/TheGame.vue';
import TheHistory from '@/components/TheHistory.vue';

const routes = [
  { path: '/', name: 'game', component: TheGame },
  { path: '/:id', name: 'round', component: TheGame },
  { path: '/history', name: 'history', component: TheHistory }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
