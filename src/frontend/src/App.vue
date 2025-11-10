<template>
  <div :class="['app', theme]">
    <header class="app-header">
      <h1>Collaboration Hub</h1>
      <div class="spacer"></div>
      <button @click="toggleTheme" aria-label="Toggle theme">
        {{ theme === 'light' ? '🌙' : '☀️' }}
      </button>
      <button v-if="isAuthenticated" @click="logout">Logout</button>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuth } from './composables/useAuth';

const { isAuthenticated, logout: doLogout } = useAuth();
const theme = ref('light');

onMounted(() => {
  const stored = sessionStorage.getItem('theme');
  if (stored) theme.value = stored;
});

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  sessionStorage.setItem('theme', theme.value);
}

function logout() {
  doLogout();
}
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: system-ui, sans-serif;
}
.app.light {
  background: #f5f5f5;
  color: #111;
}
.app.dark {
  background: #111827;
  color: #e5e7eb;
}
.app-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #444;
}
.spacer { flex: 1; }
button {
  margin-left: 0.5rem;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
}
main {
  padding: 1rem;
}
</style>
