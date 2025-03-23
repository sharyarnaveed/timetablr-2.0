<template>
  <div class="users-container">
    <div class="header-section">
      <h2>User Management</h2>
      <div class="search-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by username, full name or program..."
          class="search-input"
        />
        <i class="fas fa-search search-icon"></i>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Program</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.user_id">
            <td>{{ user.user_id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.full_name }}</td>
            <td>{{ user.program }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="no-results">
        No users found matching your search
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';

const users = ref([]);
const searchQuery = ref('');

const getusers = async () => {
  try {
    const response = await axios.post("/api/admin/getuserinfo");
    users.value = response.data.user;
  } catch (error) {
    console.log(error, "error in getting users");
  }
};

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.full_name.toLowerCase().includes(query) ||
    user.program.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await getusers();
});
</script>

<style scoped>
.users-container {
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
  .users-container {
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