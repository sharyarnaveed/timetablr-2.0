<template>
  <main class="dashboard">
    <div class="dashboard-grid">
      <!-- Statistics Cards -->
      <div class="stats-container">
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-info">
            <h3>Total Users</h3>
            <p>{{ totalUsers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-graduation-cap"></i>
          <div class="stat-info">
            <h3>Programs</h3>
            <p>{{ gottenprogram.length }}</p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <section class="chart-section">
        <div class="chart-container">
          <h2>User Growth</h2>
          <linechart/>
        </div>
      </section>

<Adminbarchart/>
    </div>
  </main>
</template>

<script setup>
import Adminbarchart from "@/components/adminbarchart.vue";
import linechart from "@/components/linechart.vue"
import axios from "axios";
import { onMounted, ref } from "vue";

const gottenprogram = ref([]);
const totalUsers = ref(0);

const getcategory = async () => {
  try {
    const [programsResponse, usersResponse] = await Promise.all([
      axios.post("/api/user/getprogramfromdb"),
      axios.post("/api/admin/getTotalUsers")
    ]);
    
    gottenprogram.value = programsResponse.data;
    totalUsers.value = usersResponse.data.count;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  getcategory();
});
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 2rem;
  color: #4CAF50;
}

.stat-info h3 {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-section, .table-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-btn {
  background: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #45a049;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
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

tr:hover {
  background: #f8f8f8;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .chart-section, .table-section {
    padding: 1rem;
  }

  th, td {
    padding: 0.75rem;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 0.5rem;
  }

  .stat-info h3 {
    font-size: 0.75rem;
  }

  .stat-info p {
    font-size: 1.25rem;
  }
}
</style>