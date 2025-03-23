<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import success from "@/components/success.vue";
const successmessage = ref("");
const TheSuccess = ref(false);
const showError = ref(false);

const addprogram = ref({
  programname: "",
});
const gottenprogram = ref([]);

const submitcategory = async () => {
  try {
    if (!addprogram.value.programname) {
      showError.value = true;
      return;
    }
    showError.value = false;
    
    const response = await axios.post("/api/admin/addprogram", addprogram.value);
    
    if (response.data.success) {
      TheSuccess.value = true;
      successmessage.value = response.data.message;
      addprogram.value.programname = "";
      await getcategory();

      setTimeout(() => {
        TheSuccess.value = false;
      }, 5000);
    }
  } catch (error) {
    console.error("Error adding program:", error);
  }
};

const getcategory = async () => {
  const getcateg = await axios.post("/api/user/getprogramfromdb");
  gottenprogram.value = getcateg.data;

  console.log(gottenprogram.value);
};

const deletprogram = async (id) => {
  try {
    const responce = await axios.post("/api/admin/deleteprogram", { id });
    // console.log(responce.data);
    if (responce.data.success) {
      TheSuccess.value = true;
      successmessage.value = responce.data.message;
      getcategory();
    }
  } catch (error) {
    console.log("error in deletion", error);
  }
};

const confirmDelete = (id) => {
  if (confirm('Are you sure you want to delete this program?')) {
    deletprogram(id);
  }
};

onMounted(async () => {
  await getcategory();
});
</script>

<template>
  <div class="category-container">
    <success v-if="TheSuccess" :messagevalue="successmessage" />

    <div class="content-wrapper">
      <div class="add-program-card">
        <h2>Add New Program</h2>
        <form @submit.prevent="submitcategory" class="add-program-form">
          <div class="input-group">
            <input 
              v-model="addprogram.programname" 
              type="text" 
              placeholder="Enter program name"
              :class="{ 'error': showError }"
            />
            <p v-if="showError" class="error-message">Program name is required</p>
          </div>
          <button type="submit" class="submit-btn">
            <i class="fas fa-plus"></i> Add Program
          </button>
        </form>
      </div>

      <div class="programs-list-card">
        <h2>Existing Programs</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Program ID</th>
                <th>Program Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="program in gottenprogram" :key="program.program_id">
                <td>{{ program.program_id }}</td>
                <td>{{ program.program_name }}</td>
                <td>
                  <button @click="confirmDelete(program.program_id)" class="delete-btn">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.content-wrapper {
  display: grid;
  gap: 2rem;
}

.add-program-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.programs-list-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.add-program-form {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.input-group {
  flex: 1;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
}

input.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #45a049;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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

.delete-btn {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #d32f2f;
}

@media (max-width: 768px) {
  .add-program-form {
    flex-direction: column;
  }
  
  .submit-btn {
    width: 100%;
  }
}
</style>
