<!-- <template>
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
</template> -->

<template>
  <div :class="['app', theme]">
    <header class="app-header">
      <h1 class="header-title">Collaboration Hub</h1> 
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


.app {
    /* ... existing styles ... */
    font-family: 'Inter', system-ui, sans-serif; /* Use a modern font stack */
}

/* Dark Mode Colors (Focus of the visual update) */
.app.dark {
    background: #111827; /* Deep Charcoal Background */
    color: #e5e7eb;      /* Off-White Text */
}

/* Container/Card Background */
.task-card, .create-form-container, .filters {
    background-color: #1f2937; /* Lighter container background */
    border: 1px solid #374151; /* Subtle border */
    border-radius: 8px;
}

/* Primary Action Button Style */
button.primary-action {
    background-color: #10b981; /* Vibrant Emerald Green */
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 600;
    transition: background-color 0.2s;
}
button.primary-action:hover {
    background-color: #059669;
}

/* Update the global theme colors to our new palette */
.app.dark {
    background: #111827;
    color: #e5e7eb;
}

.app-header {
    background-color: #1f2937; /* Header slightly lighter than body */
    border-bottom: 1px solid #374151; 
}

/* In your App.vue <style> block: */

.header-title {
    /* Change the color from the vibrant green to white for better contrast */
    color: white !important; /* Use !important if needed to override other styles */
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
}

/* In your App.vue <style> block: */

.header-title {
    /* Change the color from the vibrant green to white for better contrast */
    color: white !important; /* Use !important if needed to override other styles */
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
} 

</style>
