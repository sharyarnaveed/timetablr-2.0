<template>
    <table>
        <tr>
          <th>Repeat Id</th>
          <th>User name</th>

          <th>Repeat Course</th>

        </tr>
        <tr v-for="(program, index) in gottenprogram" :key="program.program_id">
          <td>{{ program.program_id }}</td>
          <td>{{ program.full_name }}</td>
          <td>{{ program.course_name }}</td>

          <td>
          </td>
        </tr>
      </table>
</template>

<script setup>
import axios from 'axios';
import { onMounted,ref } from 'vue';
const gottenprogram = ref([]);


const getrepeatadmin=async()=>
{
try {
    
const reponce=await axios.post("/api/admin/adminrepeat");
gottenprogram.value=reponce.data


} catch (error) {
    console.log("get repeat courses",error);
    
}
}


onMounted(async()=>
{
    await getrepeatadmin();
})
</script>

<style scoped>

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  overflow-y: auto;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>