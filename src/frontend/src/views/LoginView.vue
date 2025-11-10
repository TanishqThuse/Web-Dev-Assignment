<!-- <template>
  <section class="login" aria-label="Login">
    <h2>Sign in</h2>
    <form @submit.prevent="onSubmit">
      <label>
        Email
        <input v-model="email" type="email" required autocomplete="email" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <p class="hint">
        viewer@mail.com / viewer123<br />
        contrib@mail.com / contrib123<br />
        mod@mail.com / mod123
      </p>
    </form>
  </section>
</template> -->

<template>
  <div class="login-container"> 
    
    <section class="login-card" aria-label="Login"> 
      <h2>Sign in</h2>
      <form @submit.prevent="onSubmit">
        <input v-model="email" type="email" placeholder="Email" required autocomplete="email" />
        <input v-model="password" type="password" placeholder="Password" required autocomplete="current-password" />
        <button type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
        <p v-if="error" class="error" role="alert">{{ error }}</p>

        <p class="hint">
          viewer@mail.com / viewer123<br />
          contrib@mail.com / contrib123<br />
          mod@mail.com / mod123
        </p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { login } = useAuth();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await login(email.value.trim(), password.value);
  } catch (e) {
    error.value = e.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.login {
  max-width: 320px;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
input {
  width: 100%;
  padding: 0.4rem;
}
.error {
  color: #dc2626;
}
.hint {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Add these styles to the <style> block in LoginView.vue */

.login-container {
    /* Centering the content in the viewport */
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.login-card {
    background-color: #1f2937; /* Use the dark card background color */
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); /* Add depth */
    max-width: 360px;
    width: 100%;
}

.login-card h2 {
    color: #f3f4f6;
    margin-bottom: 20px;
    border-bottom: 1px solid #374151; /* Subtle divider */
    padding-bottom: 10px;
}

/* Input Fields */
.login-card input {
    background-color: #374151; /* Darker input field */
    color: #e5e7eb;
    border: 1px solid #4b5563;
    padding: 10px;
    border-radius: 4px;
    width: 100%;
    margin-bottom: 15px; /* Add vertical spacing */
}

/* Primary Button (Use the vibrant green) */
.login-card button[type="submit"] {
    background-color: #10b981; /* Vibrant Emerald Green */
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.2s;
}

.login-card button[type="submit"]:hover {
    background-color: #059669;
}

/* Hint Text */
.login-card .hint {
    color: #9ca3af; /* Soften the hint text */
    font-size: 0.8rem;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #374151;
}
</style>
