<template>
  <div class="projects-page">
    <div class="page-header">
      <h2>Projects</h2>
      <button class="create-btn" @click="$router.push('/projects/create')">Create</button>
    </div>
    
    <div class="projects-grid">
      <ProjectCard 
        v-for="project in projects" 
        :key="project.id" 
        :project="project" 
      />
    </div>
    
    <div class="pagination">
      <button class="page-btn prev">Previous</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn next">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProjectCard from '../components/ProjectCard.vue';
import api from '../services/api';

const projects = ref([]);
const loading = ref(true);
const error = ref('');

const fetchProjects = async () => {
  try {
    loading.value = true;
    const response = await api.get('/projects');
    
    // Map backend project data to the format ProjectCard expects
    projects.value = response.data.projects.map(p => {
      // Determine colors based on status
      const isActive = p.status === 'active' || p.status === 'OnTrack';
      
      return {
        id: p.id,
        title: p.title || 'Untitled Project',
        description: p.description || 'No description provided.',
        date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase() : '',
        status: isActive ? 'OnTrack' : 'OffTrack',
        statusColor: isActive ? '#10b981' : '#ef4444', // Green for active, Red for anything else
        statusBg: isActive ? '#d1fae5' : '#fee2e2',
        issues: p.Tasks ? p.Tasks.length : 0,
        team: p.Members ? p.Members.slice(0, 4).map(m => ({
          id: m.id,
          avatar: m.User?.avatar || `https://ui-avatars.com/api/?name=${m.User?.first_name || 'U'}&background=random`
        })) : []
      };
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    error.value = 'Failed to load projects. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.projects-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-dark, #1a1d29);
  margin: 0;
}

.create-btn {
  background-color: var(--primary-color, #4a90d9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #3b76b8;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.page-btn {
  background: transparent;
  border: none;
  color: var(--text-gray, #6b7280);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
}

.page-btn.active {
  background-color: var(--primary-color, #4a90d9);
  color: white;
}

.page-btn:hover:not(.active) {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (max-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
