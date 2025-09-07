<template>
    <div class="timetable-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Program</th>
            <th>Course Name</th>
            <th>Venue</th>
            <th>update</th>
            <th>delete</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in timetable" :key="entry.timetable_id">
            <td>{{ entry.timetable_id }}</td>
            <td>
              <input 
                type="text" 
                v-model="entry.day"
                class="form-input"
              />
            </td>
            <td>
              <input 
                type="time" 
                v-model="entry.start_time"
                class="form-input"
              />
            </td>
            <td>
              <input 
                type="time" 
                v-model="entry.end_time"
                class="form-input"
              />
            </td>
            <td>{{ entry.program_name }}</td>
            <td>
              <input 
                type="text" 
                v-model="entry.course_name"
                class="form-input"
              />
            </td>
            <td>{{ entry.venue }}</td>
            <td>
              <button 
                @click="updateTimetable(entry)"
                class="update-btn"
                :disabled="isUpdating"
              >
                {{ isUpdating ? 'Updating...' : 'Update' }}
              </button>
            </td>


             <td>
              <button 
                @click="deletetimetable(entry.timetable_id)"
                class="update-delete"
                
              >
               Delete
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import axios from 'axios'
import api from '@/api'
  
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  })
  
  const timetable = ref([])
  const isUpdating = ref(false)
  
  const updateTimetable = async (entry) => {
    try {
      isUpdating.value = true
      const payload = {
        timetableID: entry.timetable_id,
        day: entry.day,
        starttime: entry.start_time,
        endtime: entry.end_time,
        coursename: entry.course_name
      }
  
      const response = await axios.post("/api/admin/updatetimetable", payload)
      
      // Show success message or handle response
      alert('Timetable updated successfully!')
    } catch (error) {
      console.error('Error updating timetable:', error)
      alert('Failed to update timetable. Please try again.')
    } finally {
      isUpdating.value = false
    }
  }
  
  const getTimetable = async (id) => {
    try {
      const response = await axios.post("/api/admin/timetabledata", {
        program_id: id
      })
      timetable.value = response.data.timetable
    } catch (error) {
      console.error("Error fetching timetable:", error)
      alert('Failed to load timetable data. Please refresh the page.')
    }
  }

  const deletetimetable=async(id)=>
  {
try {
  console.log(id);
  
 const responce = await api.delete("/api/admin/deletethetimetablerow", {
      data: { deleteid: id },   // ✅ you must wrap it inside "data"
    });
    if(responce.data.success)
    {
      alert("row deleted")
      getTimetable(props.id)
    }
} catch (error) {
  console.log(error);
  
}
  }
  
  onMounted(async () => {
    await getTimetable(props.id)
  })
  </script>
  
  <style scoped>
  .update-delete{
        background-color: #e72e0d;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .timetable-container {
    max-width: 100%;
    overflow-x: auto;
  }
  
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    min-width: 800px;
  }
  
  td,
  th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .form-input {
    width: 100%;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .update-btn {
    background-color: #4CAF50;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .update-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .update-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  </style>