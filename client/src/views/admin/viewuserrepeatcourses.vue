<template>
  <div class="repeat-courses-container">
    <div class="header-section">
      <h2>Repeat Courses Management</h2>
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or course..."
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Repeat Course</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="program in filteredPrograms" :key="program.program_id">
            <td>{{ program.program_id }}</td>
            <td>{{ program.full_name }}</td>
            <td>{{ program.course_name }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!filteredPrograms.length" class="no-results">
        No repeat courses found
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const gottenprogram = ref([]);
const searchQuery = ref('');

const filteredPrograms = computed(() => {
  if (!searchQuery.value) return gottenprogram.value;
  
  const query = searchQuery.value.toLowerCase();
  return gottenprogram.value.filter(program => 
    program.full_name.toLowerCase().includes(query) ||
    program.course_name.toLowerCase().includes(query)
  );
});

const getrepeatadmin = async () => {
  try {
    const response = await axios.post("/api/admin/adminrepeat");
    gottenprogram.value = response.data;
  } catch (error) {
    console.error("Error fetching repeat courses:", error);
  }
};

onMounted(async () => {
  await getrepeatadmin();
});
</script>

<style scoped>
.repeat-courses-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.header-section {
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.search-wrapper {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: auto;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

tbody tr:hover {
  background: #f8f8f8;
}

tr:nth-child(even) {
  background: #fafafa;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .repeat-courses-container {
    padding: 0.5rem;
    height: calc(100vh - 2rem);
  }

  th, td {
    padding: 0.75rem;
  }
  
  .search-input {
    font-size: 0.875rem;
  }

  h2 {
    font-size: 1.25rem;
  }
}
</style>