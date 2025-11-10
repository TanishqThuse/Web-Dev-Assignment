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

    <!-- <ul class="tasks">
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
    </ul> -->
  
    <ul class="tasks">
    <li 
        v-for="task in filteredTasks"
        :key="task.id"
        tabindex="0"
        :class="['task-card']"  >
        <div class="task-header">
            <strong>{{ task.title }}</strong>
            <span :class="['status', task.status.replace(' ', '-')]"> 
                {{ task.status }}
            </span>
        </div>
        
        <p class="meta">
            Assignee: {{ task.assignee_id || '—' }} | 
            Creator: {{ task.creator_id || '—' }}
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

<style>
/* ------------------------------------------- */
/* TASK CARD STYLES */
/* ------------------------------------------- */
.task-card { 
    background-color: #1f2937; /* Lighter container background */
    border: 1px solid #374151; /* Subtle border */
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; 
    transition: transform 0.2s;
}

.task-card:hover {
    transform: translateY(-2px); /* Subtle hover effect */
}

/* Task Title Hierarchy */
.task-header strong {
    font-size: 1.15rem;
    font-weight: 700;
    color: #f3f4f6;
}

/* Status Signaling (Pill Shape) */
.status {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: 12px;
    text-transform: uppercase;
    display: inline-block;
    letter-spacing: 0.5px;
}

/* Dynamic Status Colors */
.status.to-do {
    background-color: #3b82f633; /* Light Blue BG */
    color: #93c5fd; 
}
.status.in-progress {
    background-color: #f59e0b33; /* Light Amber BG */
    color: #fcd34d;
}
.status.done {
    background-color: #10b98133; /* Light Green BG */
    color: #6ee7b7;
}

/* Metadata (Assignee/Creator) */
.meta {
    font-size: 0.8rem;
    color: #9ca3af; /* Soften the text */
    border-bottom: 1px solid #374151; /* Subtle separation line */
    padding-bottom: 0.5rem;
}

/* ------------------------------------------- */
/* FORM AND LAYOUT STYLES */
/* ------------------------------------------- */
.create {
    background-color: #1f2937; 
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid #374151;
}

.create h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #f3f4f6;
    border-bottom: 1px dashed #374151;
    padding-bottom: 0.5rem;
}

.create form {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: 2fr 1fr 1fr 0.5fr; /* Layout columns: Title, Status, Assignee, Button */
    align-items: end;
}

.create input, .create select {
    padding: 0.5rem;
    background-color: #374151; 
    border: 1px solid #4b5563;
    color: white;
    border-radius: 4px;
    width: 100%;
}

.filters {
    padding: 0.5rem 0;
}

.tasks {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Grid layout for tasks */
    gap: 1rem;
}

button[type="submit"] {
    background-color: #10b981; /* Primary Action Color */
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

button[type="submit"]:hover {
    background-color: #059669;
}
</style>
