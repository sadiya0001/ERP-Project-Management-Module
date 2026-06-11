<template>
  <div class="tasks-page">
    <div class="breadcrumb">
      <router-link to="/projects">Projects</router-link>
      <span class="separator">/</span>
      <span class="current">{{ project?.title || 'Loading...' }}</span>
    </div>
    
    <div class="project-header">
      <div class="header-left">
        <h2 class="project-title">{{ project?.title || 'Loading...' }} <span class="emoji">👨‍💻</span></h2>
        
        <div class="team-avatars" v-if="project?.members?.length">
          <img 
            v-for="member in project.members.slice(0, 4)" 
            :key="member.id"
            :src="member.user?.avatar || `https://ui-avatars.com/api/?name=${member.user?.first_name || 'U'}`" 
            :alt="member.user?.first_name" 
            class="avatar" 
          />
          <div class="avatar-more" v-if="project.members.length > 4">+{{ project.members.length - 4 }}</div>
        </div>
        
        <div class="status-badge" :class="project?.status === 'active' ? 'on-track' : ''">
          {{ project?.status === 'active' ? 'OnTrack' : 'OffTrack' }}
        </div>
      </div>
      
      <div class="header-right">
        <button class="assign-btn" @click="showTaskModal = true">Assign Task</button>
        
        <div class="metrics">
          <div class="metric">
            <span class="metric-label">Time spent</span>
            <div class="metric-value">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              --
            </div>
          </div>
          <div class="metric">
            <span class="metric-label">Deadline</span>
            <div class="metric-value success">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {{ project?.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tasks-list-container">
      <div v-if="loading" style="padding: 20px; text-align: center;">Loading tasks...</div>
      <div v-else-if="tasks.length === 0" style="padding: 40px; text-align: center; color: #6b7280;">No tasks found for this project.</div>
      <div v-else class="tasks-list">
        <TaskRow 
          v-for="task in tasks" 
          :key="task.id" 
          :task="task" 
        />
      </div>
      
      <div class="list-footer">
        <div class="footer-stats">
          <span class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            {{ tasks.length }} tasks
          </span>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="showTaskModal" class="modal-overlay" @click.self="showTaskModal = false">
      <div class="modal-content">
        <h3>Assign New Task</h3>
        <form @submit.prevent="handleCreateTask">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="newTask.title" required placeholder="Task title" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newTask.description" required placeholder="Describe the task..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Deadline</label>
              <input type="date" v-model="newTask.deadline" required />
            </div>
            <div class="form-group">
              <label>Assign To</label>
              <select v-model="newTask.assignedTo">
                <option :value="null">Unassigned</option>
                <option v-for="member in project?.members" :key="member.user_id" :value="member.user_id">
                  {{ member.user?.first_name }} {{ member.user?.last_name }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showTaskModal = false">Cancel</button>
            <button type="submit" class="save-btn" :disabled="creatingTask">
              {{ creatingTask ? 'Creating...' : 'Assign Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TaskRow from '../components/TaskRow.vue';
import api from '../services/api';

const route = useRoute();
const project = ref(null);
const tasks = ref([]);
const loading = ref(true);

const showTaskModal = ref(false);
const creatingTask = ref(false);
const newTask = reactive({
  title: '',
  description: '',
  deadline: '',
  assignedTo: null
});

const handleCreateTask = async () => {
  try {
    creatingTask.value = true;
    await api.post(`/projects/${route.params.id}/tasks`, {
      title: newTask.title,
      description: newTask.description,
      deadline: newTask.deadline,
      assigned_to: newTask.assignedTo ? Number(newTask.assignedTo) : undefined
    });
    
    // Reset form and hide modal
    showTaskModal.value = false;
    newTask.title = '';
    newTask.description = '';
    newTask.deadline = '';
    newTask.assignedTo = null;
    
    // Show success message
    alert('Task assigned successfully!');
    
    // Refresh task list
    await fetchProjectData();
  } catch (error) {
    console.error('Failed to create task:', error);
    alert('Failed to create task. Please try again.');
  } finally {
    creatingTask.value = false;
  }
};

const fetchProjectData = async () => {
  try {
    loading.value = true;
    const response = await api.get(`/projects/${route.params.id}`);
    project.value = response.data.project;
    
    // Map tasks to what TaskRow.vue expects
    tasks.value = (project.value.tasks || []).map(t => ({
      id: t.id,
      taskId: `#TSK-${t.id}`,
      title: t.title || 'Untitled Task',
      createdBy: project.value.creator?.first_name || 'Admin',
      daysAgo: Math.floor((new Date() - new Date(t.created_at)) / (1000 * 60 * 60 * 24)) || 0,
      status: t.status === 'done' ? 'Completed' : (t.status === 'in_progress' ? 'In Progress' : 'Pending'),
      timeSpent: '00:00:00',
      deadline: t.deadline || null,
      assignee: {
        name: t.assignee?.first_name || 'Unassigned',
        avatar: t.assignee?.avatar || `https://ui-avatars.com/api/?name=${t.assignee?.first_name || 'U'}&background=random`
      }
    }));
  } catch (error) {
    console.error('Failed to load project details:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjectData();
});
</script>

<style scoped>
.tasks-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 24px;
  color: var(--text-gray, #6b7280);
}

.breadcrumb a {
  color: var(--primary-color, #4a90d9);
  text-decoration: none;
}

.separator {
  margin: 0 8px;
}

.current {
  color: var(--text-dark, #1a1d29);
  font-weight: 500;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.project-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark, #1a1d29);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.emoji {
  font-size: 20px;
}

.team-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #f5f7fa;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fee2e2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid #f5f7fa;
  margin-left: -8px;
  z-index: 10;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.on-track {
  background-color: #dcfce7;
  color: #16a34a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.assign-btn {
  background-color: var(--primary-color, #4a90d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.metrics {
  display: flex;
  gap: 24px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 12px;
  color: var(--text-gray, #6b7280);
}

.metric-value {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dark, #1a1d29);
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 12px;
}

.metric-value.success {
  background-color: #dcfce7;
  color: #16a34a;
}

.tasks-list-container {
  background-color: var(--card-bg, #ffffff);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.list-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}

.footer-stats {
  display: flex;
  gap: 16px;
  color: var(--text-gray, #6b7280);
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .metrics {
    justify-content: space-between;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  color: var(--text-dark, #1a1d29);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-gray, #6b7280);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-dark, #1a1d29);
}

.save-btn {
  background-color: var(--primary-color, #4a90d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  cursor: pointer;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
