import { ref, computed } from 'vue';
import router from '../router';

const token = ref(sessionStorage.getItem('token') || '');
const role = ref(sessionStorage.getItem('role') || '');

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  async function login(email, password) {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    token.value = data.token;
    role.value = data.role;
    sessionStorage.setItem('token', token.value);
    sessionStorage.setItem('role', role.value);
    await router.push('/dashboard');
  }

  function logout() {
    const t = token.value;
    token.value = '';
    role.value = '';
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    if (t) {
      fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}` }
      }).catch(() => {});
    }
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  }

  function getAuthHeaders() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return { token, role, isAuthenticated, login, logout, getAuthHeaders };
}
