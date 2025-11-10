import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth();
  if (to.name !== 'login' && !isAuthenticated.value) {
    return { name: 'login' };
  }
  if (to.name === 'login' && isAuthenticated.value) {
    return { name: 'dashboard' };
  }
});

export default router;
