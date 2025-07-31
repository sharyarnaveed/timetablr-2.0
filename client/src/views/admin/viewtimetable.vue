<template>
  <div class="timetable-container">
    <div class="control-panel">
      <h2>Timetable Management</h2>
      
      <div class="program-selector">
        <div class="search-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search program..."
            class="search-input"
          />
          <i class="fas fa-search search-icon"></i>
        </div>

        <select v-model="selectedOption" class="select-input" size="5">
          <option disabled value="">Select Program</option>
          <option v-for="option in filteredOptions" 
                  :key="option.program_id" 
                  :value="option.program_id"
                  :class="{ 'highlighted': searchQuery && option.program_name.toLowerCase().includes(searchQuery.toLowerCase()) }">
            {{ option.program_name }}
          </option>
        </select>
        
        <div class="action-buttons">
          <button @click="gettimetable" 
                  class="btn search-btn" 
                  :disabled="!selectedOption">
            <i class="fas fa-search"></i> View Timetable
          </button>
          
          <button @click="edittimetable" 
                  class="btn edit-btn" 
                  :disabled="!selectedOption">
            <i class="fas fa-edit"></i> Edit
          </button>
          
          <button @click="confirmDelete" 
                  class="btn delete-btn" 
                  :disabled="!selectedOption">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>

    <div class="table-container" v-if="timetable && timetable.length">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Program</th>
            <th>Course Name</th>
            <th>Venue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in timetable" :key="data.timetable_id">
            <td>{{ data.day }}</td>
            <td>{{ data.start_time }}</td>
            <td>{{ data.end_time }}</td>
            <td>{{ data.program_name }}</td>
            <td>{{ data.course_name }}</td>
            <td>{{ data.venue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="selectedOption" class="no-data">
      No timetable data available for selected program
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, computed } from "vue";
  const searchQuery = ref("");
  const selectedOption = ref("");

  const options = ref([]); 
  import axios from "axios";
  import router from "@/router";
  const timetable = ref();

  const getprogramoptions = async () => {
    try {
      const response = await axios.get("/api/user/getprogramfromdb");
      options.value = response.data;
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  onMounted(async () => {
    await getprogramoptions();
  });

  const gettimetable = async () => {
    try {
      const response = await axios.post("/api/admin/timetabledata", { program_id: selectedOption.value });
      timetable.value = response.data.timetable;
      console.log(timetable.value);
    } catch (error) {
      console.log("error in getting timetable", error);
    }
  };

  const deletetimetable = async () => {
    try {
      const response = await axios.post("/api/admin/deletetimetabledata", { program_id: selectedOption.value });
      if (response.data.success) {
        alert("timetable deleted");
      }
    } catch (error) {
      console.log("error in deleting timetable", error);
    }
  };

  const edittimetable = () => {
    router.push(`/totheadmindashboard/edittimetable/${selectedOption.value}`);
  };

  const confirmDelete = () => {
    if (confirm('Are you sure you want to delete this timetable?')) {
      deletetimetable();
    }
  };

  const filteredOptions = computed(() => {
    if (!searchQuery.value) return options.value;
    return options.value.filter(option => 
      option.program_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
</script>

<style scoped>
.timetable-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.control-panel {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.program-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.select-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn {
  background: #4CAF50;
  color: white;
}

.search-btn:hover:not(:disabled) {
  background: #45a049;
}

.edit-btn {
  background: #2196F3;
  color: white;
}

.edit-btn:hover:not(:disabled) {
  background: #1976D2;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background: #d32f2f;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-family: system-ui, -apple-system, sans-serif;
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

.no-data {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  th, td {
    padding: 0.75rem;
  }
}

/* Add these new styles */
.search-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  padding-left: 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.select-input {
  height: auto;
  max-height: 200px;
  overflow-y: auto;
}

.highlighted {
  background-color: #e3f2fd;
}
</style>