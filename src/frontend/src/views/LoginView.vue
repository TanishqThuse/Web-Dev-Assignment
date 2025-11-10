<template>
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
</style>
