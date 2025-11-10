<template>
  <section aria-label="Tasks dashboard">
    <h2>Tasks</h2>

    <div class="filters" role="radiogroup" aria-label="Filter by status">
      <button
        v-for="s in statuses"
        :key="s"
        @click="statusFilter = s"
        :class="{ active: statusFilter === s }"
      >
        {{ s }}
      </button>
    </div>

    <div class="create" v-if="canCreate">
      <h3>Create Task</h3>
      <form @submit.prevent="createTask">
        <input v-model="newTitle" placeholder="Task title" required />
        <select v-model="newStatus">
          <option value="to do">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          v-model.number="newAssignee"
          type="number"
          min="1"
          placeholder="Assignee user id (optional)"
        />
        <button type="submit" :disabled="creating">
          {{ creating ? 'Creating...' : 'Add Task' }}
        </button>
      </form>
    </div>

    <p v-if="loading">Loading tasks...</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <ul class="tasks">
      <li
        v-for="task in filteredTasks"
        :key="task.id"
        tabindex="0"
        :aria-label="`Task ${task.title}`"
      >
        <div class="task-header">
          <strong>{{ task.title }}</strong>
          <span class="status">{{ task.status }}</span>
        </div>
        <p class="meta">
          Assignee: {{ task.assignee_id || '—' }} |
          Creator: {{ task.creator_id || '—' }}
        </p>
        <p class="latest">
          Latest: {{ task.latest_update || 'No updates yet' }}
          <span v-if="task.latest_update_at">
            ({{ new Date(task.latest_update_at).toLocaleString() }})
          </span>
        </p>

        <form @submit.prevent="submitUpdate(task)" class="update-form">
          <input
            v-model="draftUpdates[task.id]"
            placeholder="Add update..."
            :aria-label="`Add update to ${task.title}`"
          />
          <button type="submit">Post</button>
        </form>

        <p v-if="optimistic[task.id]" class="optimistic">
          Sending: {{ optimistic[task.id] }}
        </p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';

const { getAuthHeaders, role } = useAuth();

const tasks = ref([]);
const loading = ref(false);
const error = ref('');
const statuses = ['All', 'To Do', 'In Progress', 'Done'];
const statusFilter = ref('All');

const newTitle = ref('');
const newStatus = ref('to do');
const newAssignee = ref(null);
const creating = ref(false);

const draftUpdates = ref({});
const optimistic = ref({});

const canCreate = computed(() =>
  role.value === 'contributor' || role.value === 'moderator'
);

const filteredTasks = computed(() => {
  if (statusFilter.value === 'All') return tasks.value;
  const map = {
    'To Do': 'to do',
    'In Progress': 'in progress',
    'Done': 'done'
  };
  return tasks.value.filter(t => t.status === map[statusFilter.value]);
});

async function loadTasks() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('http://localhost:3000/tasks', {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load tasks');
    tasks.value = data;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function createTask() {
  if (!newTitle.value.trim()) return;
  creating.value = true;
  error.value = '';
  try {
    const res = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle.value.trim(),
        status: newStatus.value,
        assignee_id: newAssignee.value || null
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create task');
    tasks.value.unshift(data);
    newTitle.value = '';
    newStatus.value = 'to do';
    newAssignee.value = null;
  } catch (e) {
    error.value = e.message;
  } finally {
    creating.value = false;
  }
}

async function submitUpdate(task) {
  const text = (draftUpdates.value[task.id] || '').trim();
  if (!text) return;
  // optimistic UI
  optimistic.value[task.id] = text;
  draftUpdates.value[task.id] = '';
  try {
    const res = await fetch('http://localhost:3000/updates', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_id: task.id, body: text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add update');
    // refresh tasks to show latest update
    await loadTasks();
  } catch (e) {
    error.value = e.message;
  } finally {
    delete optimistic.value[task.id];
  }
}

onMounted(loadTasks);
</script>

<style>
.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.filters button.active {
  font-weight: bold;
  text-decoration: underline;
}
.tasks {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
li {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #4b5563;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status {
  font-size: 0.8rem;
  opacity: 0.8;
}
.meta, .latest {
  font-size: 0.8rem;
}
.update-form {
  margin-top: 0.25rem;
  display: flex;
  gap: 0.35rem;
}
.update-form input {
  flex: 1;
}
.optimistic {
  font-size: 0.75rem;
  opacity: 0.7;
}
.error {
  color: #dc2626;
}
</style>
